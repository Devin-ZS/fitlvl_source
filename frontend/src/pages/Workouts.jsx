import { useState, useEffect, useRef } from 'react';
import { axios } from '../context/AuthContext';
import { useAuth } from '../context/AuthContext';
import { Play, CheckCircle, Clock, Zap, Flame, Plus, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Workouts() {
  const { refreshUser } = useAuth();
  const [templates, setTemplates] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [tab, setTab] = useState('templates');
  const [activeSession, setActiveSession] = useState(null);
  const [timer, setTimer] = useState(0);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef(null);
  const [completing, setCompleting] = useState(false);

  useEffect(() => {
    axios.get('/workout-templates/').then(r => setTemplates(r.data));
    axios.get('/workout-sessions/?completed=true').then(r => setSessions(r.data)).catch(() => {});
  }, []);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => setTimer(t => t + 1), 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [running]);

  const startWorkout = async (template) => {
    try {
      const r = await axios.post('/workout-sessions/', {
        name: template.name,
        template: template.id,
      });
      setActiveSession({ ...r.data, template });
      setTimer(0);
      setRunning(true);
      toast.success(`Started: ${template.name}`, { icon: '🏋️' });
    } catch (e) {
      toast.error('Failed to start workout');
    }
  };

  const completeWorkout = async () => {
    if (!activeSession) return;
    setCompleting(true);
    setRunning(false);
    const mins = Math.max(1, Math.round(timer / 60));
    try {
      const r = await axios.post(`/workouts/${activeSession.id}/complete/`, { duration_minutes: mins });
      toast.success(`🎉 Workout done! +${r.data.xp_earned} XP earned!`, { duration: 4000 });
      if (r.data.badges_earned?.length) {
        r.data.badges_earned.forEach(b => {
          if (b.type === 'level_up') toast.success(`⚡ Level Up! You're now Level ${b.level}!`, { duration: 5000 });
        });
      }
      setActiveSession(null);
      setTimer(0);
      axios.get('/workout-sessions/').then(r => setSessions(r.data));
      refreshUser();
    } catch (e) {
      toast.error('Failed to complete workout');
    } finally {
      setCompleting(false);
    }
  };

  const formatTime = (s) => `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;
  const diff_color = { beginner: '#34d399', intermediate: '#fbbf24', advanced: '#f87171' };

  return (
    <div style={{ paddingTop: 80, paddingBottom: 90, padding: '80px 20px 90px', maxWidth: 700, margin: '0 auto' }}>

      {/* Active workout overlay */}
      {activeSession && (
        <div style={{
          position: 'fixed', top: 60, left: 0, right: 0, zIndex: 50,
          padding: '16px 20px',
          background: 'linear-gradient(135deg, rgba(0,245,160,0.15), rgba(0,198,255,0.1))',
          borderBottom: '1px solid var(--border-accent)',
          backdropFilter: 'blur(20px)',
        }}>
          <div style={{ maxWidth: 700, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div className="pulse" style={{ fontSize: 24 }}>🔥</div>
              <div>
                <div style={{ fontFamily: 'Rajdhani', fontWeight: 700, color: 'var(--accent)', fontSize: 16 }}>
                  {activeSession.template?.name || 'Workout in progress'}
                </div>
                <div style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
                  <Clock size={12} style={{ display: 'inline', marginRight: 4 }} />
                  {formatTime(timer)}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => { setRunning(!running); }}
                className="btn btn-secondary" style={{ padding: '6px 14px', fontSize: 13 }}>
                {running ? 'Pause' : 'Resume'}
              </button>
              <button onClick={completeWorkout} disabled={completing}
                className="btn btn-primary" style={{ padding: '6px 14px', fontSize: 13 }}>
                <CheckCircle size={14} /> Finish
              </button>
              <button onClick={() => { setActiveSession(null); setRunning(false); setTimer(0); }}
                className="btn btn-ghost" style={{ padding: '6px 10px' }}>
                <X size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      <h2 style={{ fontFamily: 'Rajdhani', fontSize: 28, marginBottom: 20 }}>
        <Flame size={24} color="var(--accent)" style={{ display: 'inline', marginRight: 8 }} />
        Workouts
      </h2>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, background: 'var(--bg-elevated)', padding: 4, borderRadius: 10 }}>
        {['templates','history'].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            flex: 1, padding: '8px 16px', border: 'none', borderRadius: 8, cursor: 'pointer',
            background: tab === t ? 'var(--accent)' : 'transparent',
            color: tab === t ? '#0a0b0f' : 'var(--text-secondary)',
            fontFamily: 'Rajdhani', fontWeight: 700, fontSize: 14, textTransform: 'capitalize',
          }}>
            {t === 'templates' ? 'Programs' : 'History'}
          </button>
        ))}
      </div>

      {tab === 'templates' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {templates.map(t => (
            <div key={t.id} className="card fade-in" style={{ padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                <div style={{ fontSize: 36 }}>{t.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <h3 style={{ fontSize: 18 }}>{t.name}</h3>
                    <span className={`tag tag-${t.difficulty}`}>{t.difficulty}</span>
                  </div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginBottom: 12 }}>
                    {t.description}
                  </p>
                  <div style={{ display: 'flex', gap: 16, marginBottom: 14 }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--text-secondary)', fontSize: 12 }}>
                      <Clock size={12} /> {t.estimated_duration} min
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#f4c430', fontSize: 12 }}>
                      <Zap size={12} /> +{t.xp_reward} XP
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--text-muted)', fontSize: 12 }}>
                      💪 {t.exercises_detail?.length || 0} exercises
                    </span>
                  </div>

                  {/* Exercises list */}
                  {t.exercises_detail?.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
                      {t.exercises_detail.map(we => (
                        <span key={we.id} style={{
                          padding: '2px 10px', borderRadius: 20,
                          background: 'var(--bg-elevated)', color: 'var(--text-secondary)',
                          fontSize: 11, fontFamily: 'Rajdhani', fontWeight: 600,
                        }}>
                          {we.exercise?.icon} {we.exercise?.name}
                        </span>
                      ))}
                    </div>
                  )}

                  <button
                    onClick={() => startWorkout(t)}
                    disabled={!!activeSession}
                    className="btn btn-primary"
                    style={{ fontSize: 14, opacity: activeSession ? 0.5 : 1 }}
                  >
                    <Play size={14} fill="currentColor" />
                    {activeSession ? 'Workout in progress' : 'Start Workout'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'history' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {sessions.filter(s => s.completed_at).length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🏋️</div>
              <p>No workouts yet. Start your first one!</p>
            </div>
          ) : (
            sessions.filter(s => s.completed_at).map(s => (
              <div key={s.id} className="card fade-in" style={{ padding: '16px 20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontFamily: 'Rajdhani', fontWeight: 700, fontSize: 16, marginBottom: 4 }}>
                      {s.name}
                    </div>
                    <div style={{ display: 'flex', gap: 14, fontSize: 12, color: 'var(--text-secondary)' }}>
                      <span>⏱ {s.duration_minutes} min</span>
                      <span>🔥 {s.calories_burned} cal</span>
                      <span style={{ color: '#f4c430' }}>⚡ +{s.xp_earned} XP</span>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ color: 'var(--accent)', fontFamily: 'Rajdhani', fontWeight: 700 }}>✓ Done</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                      {new Date(s.completed_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
