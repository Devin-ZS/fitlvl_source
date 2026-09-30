import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useLang } from '../context/LanguageContext';
import { Zap, User, Mail, Lock, Eye, EyeOff, Sun, Moon } from 'lucide-react';

export default function Auth() {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login, register } = useAuth();
  const { toggle: toggleTheme, isLight } = useTheme();
  const { lang, toggleLang, t } = useLang();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      if (mode === 'login') await login(form.email, form.password);
      else await register(form.username, form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.email?.[0] || t('somethingWrong'));
    } finally { setLoading(false); }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24, background: 'var(--bg-primary)', transition: 'background 0.3s',
      backgroundImage: isLight
        ? 'radial-gradient(ellipse at 20% 50%, rgba(0,181,116,0.06) 0%, transparent 60%)'
        : 'radial-gradient(ellipse at 20% 50%, rgba(0,245,160,0.05) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(124,58,237,0.05) 0%, transparent 60%)',
    }}>
      {!isLight && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
          backgroundImage: 'linear-gradient(rgba(0,245,160,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,245,160,0.03) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }} />
      )}

      {/* Top-right controls */}
      <div style={{ position: 'fixed', top: 16, right: 16, zIndex: 10, display: 'flex', gap: 8 }}>
        <button onClick={toggleLang}
          title={lang === 'en' ? 'Switch to Mongolian' : 'Англи хэл рүү шилжих'}
          style={{
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: 10, height: 40, padding: '0 10px',
            display: 'flex', alignItems: 'center', gap: 6,
            cursor: 'pointer', fontFamily: 'Rajdhani', fontWeight: 700, fontSize: 13,
            color: 'var(--text-primary)', boxShadow: 'var(--shadow)',
          }}>
          <span style={{ fontSize: 16 }}>{lang === 'en' ? '🇲🇳' : '🇬🇧'}</span>
          {lang === 'en' ? 'МН' : 'EN'}
        </button>
        <button onClick={toggleTheme}
          style={{
            background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10,
            width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: isLight ? '#d97706' : '#a78bfa', boxShadow: 'var(--shadow)',
          }}>
          {isLight ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>

      <div className="fade-in" style={{ width: '100%', maxWidth: 420, position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{
            width: 72, height: 72, borderRadius: 20,
            background: 'linear-gradient(135deg, var(--accent), #00c6ff)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 36, margin: '0 auto 16px', boxShadow: '0 0 40px var(--accent-glow)',
          }}>⚡</div>
          <h1 style={{ fontSize: 40, color: 'var(--text-primary)', marginBottom: 4 }}>FitLvl</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>{t('tagline')}</p>
        </div>

        <div className="card" style={{ border: '1px solid var(--border-accent)', boxShadow: 'var(--shadow)' }}>
          <div style={{ display: 'flex', marginBottom: 28, background: 'var(--bg-elevated)', borderRadius: 10, padding: 4 }}>
            {['login', 'register'].map(m => (
              <button key={m} onClick={() => setMode(m)} style={{
                flex: 1, padding: '8px 16px', borderRadius: 8, border: 'none',
                background: mode === m ? 'var(--accent)' : 'transparent',
                color: mode === m ? '#fff' : 'var(--text-secondary)',
                fontFamily: 'Rajdhani', fontWeight: 700, fontSize: 14,
                cursor: 'pointer', transition: 'all 0.2s', letterSpacing: 0.5,
              }}>
                {m === 'login' ? t('login') : t('register')}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {mode === 'register' && (
              <div style={{ position: 'relative' }}>
                <User size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input className="input" placeholder={t('username')}
                  value={form.username} onChange={e => setForm({...form, username: e.target.value})}
                  style={{ paddingLeft: 42 }} required />
              </div>
            )}
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input className="input" type="email" placeholder={t('email')}
                value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                style={{ paddingLeft: 42 }} required />
            </div>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input className="input" type={showPass ? 'text' : 'password'} placeholder={t('password')}
                value={form.password} onChange={e => setForm({...form, password: e.target.value})}
                style={{ paddingLeft: 42, paddingRight: 42 }} required />
              <button type="button" onClick={() => setShowPass(!showPass)} style={{
                position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)',
              }}>
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {error && (
              <div style={{ padding: '10px 14px', borderRadius: 8, background: 'rgba(224,49,49,0.1)', border: '1px solid rgba(224,49,49,0.3)', color: 'var(--danger)', fontSize: 13 }}>
                {error}
              </div>
            )}

            <button type="submit" className="btn btn-primary" disabled={loading}
              style={{ justifyContent: 'center', fontSize: 16, padding: '13px 20px', marginTop: 4 }}>
              <Zap size={16} />
              {loading ? t('loading') : mode === 'login' ? t('enterArena') : t('startJourney')}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 12, marginTop: 20 }}>
          {mode === 'login' ? t('noAccount') : t('alreadyTraining')}
          <button onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
            style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontWeight: 600 }}>
            {mode === 'login' ? t('register') : t('login')}
          </button>
        </p>
      </div>
    </div>
  );
}
