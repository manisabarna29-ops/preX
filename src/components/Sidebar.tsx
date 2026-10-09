import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Home,
  LayoutDashboard,
  Brain,
  Code2,
  Terminal,
  Mic2,
  Headphones,
  BarChart3,
  BookOpen,
  UserCircle2,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Settings,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { TRANSLATIONS } from '../lib/i18n';

interface SidebarProps {
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpenMobile,
  onCloseMobile,
  isCollapsed,
  onToggleCollapse,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { profile, currentUser, signOut } = useAuth();
  const currentLang = profile?.preferredLanguage || 'en';
  const t = (key: string) => TRANSLATIONS[currentLang]?.[key] || TRANSLATIONS.en[key] || key;

  const currentPath = location.pathname;

  const navMenuItems = [
    { label: 'Home', path: '/home', icon: Home, badge: null },
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, badge: null },
    { label: 'Aptitude Practice', path: '/aptitude', icon: Brain, badge: 'Quant/Logic' },
    { label: 'Technical Preparation', path: '/technical', icon: Code2, badge: 'Core CS' },
    { label: 'Coding Practice', path: '/coding', icon: Terminal, badge: 'Sandbox' },
    { label: 'Mock Interview', path: '/mock-interview', icon: Mic2, badge: 'STAR AI' },
    { label: 'AI Voice Coach', path: '/voice-coach', icon: Headphones, badge: '24/7 Live' },
    { label: 'Progress & Analytics', path: '/analytics', icon: BarChart3, badge: null },
    { label: 'Study Materials', path: '/study-materials', icon: BookOpen, badge: 'Roadmap' },
    { label: 'Profile & Settings', path: '/profile', icon: UserCircle2, badge: null },
  ];

  const handleNavClick = (path: string) => {
    navigate(path);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 bg-slate-900 border-r border-slate-800 flex flex-col transition-all duration-300 ${
          isCollapsed ? 'w-20' : 'w-64'
        } ${isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Top Logo & App Branding */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-slate-800">
          <div
            onClick={() => handleNavClick('/home')}
            className="flex items-center gap-3 cursor-pointer overflow-hidden min-w-0"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center text-white shrink-0 shadow-lg shadow-indigo-600/25">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>

            {!isCollapsed && (
              <div className="min-w-0">
                <h1 className="font-extrabold text-sm text-white tracking-tight leading-tight truncate">
                  SphereAI <span className="text-cyan-400">Voice Coach</span>
                </h1>
                <p className="text-[10px] text-indigo-400 font-semibold tracking-wider uppercase truncate">
                  Placement Suite
                </p>
              </div>
            )}
          </div>

          {/* Desktop collapse toggle button */}
          <button
            onClick={onToggleCollapse}
            className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation items list */}
        <nav className="flex-1 overflow-y-auto px-2.5 py-4 space-y-1 scrollbar-thin">
          {!isCollapsed && (
            <div className="px-3 pb-2 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              Navigation Menu
            </div>
          )}

          {navMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.path || (item.path === '/home' && currentPath === '/');

            return (
              <button
                key={item.path}
                onClick={() => handleNavClick(item.path)}
                title={isCollapsed ? item.label : undefined}
                className={`w-full flex items-center ${
                  isCollapsed ? 'justify-center px-2' : 'justify-between px-3'
                } py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/80'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-colors ${
                      isActive ? 'text-white' : 'text-slate-400 group-hover:text-indigo-400'
                    }`}
                  />
                  {!isCollapsed && <span className="truncate">{item.label}</span>}
                </div>

                {!isCollapsed && item.badge && (
                  <span
                    className={`text-[9px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-800 text-slate-400 border border-slate-700/60'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* User Profile & Logout section at bottom */}
        <div className="p-3 border-t border-slate-800 bg-slate-900/60">
          <div
            className={`flex items-center ${
              isCollapsed ? 'justify-center flex-col gap-2' : 'justify-between'
            } p-2 rounded-xl bg-slate-800/40 border border-slate-800`}
          >
            <div
              onClick={() => handleNavClick('/profile')}
              className="flex items-center gap-2.5 cursor-pointer min-w-0 flex-1 hover:opacity-90"
              title="View Profile & Settings"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center text-white font-extrabold text-xs shrink-0 shadow-md">
                {profile?.name?.charAt(0) || 'S'}
              </div>

              {!isCollapsed && (
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-slate-200 truncate leading-tight">
                    {profile?.name || 'Student Candidate'}
                  </p>
                  <p className="text-[10px] text-slate-400 truncate">
                    {currentUser ? 'Cloud Synced' : 'Demo Profile'}
                  </p>
                </div>
              )}
            </div>

            {/* Logout button */}
            <button
              onClick={() => {
                signOut();
                navigate('/home');
              }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors shrink-0"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
