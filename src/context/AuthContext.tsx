import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  auth,
  googleProvider,
  signInWithPopup,
  firebaseSignOut,
  db,
  doc,
  getDoc,
  setDoc,
  handleFirestoreError,
  OperationType,
} from '../lib/firebase';
import { User as FirebaseUser } from 'firebase/auth';
import { SupportedLanguage } from '../lib/i18n';

export interface StudentProfile {
  uid: string;
  name: string;
  email: string;
  college: string;
  degree: string;
  department: string;
  gradYear: string;
  careerInterests: string;
  preferredLanguage: SupportedLanguage;
  role: 'student' | 'admin';
  readinessScore: number;
  createdAt: string;
  updatedAt: string;
}

const DEFAULT_DEMO_STUDENT: StudentProfile = {
  uid: 'demo-student-id',
  name: 'Arjun Sharma',
  email: 'arjun.placement@campus.edu',
  college: 'National Institute of Technology',
  degree: 'B.Tech',
  department: 'Computer Science & Engineering',
  gradYear: '2026',
  careerInterests: 'Software Development Engineer, Cloud Architecture, Systems',
  preferredLanguage: 'en',
  role: 'student',
  readinessScore: 78,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

interface AuthContextType {
  currentUser: FirebaseUser | null;
  profile: StudentProfile | null;
  loading: boolean;
  isDemoUser: boolean;
  signInWithGoogle: () => Promise<void>;
  loginAsDemoStudent: () => void;
  signOut: () => Promise<void>;
  updateProfile: (updated: Partial<StudentProfile>) => Promise<void>;
  setLanguage: (lang: SupportedLanguage) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<StudentProfile | null>(() => {
    // Check local storage for persistent session
    const saved = localStorage.getItem('prepsphere_user_profile');
    return saved ? JSON.parse(saved) : DEFAULT_DEMO_STUDENT;
  });
  const [isDemoUser, setIsDemoUser] = useState<boolean>(() => {
    return !localStorage.getItem('prepsphere_auth_mode_firebase');
  });
  const [loading, setLoading] = useState<boolean>(false);

  // Sync to local storage
  useEffect(() => {
    if (profile) {
      localStorage.setItem('prepsphere_user_profile', JSON.stringify(profile));
    }
  }, [profile]);

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setCurrentUser(user);
        setIsDemoUser(false);
        localStorage.setItem('prepsphere_auth_mode_firebase', 'true');

        // Fetch or create profile in Firestore
        const userDocRef = doc(db, 'users', user.uid);
        try {
          const snapshot = await getDoc(userDocRef);
          if (snapshot.exists()) {
            const data = snapshot.data() as StudentProfile;
            setProfile(data);
          } else {
            const newProfile: StudentProfile = {
              uid: user.uid,
              name: user.displayName || 'Candidate',
              email: user.email || '',
              college: 'Tech University',
              degree: 'B.Tech',
              department: 'Computer Science',
              gradYear: '2026',
              careerInterests: 'Full-Stack SDE, Cloud & DevOps',
              preferredLanguage: 'en',
              role: user.email === 'manisabarna29@gmail.com' ? 'admin' : 'student',
              readinessScore: 65,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };
            await setDoc(userDocRef, newProfile);
            setProfile(newProfile);
          }
        } catch (err) {
          console.warn('Firestore profile fetch notice:', err);
          // Set fallback profile from auth user
          setProfile({
            uid: user.uid,
            name: user.displayName || 'Candidate',
            email: user.email || '',
            college: 'Campus Tech Institute',
            degree: 'B.Tech / B.E',
            department: 'Computer Science & Engineering',
            gradYear: '2026',
            careerInterests: 'Software Development Engineer',
            preferredLanguage: 'en',
            role: user.email === 'manisabarna29@gmail.com' ? 'admin' : 'student',
            readinessScore: 72,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
        }
      } else {
        setCurrentUser(null);
        if (!localStorage.getItem('prepsphere_demo_active')) {
          // Keep demo student by default for instant friction-free exploration
          setProfile(DEFAULT_DEMO_STUDENT);
          setIsDemoUser(true);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Google Sign In Error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const loginAsDemoStudent = () => {
    setIsDemoUser(true);
    setCurrentUser(null);
    localStorage.removeItem('prepsphere_auth_mode_firebase');
    localStorage.setItem('prepsphere_demo_active', 'true');
    setProfile(DEFAULT_DEMO_STUDENT);
  };

  const signOut = async () => {
    try {
      if (currentUser) {
        await firebaseSignOut(auth);
      }
      localStorage.removeItem('prepsphere_auth_mode_firebase');
      localStorage.removeItem('prepsphere_demo_active');
      loginAsDemoStudent();
    } catch (error) {
      console.error('Sign Out Error:', error);
    }
  };

  const updateProfile = async (updated: Partial<StudentProfile>) => {
    if (!profile) return;
    const newProfile: StudentProfile = {
      ...profile,
      ...updated,
      updatedAt: new Date().toISOString(),
    };
    setProfile(newProfile);

    if (currentUser && !isDemoUser) {
      try {
        const userDocRef = doc(db, 'users', currentUser.uid);
        await setDoc(userDocRef, newProfile, { merge: true });
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, `users/${currentUser.uid}`);
      }
    }
  };

  const setLanguage = (lang: SupportedLanguage) => {
    if (profile) {
      updateProfile({ preferredLanguage: lang });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        profile,
        loading,
        isDemoUser,
        signInWithGoogle,
        loginAsDemoStudent,
        signOut,
        updateProfile,
        setLanguage,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
