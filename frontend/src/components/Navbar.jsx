import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Home, Dumbbell, Trophy, Map, User, LogOut, Zap, Sun, Moon } from 'lucide-react';

const navItems = [
  { path: '/dashboard', label: 'Home', icon: Home },
  { path: '/workouts', label: 'Workouts', icon: Dumbbell },
  { path: '/quests', label: 'Quests', icon: Map },
  { path: '/leaderboard', label: 'Ranks', icon: Trophy },
  { path: '/profile', label: 'Profile', icon: User },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggle, isLight } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <>
      {/* Top bar */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: 'var(--topbar-bg)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border)',
        padding: '12px 20px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        transition: 'background 0.3s',
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'linear-gradient(135deg, var(--accent), #00c6ff)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18,
          }}>⚡</div>
          <span style={{ fontFamily: 'Rajdhani', fontWeight: 700, fontSize: 22, color: 'var(--accent)', letterSpacing: 1 }}>
            FitLvl
          </span>
        </div>

        {user && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {/* XP bar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Zap size={14} color="var(--xp-color)" fill="var(--xp-color)" />
              <span style={{ color: 'var(--xp-color)', fontWeight: 700, fontSize: 14, fontFamily: 'Rajdhani' }}>
                {user.xp_percentage}%
              </span>
              <div style={{ width: 70, height: 6, background: 'var(--bg-elevated)', borderRadius: 3, overflow: 'hidden' }}>
                <div style={{
                  width: `${user.xp_percentage}%`, height: '100%',
                  background: 'linear-gradient(90deg, var(--xp-color), #ff8c00)',
                  borderRadius: 3, transition: 'width 0.5s',
                }} />
              </div>
              <span style={{ color: 'var(--text-secondary)', fontSize: 12, fontFamily: 'Rajdhani' }}>
                LVL {user.level}
              </span>
            </div>

            {/* Avatar */}
            <div style={{
              width: 34, height: 34, borderRadius: '50%',
              background: 'var(--bg-elevated)',
              border: '2px solid var(--accent)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 17,
            }}>
              {user.avatar}
            </div>

            {/* Theme toggle */}
            <button
              onClick={toggle}
              title={isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
              style={{
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border)',
                borderRadius: 8,
                width: 34, height: 34,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', transition: 'all 0.2s', flexShrink: 0,
                color: isLight ? '#d97706' : '#a78bfa',
              }}
            >
              {isLight ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            {/* Logout */}
            <button onClick={handleLogout} className="btn btn-ghost" style={{ padding: '6px 10px' }}>
              <LogOut size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Bottom nav */}
      <nav style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100,
        background: 'var(--navbar-bg)',
        backdropFilter: 'blur(20px)',
        borderTop: '1px solid var(--border)',
        display: 'flex', justifyContent: 'space-around',
        padding: '8px 0 env(safe-area-inset-bottom)',
        transition: 'background 0.3s',
      }}>
        {navItems.map(({ path, label, icon: Icon }) => {
          const active = location.pathname === path;
          return (
            <Link key={path} to={path} style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
              padding: '6px 16px', borderRadius: 10, textDecoration: 'none',
              color: active ? 'var(--accent)' : 'var(--text-muted)',
              background: active ? 'var(--accent-dim)' : 'transparent',
              transition: 'all 0.2s', minWidth: 60,
            }}>
              <Icon size={20} />
              <span style={{ fontSize: 10, fontFamily: 'Rajdhani', fontWeight: 600, letterSpacing: 0.5 }}>
                {label}
              </span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
