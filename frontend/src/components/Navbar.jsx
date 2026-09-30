import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useLang } from '../context/LanguageContext';
import { useFontSize, FONT_SIZES } from '../context/FontSizeContext';
import { LogOut, Zap, Sun, Moon, Home, Dumbbell, Trophy, Map, User, Settings } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { toggle: toggleTheme, isLight } = useTheme();
  const { lang, toggleLang, t } = useLang();
  const { sizeKey, setSize, current } = useFontSize();
  const location = useLocation();
  const navigate = useNavigate();
  const [showSettings, setShowSettings] = useState(false);

  const handleLogout = () => { logout(); navigate('/login'); };

  const navItems = [
    { path: '/dashboard', labelKey: 'home', icon: Home },
    { path: '/workouts', labelKey: 'workouts', icon: Dumbbell },
    { path: '/quests', labelKey: 'quests', icon: Map },
    { path: '/leaderboard', labelKey: 'ranks', icon: Trophy },
    { path: '/profile', labelKey: 'profile', icon: User },
  ];

  const isMn = lang === 'mn';

  return (
    <>
      {/* ── Top bar ── */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: 'var(--topbar-bg)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border)',
        padding: '10px 16px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        transition: 'background 0.3s',
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 10,
            background: 'linear-gradient(135deg, var(--accent), #00c6ff)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17,
          }}>⚡</div>
          <span style={{ fontFamily: 'Rajdhani', fontWeight: 700, fontSize: 21, color: 'var(--accent)', letterSpacing: 1 }}>
            FitLvl
          </span>
        </div>

        {user && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {/* XP mini bar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Zap size={13} color="var(--xp-color)" fill="var(--xp-color)" />
              <span style={{ color: 'var(--xp-color)', fontWeight: 700, fontSize: 13, fontFamily: 'Rajdhani' }}>
                {user.xp_percentage}%
              </span>
              <div style={{ width: 60, height: 5, background: 'var(--bg-elevated)', borderRadius: 3, overflow: 'hidden' }}>
                <div style={{ width: `${user.xp_percentage}%`, height: '100%', background: 'linear-gradient(90deg, var(--xp-color), #ff8c00)', borderRadius: 3, transition: 'width 0.5s' }} />
              </div>
              <span style={{ color: 'var(--text-secondary)', fontSize: 11, fontFamily: 'Rajdhani' }}>LVL {user.level}</span>
            </div>

            {/* Avatar */}
            <div style={{
              width: 32, height: 32, borderRadius: '50%', background: 'var(--bg-elevated)',
              border: '2px solid var(--accent)', display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: 16, flexShrink: 0,
            }}>{user.avatar}</div>

            {/* Language toggle */}
            <button onClick={toggleLang}
              title={lang === 'en' ? 'Switch to Mongolian' : 'Англи хэл рүү шилжих'}
              style={{
                background: 'var(--bg-elevated)', border: '1px solid var(--border)',
                borderRadius: 8, height: 32, padding: '0 8px',
                display: 'flex', alignItems: 'center', gap: 5,
                cursor: 'pointer', fontFamily: 'Rajdhani', fontWeight: 700, fontSize: 12,
                color: 'var(--text-primary)', flexShrink: 0, letterSpacing: 0.5,
              }}>
              <span style={{ fontSize: 14 }}>{lang === 'en' ? '🇲🇳' : '🇬🇧'}</span>
              {lang === 'en' ? 'МН' : 'EN'}
            </button>

            {/* Theme toggle */}
            <button onClick={toggleTheme}
              style={{
                background: 'var(--bg-elevated)', border: '1px solid var(--border)',
                borderRadius: 8, width: 32, height: 32,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', flexShrink: 0,
                color: isLight ? '#d97706' : '#a78bfa',
              }}>
              {isLight ? <Sun size={15} /> : <Moon size={15} />}
            </button>

            {/* Settings (font size) */}
            <div style={{ position: 'relative' }}>
              <button onClick={() => setShowSettings(s => !s)}
                title={isMn ? 'Тохиргоо' : 'Settings'}
                style={{
                  background: showSettings ? 'var(--accent-dim)' : 'var(--bg-elevated)',
                  border: `1px solid ${showSettings ? 'var(--accent)' : 'var(--border)'}`,
                  borderRadius: 8, width: 32, height: 32,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', flexShrink: 0,
                  color: showSettings ? 'var(--accent)' : 'var(--text-secondary)',
                  transition: 'all 0.2s',
                }}>
                <Settings size={15} />
              </button>

              {/* Settings dropdown */}
              {showSettings && (
                <div style={{
                  position: 'absolute', top: 40, right: 0, zIndex: 200,
                  background: 'var(--bg-card)', border: '1px solid var(--border)',
                  borderRadius: 14, padding: 16, width: 220,
                  boxShadow: '0 12px 40px rgba(0,0,0,0.3)',
                  animation: 'fadeIn 0.15s ease',
                }}>
                  <div style={{ fontFamily: 'Rajdhani', fontWeight: 700, fontSize: 13, color: 'var(--text-secondary)', letterSpacing: 1, marginBottom: 12 }}>
                    {isMn ? 'ФОНТЫН ХЭМЖЭЭ' : 'FONT SIZE'}
                  </div>

                  {/* Size buttons */}
                  <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
                    {FONT_SIZES.map((s, i) => (
                      <button key={s.key} onClick={() => setSize(s.key)} style={{
                        flex: 1, padding: '8px 4px', borderRadius: 8, border: 'none', cursor: 'pointer',
                        background: sizeKey === s.key ? 'var(--accent)' : 'var(--bg-elevated)',
                        color: sizeKey === s.key ? '#fff' : 'var(--text-secondary)',
                        fontFamily: 'Rajdhani', fontWeight: 700,
                        fontSize: [13, 16, 20, 24][i],
                        transition: 'all 0.2s',
                        lineHeight: 1,
                      }}>A</button>
                    ))}
                  </div>

                  <div style={{ textAlign: 'center', fontSize: 12, color: 'var(--text-muted)', fontFamily: 'Rajdhani' }}>
                    {isMn ? current.descMn : current.desc}
                  </div>

                  <div style={{ height: 1, background: 'var(--border)', margin: '14px 0' }} />

                  {/* Theme row */}
                  <div style={{ fontFamily: 'Rajdhani', fontWeight: 700, fontSize: 13, color: 'var(--text-secondary)', letterSpacing: 1, marginBottom: 10 }}>
                    {isMn ? 'ЗАГВАР' : 'APPEARANCE'}
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {[
                      { label: isMn ? '🌙 Харанхуй' : '🌙 Dark', value: 'dark' },
                      { label: isMn ? '☀️ Гэрэл' : '☀️ Light', value: 'light' },
                    ].map(opt => (
                      <button key={opt.value} onClick={toggleTheme} style={{
                        flex: 1, padding: '8px 6px', borderRadius: 8, border: 'none', cursor: 'pointer',
                        background: (isLight ? 'light' : 'dark') === opt.value ? 'var(--accent)' : 'var(--bg-elevated)',
                        color: (isLight ? 'light' : 'dark') === opt.value ? '#fff' : 'var(--text-secondary)',
                        fontFamily: 'Rajdhani', fontWeight: 600, fontSize: 12,
                        transition: 'all 0.2s', whiteSpace: 'nowrap',
                      }}>{opt.label}</button>
                    ))}
                  </div>

                  <div style={{ height: 1, background: 'var(--border)', margin: '14px 0' }} />

                  {/* Language row */}
                  <div style={{ fontFamily: 'Rajdhani', fontWeight: 700, fontSize: 13, color: 'var(--text-secondary)', letterSpacing: 1, marginBottom: 10 }}>
                    {isMn ? 'ХЭЛ' : 'LANGUAGE'}
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {[
                      { label: '🇬🇧 English', value: 'en' },
                      { label: '🇲🇳 Монгол', value: 'mn' },
                    ].map(opt => (
                      <button key={opt.value} onClick={() => lang !== opt.value && toggleLang()} style={{
                        flex: 1, padding: '8px 6px', borderRadius: 8, border: 'none', cursor: 'pointer',
                        background: lang === opt.value ? 'var(--accent)' : 'var(--bg-elevated)',
                        color: lang === opt.value ? '#fff' : 'var(--text-secondary)',
                        fontFamily: 'Rajdhani', fontWeight: 600, fontSize: 12,
                        transition: 'all 0.2s', whiteSpace: 'nowrap',
                      }}>{opt.label}</button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Logout */}
            <button onClick={handleLogout} className="btn btn-ghost" style={{ padding: '6px 8px' }}>
              <LogOut size={15} />
            </button>
          </div>
        )}
      </div>

      {/* Click outside to close settings */}
      {showSettings && (
        <div onClick={() => setShowSettings(false)}
          style={{ position: 'fixed', inset: 0, zIndex: 99 }} />
      )}

      {/* ── Bottom nav ── */}
      <nav style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100,
        background: 'var(--navbar-bg)', backdropFilter: 'blur(20px)',
        borderTop: '1px solid var(--border)',
        display: 'flex', justifyContent: 'space-around',
        padding: '10px 0 env(safe-area-inset-bottom)',
        transition: 'background 0.3s',
      }}>
        {navItems.map(({ path, labelKey, icon: Icon }) => {
          const active = location.pathname === path;
          return (
            <Link key={path} to={path} style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
              padding: '6px 14px', borderRadius: 10, textDecoration: 'none',
              color: active ? 'var(--accent)' : 'var(--text-muted)',
              background: active ? 'var(--accent-dim)' : 'transparent',
              transition: 'all 0.2s', minWidth: 60,
            }}>
              <Icon size={22} />
              <span style={{
                fontSize: 'var(--nav-label-size, 12px)',
                fontFamily: 'Rajdhani', fontWeight: 700, letterSpacing: 0.3,
              }}>
                {t(labelKey)}
              </span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
