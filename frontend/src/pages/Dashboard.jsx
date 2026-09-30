import { useState, useEffect } from 'react';
import { useAuth, axios } from '../context/AuthContext';
import { useLang } from '../context/LanguageContext';
import { Link } from 'react-router-dom';
import { Flame, Zap, Trophy, Dumbbell, TrendingUp, ChevronRight, Star } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis } from 'recharts';

export default function Dashboard() {
  const { user } = useAuth();
  const { t } = useLang();
  const [stats, setStats] = useState(null);
  const [quests, setQuests] = useState([]);
  const [recentXP, setRecentXP] = useState([]);

  useEffect(() => {
    axios.get('/workout-stats/').then(r => setStats(r.data));
    axios.get('/quests/').then(r => setQuests(r.data.slice(0, 3)));
    axios.get('/xp-history/').then(r => {
      const grouped = r.data.slice(0, 7).reverse().map((item, i) => ({ day: `${i+1}`, xp: item.amount }));
      setRecentXP(grouped);
    });
  }, []);

  if (!user) return null;

  const statCards = [
    { labelKey: 'totalWorkouts', value: user.workout_count || 0, icon: Dumbbell, color: 'var(--accent)' },
    { labelKey: 'dayStreak', value: user.streak || 0, icon: Flame, color: '#ff6b35' },
    { labelKey: 'totalXP', value: user.total_xp?.toLocaleString() || 0, icon: Zap, color: 'var(--xp-color)' },
    { labelKey: 'badges', value: user.badge_count || 0, icon: Trophy, color: '#a78bfa' },
  ];

  return (
    <div style={{ padding: '80px 20px 90px', maxWidth: 700, margin: '0 auto' }}>
      <div className="fade-in" style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16, background: 'var(--bg-elevated)',
            border: '2px solid var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28,
          }}>{user.avatar}</div>
          <div>
            <h2 style={{ fontSize: 24, color: 'var(--text-primary)', marginBottom: 2 }}>
              {t('welcomeBack')} <span style={{ color: 'var(--accent)' }}>{user.username}</span>
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
              {t('keep')} {user.level} {t('levelFighter')}
            </p>
          </div>
        </div>

        <div className="card" style={{
          background: 'linear-gradient(135deg, var(--bg-card) 0%, var(--accent-dim) 100%)',
          border: '1px solid var(--border-accent)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <Star size={16} color="var(--xp-color)" fill="var(--xp-color)" />
                <span style={{ fontFamily: 'Rajdhani', fontSize: 13, color: 'var(--text-secondary)', letterSpacing: 1 }}>
                  {t('level').toUpperCase()} {user.level}
                </span>
              </div>
              <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                {user.xp} / {user.xp_for_next_level} {t('toNextLevel')}
              </span>
            </div>
            <div style={{
              background: 'linear-gradient(135deg, var(--accent), #00c6ff)',
              padding: '6px 16px', borderRadius: 20,
              fontFamily: 'Rajdhani', fontWeight: 700, color: '#fff', fontSize: 15,
            }}>{user.xp_percentage}%</div>
          </div>
          <div className="xp-bar"><div className="xp-bar-fill" style={{ width: `${user.xp_percentage}%` }} /></div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
        {statCards.map(({ labelKey, value, icon: Icon, color }) => (
          <div key={labelKey} className="card fade-in" style={{ padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: `${color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={18} color={color} />
              </div>
              <span style={{ color: 'var(--text-secondary)', fontSize: 12, fontFamily: 'Rajdhani', letterSpacing: 0.5 }}>
                {t(labelKey)}
              </span>
            </div>
            <div style={{ fontSize: 28, fontFamily: 'Rajdhani', fontWeight: 700, color }}>{value}</div>
          </div>
        ))}
      </div>

      {recentXP.length > 0 && (
        <div className="card fade-in" style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <TrendingUp size={16} color="var(--accent)" />
            <h3 style={{ fontSize: 16 }}>{t('recentXP')}</h3>
          </div>
          <ResponsiveContainer width="100%" height={120}>
            <AreaChart data={recentXP}>
              <defs>
                <linearGradient id="xpGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--accent)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-primary)', fontSize: 12 }} />
              <Area type="monotone" dataKey="xp" stroke="var(--accent)" strokeWidth={2} fill="url(#xpGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {quests.length > 0 && (
        <div className="card fade-in" style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <h3 style={{ fontSize: 18 }}>{t('activeQuests')}</h3>
            <Link to="/quests" style={{ color: 'var(--accent)', textDecoration: 'none', fontSize: 13, display: 'flex', alignItems: 'center', gap: 4, fontFamily: 'Rajdhani', fontWeight: 600 }}>
              {t('allQuests')} <ChevronRight size={14} />
            </Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {quests.map(q => (
              <div key={q.id} style={{ padding: '12px 14px', borderRadius: 10, background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <span style={{ fontSize: 20 }}>{q.quest.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: 'Rajdhani', fontWeight: 700, fontSize: 15 }}>{q.quest.name}</div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: 12 }}>{q.quest.description}</div>
                  </div>
                  <div style={{ color: 'var(--xp-color)', fontSize: 12, fontFamily: 'Rajdhani', fontWeight: 700 }}>+{q.quest.xp_reward} XP</div>
                </div>
                <div className="xp-bar">
                  <div className="xp-bar-fill" style={{ width: `${q.progress_percentage}%`, background: 'linear-gradient(90deg, var(--accent2), var(--accent))' }} />
                </div>
                <div style={{ textAlign: 'right', fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
                  {q.progress}/{q.quest.requirement_value}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <Link to="/workouts" style={{ textDecoration: 'none' }}>
        <div className="card animate-glow" style={{
          background: 'linear-gradient(135deg, var(--accent-dim), rgba(0,198,255,0.05))',
          border: '1px solid var(--border-accent)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ fontSize: 36 }}>🏋️</div>
            <div>
              <h3 style={{ fontSize: 20, color: 'var(--accent)', marginBottom: 2 }}>{t('startWorkout')}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{t('startWorkoutSub')}</p>
            </div>
          </div>
          <ChevronRight size={24} color="var(--accent)" />
        </div>
      </Link>
    </div>
  );
}
