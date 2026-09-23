import { useState, useEffect } from 'react';
import { axios } from '../context/AuthContext';
import { useAuth } from '../context/AuthContext';
import { Map, CheckCircle, Clock, Zap } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Quests() {
  const { refreshUser } = useAuth();
  const [quests, setQuests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/quests/').then(r => { setQuests(r.data); setLoading(false); });
  }, []);

  const updateProgress = async (questId, questName) => {
    try {
      const r = await axios.post(`/quests/${questId}/progress/`, { progress: 1 });
      setQuests(prev => prev.map(q => q.id === questId ? r.data : q));
      if (r.data.completed) {
        toast.success(`🎯 Quest Complete: ${questName}! +${r.data.quest.xp_reward} XP`, { duration: 4000 });
        refreshUser();
      } else {
        toast.success('Progress updated!');
      }
    } catch (e) {
      toast.error('Failed to update quest');
    }
  };

  const diffColors = { easy: '#34d399', medium: '#fbbf24', hard: '#f87171' };
  const typeColors = { daily: '#60a5fa', weekly: '#a78bfa', special: '#f4c430' };

  const groups = {
    daily: quests.filter(q => q.quest.quest_type === 'daily' && !q.completed),
    weekly: quests.filter(q => q.quest.quest_type === 'weekly' && !q.completed),
    completed: quests.filter(q => q.completed),
  };

  const Section = ({ title, items, color }) => items.length === 0 ? null : (
    <div style={{ marginBottom: 24 }}>
      <h3 style={{ fontSize: 18, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: color, display: 'inline-block' }} />
        {title} <span style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 400, fontFamily: 'Exo 2' }}>({items.length})</span>
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {items.map(q => (
          <div key={q.id} className="card fade-in" style={{
            padding: '16px 18px',
            opacity: q.completed ? 0.6 : 1,
            border: q.completed ? '1px solid var(--border)' : '1px solid rgba(0,245,160,0.1)',
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
              <div style={{ fontSize: 28, lineHeight: 1 }}>{q.quest.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
                  <span style={{ fontFamily: 'Rajdhani', fontWeight: 700, fontSize: 16 }}>{q.quest.name}</span>
                  <span style={{ padding: '2px 8px', borderRadius: 12, fontSize: 10, fontFamily: 'Rajdhani', fontWeight: 700,
                    background: `${diffColors[q.quest.difficulty]}20`, color: diffColors[q.quest.difficulty], letterSpacing: 0.5 }}>
                    {q.quest.difficulty.toUpperCase()}
                  </span>
                  <span style={{ padding: '2px 8px', borderRadius: 12, fontSize: 10, fontFamily: 'Rajdhani', fontWeight: 700,
                    background: `${typeColors[q.quest.quest_type]}20`, color: typeColors[q.quest.quest_type], letterSpacing: 0.5 }}>
                    {q.quest.quest_type.toUpperCase()}
                  </span>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginBottom: 12 }}>{q.quest.description}</p>

                <div className="xp-bar" style={{ marginBottom: 6 }}>
                  <div className="xp-bar-fill" style={{
                    width: `${q.progress_percentage}%`,
                    background: q.completed
                      ? 'linear-gradient(90deg, #34d399, #10b981)'
                      : 'linear-gradient(90deg, #7c3aed, #00f5a0)',
                  }} />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                    {q.progress} / {q.quest.requirement_value} {q.completed && '✓'}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#f4c430', fontSize: 13, fontFamily: 'Rajdhani', fontWeight: 700 }}>
                    <Zap size={12} /> +{q.quest.xp_reward} XP
                  </span>
                </div>
              </div>

              {!q.completed && (
                <button onClick={() => updateProgress(q.quest.id, q.quest.name)}
                  className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: 12, whiteSpace: 'nowrap' }}>
                  Log +1
                </button>
              )}

              {q.completed && <CheckCircle size={22} color="#34d399" />}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div style={{ paddingTop: 80, paddingBottom: 90, padding: '80px 20px 90px', maxWidth: 700, margin: '0 auto' }}>
      <h2 style={{ fontFamily: 'Rajdhani', fontSize: 28, marginBottom: 8 }}>
        <Map size={24} color="var(--accent)" style={{ display: 'inline', marginRight: 8, verticalAlign: 'middle' }} />
        Quests
      </h2>
      <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 28 }}>
        Complete quests to earn bonus XP and level up faster
      </p>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 60, color: 'var(--text-muted)' }}>Loading quests...</div>
      ) : (
        <>
          <Section title="Daily Quests" items={groups.daily} color="#60a5fa" />
          <Section title="Weekly Quests" items={groups.weekly} color="#a78bfa" />
          <Section title="Completed" items={groups.completed} color="#34d399" />
          {quests.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>📋</div>
              <p>No quests available right now. Check back soon!</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
