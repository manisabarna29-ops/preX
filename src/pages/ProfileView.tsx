import React, { useState } from 'react';
import {
  UserCircle2,
  Save,
  CheckCircle2,
  Globe,
  GraduationCap,
  Briefcase,
  ShieldCheck,
  Award,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useProgress } from '../context/ProgressContext';
import { LANGUAGES, SupportedLanguage } from '../lib/i18n';

export const ProfileView: React.FC = () => {
  const { profile, updateProfile, currentUser, isDemoUser, signInWithGoogle, signOut, setLanguage } =
    useAuth();
  const { placementReadiness } = useProgress();

  const [name, setName] = useState(profile?.name || '');
  const [college, setCollege] = useState(profile?.college || '');
  const [degree, setDegree] = useState(profile?.degree || 'B.Tech');
  const [department, setDepartment] = useState(profile?.department || 'Computer Science & Engineering');
  const [gradYear, setGradYear] = useState(profile?.gradYear || '2026');
  const [careerInterests, setCareerInterests] = useState(
    profile?.careerInterests || 'Software Development Engineer, Cloud Architecture'
  );
  const [role, setRole] = useState<'student' | 'admin'>(profile?.role || 'student');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile({
      name,
      college,
      degree,
      department,
      gradYear,
      careerInterests,
      role,
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 border border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white font-extrabold text-lg flex items-center justify-center shadow-lg shadow-indigo-600/30">
            {profile?.name?.charAt(0) || 'S'}
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">{profile?.name}</h2>
            <p className="text-xs text-slate-400">
              {profile?.college} • Class of {profile?.gradYear}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs">
          <Award className="w-4 h-4 text-amber-400" />
          <span className="text-slate-400">Readiness:</span>
          <span className="font-bold text-white">{placementReadiness}%</span>
        </div>
      </div>

      {/* Account & Auth Status */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <h3 className="font-bold text-sm text-white uppercase tracking-wider">Account & Cloud Sync</h3>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-slate-800/60 border border-slate-700">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white">
                {currentUser ? currentUser.email : isDemoUser ? 'Demo Student Profile (Local Sync)' : 'Guest'}
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {currentUser ? 'Firebase Authenticated' : 'Demo Active'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {currentUser
                ? 'Your learning history is synced to Google Firebase Firestore database.'
                : 'Using interactive demo student mode. Sign in with Google to sync across all devices.'}
            </p>
          </div>

          <div>
            {!currentUser ? (
              <button
                onClick={signInWithGoogle}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition-all"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Link Google Account</span>
              </button>
            ) : (
              <button
                onClick={signOut}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-rose-500/20 text-slate-300 hover:text-rose-400 text-xs font-semibold border border-slate-700 transition-colors"
              >
                Sign Out
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Form Details */}
      <form onSubmit={handleSave} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-5">
        <h3 className="font-bold text-sm text-white uppercase tracking-wider">Academic & Placement Preferences</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs sm:text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">College / University</label>
            <input
              type="text"
              value={college}
              onChange={(e) => setCollege(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs sm:text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Degree</label>
            <input
              type="text"
              value={degree}
              onChange={(e) => setDegree(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs sm:text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Department / Stream</label>
            <input
              type="text"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs sm:text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Graduation Year</label>
            <input
              type="text"
              value={gradYear}
              onChange={(e) => setGradYear(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs sm:text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Target Role / Interests</label>
            <input
              type="text"
              value={careerInterests}
              onChange={(e) => setCareerInterests(e.target.value)}
              placeholder="e.g. SDE, Cloud DevOps, Data Engineer"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs sm:text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Language Preference */}
        <div className="space-y-2 pt-2">
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-2">
            <Globe className="w-4 h-4 text-indigo-400" />
            <span>Preferred Interface Language</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {LANGUAGES.map((lang) => (
              <button
                type="button"
                key={lang.code}
                onClick={() => setLanguage(lang.code)}
                className={`p-2.5 rounded-xl border text-xs font-medium flex items-center justify-between transition-all ${
                  profile?.preferredLanguage === lang.code
                    ? 'bg-indigo-600/30 border-indigo-500 text-white'
                    : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <span>{lang.nativeName}</span>
                <span className="text-[10px] text-slate-400">{lang.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Role Toggle for Admin preview */}
        <div className="pt-2 flex items-center justify-between p-3 rounded-xl bg-slate-800/40 border border-slate-800">
          <div>
            <span className="text-xs font-semibold text-white block">Portal Role Access</span>
            <span className="text-[11px] text-slate-400">Switch role to test the Administrator Dashboard</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setRole('student')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                role === 'student' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'
              }`}
            >
              Student
            </button>
            <button
              type="button"
              onClick={() => setRole('admin')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                role === 'admin' ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-400'
              }`}
            >
              Admin
            </button>
          </div>
        </div>

        {/* Save button & status */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          {saveSuccess ? (
            <span className="text-xs text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> Profile saved successfully!
            </span>
          ) : (
            <span className="text-[11px] text-slate-400">Saved to Firestore session</span>
          )}

          <button
            type="submit"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition-all active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>Save Profile</span>
          </button>
        </div>
      </form>
    </div>
  );
};
