import { useState, useEffect } from 'react';
import { useAuth, axios } from '../context/AuthContext';
import { User, Zap, Trophy, Flame, Edit3, Save, X } from 'lucide-react';
import toast from 'react-hot-toast';

const AVATARS = ['🧑','👨','👩','🧔','👱','🧑‍🦰','🧑‍🦱','🧑‍🦳','🧑‍🦲','🥷','🦸','🧙','🏃','💪','🦊','🐺','🐻','🦁','⚡','🔥'];

export default function Profile() {
  const { user, refreshUser } = useAuth();
  const [badges, setBadges] = useState([]);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ bio: '', avatar: '' });
  const [xpHistory, setXpHistory] = useState([]);

  useEffect(() => {
    if (user) { setForm({ bio: user.bio || '', avatar: user.avatar || '🧑' }); }
    axios.get('/badges/').then(r => setBadges(r.data));
    axios.get('/xp-history/').then(r => setXpHistory(r.data));
  }, [user]);

  const saveProfile = async () => {
    try {
      await axios.patch('/profile/', form);
      await refreshUser();
      setEditing(false);
      toast.success('Profile updated!');
    } catch { toast.error('Failed to save'); }
  };

  if (!user) return null;

  const earnedBadges = badges.filter(b => b.earned);
  const unearnedBadges = badges.filter(b => !b.earned);
  const rarityColor = { common: 'var(--text-secondary)', rare: '#60a5fa', epic: '#a78bfa', legendary: '#fbbf24' };

  return (
    <div style={{ paddingTop: 80, paddingBottom: 90, padding: '80px 20px 90px', maxWidth: 700, margin: '0 auto' }}>

      {/* Profile Header */}
      <div className="card fade-in" style={{
        marginBottom: 20,
        background: 'linear-gradient(135deg, var(--bg-card), rgba(0,245,160,0.03))',
        border: '1px solid var(--border-accent)',
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 20 }}>
          {editing ? (
            <div>
              <div style={{ fontSize: 42, marginBottom: 8, textAlign: 'center' }}>{form.avatar}</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, maxWidth: 200 }}>
                {AVATARS.map(av => (
                  <button key={av} onClick={() => setForm({...form, avatar: av})}
                    style={{
                      fontSize: 22, padding: 4, borderRadius: 8, border: 'none', cursor: 'pointer',
                      background: form.avatar === av ? 'var(--accent-dim)' : 'transparent',
                      outline: form.avatar === av ? '2px solid var(--accent)' : 'none',
                    }}>
                    {av}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div style={{
              width: 70, height: 70, borderRadius: 18,
              background: 'var(--bg-elevated)', border: '2px solid var(--accent)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36,
              flexShrink: 0,
            }}>
              {user.avatar}
            </div>
          )}

          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
              <h2 style={{ fontSize: 24 }}>{user.username}</h2>
              <div style={{
                padding: '3px 12px', borderRadius: 20,
                background: 'linear-gradient(135deg, #00f5a0, #00c6ff)',
                color: '#0a0b0f', fontFamily: 'Rajdhani', fontWeight: 700, fontSize: 13,
              }}>
                LVL {user.level}
              </div>
            </div>
            <div style={{ color: 'var(--text-secondary)', fontSize: 13, marginBottom: 10 }}>{user.email}</div>
            {editing ? (
              <textarea
                value={form.bio}
                onChange={e => setForm({...form, bio: e.target.value})}
                placeholder="Tell your fitness story..."
                className="input"
                style={{ resize: 'vertical', minHeight: 70, padding: '10px 12px' }}
              />
            ) : (
              <p style={{ color: 'var(--text-secondary)', fontSize: 13, fontStyle: user.bio ? 'normal' : 'italic' }}>
                {user.bio || 'No bio yet. Tell your fitness story!'}
              </p>
            )}
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            {editing ? (
              <>
                <button onClick={saveProfile} className="btn btn-primary" style={{ padding: '8px 14px', fontSize: 13 }}>
                  <Save size={14} /> Save
                </button>
                <button onClick={() => setEditing(false)} className="btn btn-secondary" style={{ padding: '8px 10px' }}>
                  <X size={14} />
                </button>
              </>
            ) : (
              <button onClick={() => setEditing(true)} className="btn btn-secondary" style={{ padding: '8px 14px', fontSize: 13 }}>
                <Edit3 size={14} /> Edit
              </button>
            )}
          </div>
        </div>

        {/* XP Bar */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: 13 }}>Level Progress</span>
            <span style={{ color: '#f4c430', fontFamily: 'Rajdhani', fontWeight: 700, fontSize: 13 }}>
              {user.xp} / {user.xp_for_next_level} XP
            </span>
          </div>
          <div className="xp-bar" style={{ height: 10 }}>
            <div className="xp-bar-fill" style={{ width: `${user.xp_percentage}%` }} />
          </div>
        </div>

        {/* Stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
          {[
            { label: 'Total XP', value: user.total_xp?.toLocaleString(), icon: '⚡', color: '#f4c430' },
            { label: 'Workouts', value: user.workout_count, icon: '🏋️', color: 'var(--accent)' },
            { label: 'Streak', value: `${user.streak}d`, icon: '🔥', color: '#ff6b35' },
            { label: 'Badges', value: earnedBadges.length, icon: '🏅', color: '#a78bfa' },
          ].map(({ label, value, icon, color }) => (
            <div key={label} style={{ textAlign: 'center', padding: '10px 6px', background: 'var(--bg-elevated)', borderRadius: 10 }}>
              <div style={{ fontSize: 20, marginBottom: 4 }}>{icon}</div>
              <div style={{ fontFamily: 'Rajdhani', fontWeight: 700, fontSize: 18, color }}>{value}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: 10, fontFamily: 'Rajdhani', letterSpacing: 0.5 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Badges */}
      <div className="card fade-in" style={{ marginBottom: 20 }}>
        <h3 style={{ fontSize: 20, marginBottom: 16 }}>
          🏅 Badges
          <span style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 400, fontFamily: 'Exo 2', marginLeft: 8 }}>
            {earnedBadges.length}/{badges.length} earned
          </span>
        </h3>

        {earnedBadges.length > 0 && (
          <div>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 10, fontFamily: 'Rajdhani', letterSpacing: 0.5 }}>EARNED</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 10, marginBottom: 20 }}>
              {earnedBadges.map(b => (
                <div key={b.id} style={{
                  padding: '12px', borderRadius: 12, textAlign: 'center',
                  background: 'var(--bg-elevated)',
                  border: `1px solid ${rarityColor[b.rarity]}40`,
                }}>
                  <div style={{ fontSize: 28, marginBottom: 6 }}>{b.icon}</div>
                  <div style={{ fontFamily: 'Rajdhani', fontWeight: 700, fontSize: 13, marginBottom: 2 }}>{b.name}</div>
                  <div style={{ fontSize: 10, color: rarityColor[b.rarity], fontFamily: 'Rajdhani', letterSpacing: 0.5 }}>
                    {b.rarity.toUpperCase()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {unearnedBadges.length > 0 && (
          <div>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 10, fontFamily: 'Rajdhani', letterSpacing: 0.5 }}>LOCKED</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 10 }}>
              {unearnedBadges.map(b => (
                <div key={b.id} style={{
                  padding: '12px', borderRadius: 12, textAlign: 'center',
                  background: 'var(--bg-elevated)', opacity: 0.4,
                  border: '1px solid var(--border)', filter: 'grayscale(80%)',
                }}>
                  <div style={{ fontSize: 28, marginBottom: 6 }}>🔒</div>
                  <div style={{ fontFamily: 'Rajdhani', fontWeight: 700, fontSize: 13, marginBottom: 2 }}>{b.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{b.description}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* XP History */}
      {xpHistory.length > 0 && (
        <div className="card fade-in">
          <h3 style={{ fontSize: 20, marginBottom: 16 }}>⚡ Recent XP</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {xpHistory.slice(0, 8).map(t => (
              <div key={t.id} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '10px 14px', background: 'var(--bg-elevated)', borderRadius: 8,
              }}>
                <div>
                  <div style={{ fontSize: 13, marginBottom: 2 }}>{t.reason}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                    {new Date(t.created_at).toLocaleDateString()}
                  </div>
                </div>
                <div style={{ color: '#f4c430', fontFamily: 'Rajdhani', fontWeight: 700, fontSize: 16 }}>
                  +{t.amount}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
