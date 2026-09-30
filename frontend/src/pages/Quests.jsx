import { useState, useEffect } from 'react';
import { axios } from '../context/AuthContext';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LanguageContext';
import { Map, CheckCircle, Zap } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Quests() {
  const { refreshUser } = useAuth();
  const { t } = useLang();
  const [quests, setQuests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchQuests = () => {
    axios.get('/quests/').then(r => { setQuests(r.data); setLoading(false); });
  };

  useEffect(() => { fetchQuests(); }, []);

  const updateProgress = async (questId, questName, questXP) => {
    try {
      const r = await axios.post(`/quests/${questId}/progress/`, { progress: 1 });
      // Always re-fetch from server so all users see correct state
      fetchQuests();
      if (r.data.completed) {
        toast.success(`🎯 ${t('questComplete')} ${questName}! +${questXP} XP`, { duration: 4000 });
        refreshUser();
      } else {
        toast.success(`+1 ${t('logProgress').replace('Log ', '')}`);
      }
    } catch (e) {
      toast.error('Failed to update quest');
    }
  };

  const diffColors = { easy: '#16a34a', medium: '#d97706', hard: '#dc2626' };
  const typeColors = { daily: '#2563eb', weekly: '#7c3aed', special: '#d97706' };
  const diffLabels = { easy: { en: 'EASY', mn: 'ХЯЛБАР' }, medium: { en: 'MEDIUM', mn: 'ДУНД' }, hard: { en: 'HARD', mn: 'ХЭЦҮҮ' } };
  const typeLabels = { daily: { en: 'DAILY', mn: 'ӨДРИЙН' }, weekly: { en: 'WEEKLY', mn: '7 ХОНОГ' }, special: { en: 'SPECIAL', mn: 'ОНЦГОЙ' } };

  const groups = {
    daily: quests.filter(q => q.quest.quest_type === 'daily' && !q.completed),
    weekly: quests.filter(q => q.quest.quest_type === 'weekly' && !q.completed),
    completed: quests.filter(q => q.completed),
  };

  const Section = ({ title, items, color }) => items.length === 0 ? null : (
    <div style={{ marginBottom: 24 }}>
      <h3 style={{ fontSize: 18, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: color, display: 'inline-block' }} />
        {title}
        <span style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 400, fontFamily: 'Exo 2' }}>({items.length})</span>
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {items.map(q => {
          const lang = localStorage.getItem('fitlvl-lang') || 'en';
          return (
            <div key={q.id} className="card fade-in" style={{
              padding: '16px 18px',
              opacity: q.completed ? 0.65 : 1,
              border: q.completed ? '1px solid var(--border)' : '1px solid var(--border-accent)',
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <div style={{ fontSize: 28, lineHeight: 1 }}>{q.quest.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
                    <span style={{ fontFamily: 'Rajdhani', fontWeight: 700, fontSize: 16 }}>{q.quest.name}</span>
                    <span style={{ padding: '2px 8px', borderRadius: 12, fontSize: 10, fontFamily: 'Rajdhani', fontWeight: 700,
                      background: `${diffColors[q.quest.difficulty]}18`, color: diffColors[q.quest.difficulty], letterSpacing: 0.5 }}>
                      {diffLabels[q.quest.difficulty]?.[lang] || q.quest.difficulty.toUpperCase()}
                    </span>
                    <span style={{ padding: '2px 8px', borderRadius: 12, fontSize: 10, fontFamily: 'Rajdhani', fontWeight: 700,
                      background: `${typeColors[q.quest.quest_type]}18`, color: typeColors[q.quest.quest_type], letterSpacing: 0.5 }}>
                      {typeLabels[q.quest.quest_type]?.[lang] || q.quest.quest_type.toUpperCase()}
                    </span>
                  </div>

                  <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginBottom: 12 }}>{q.quest.description}</p>

                  <div className="xp-bar" style={{ marginBottom: 6 }}>
                    <div className="xp-bar-fill" style={{
                      width: `${q.progress_percentage}%`,
                      background: q.completed
                        ? 'linear-gradient(90deg, #16a34a, #22c55e)'
                        : 'linear-gradient(90deg, var(--accent2), var(--accent))',
                    }} />
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                      {q.progress} / {q.quest.requirement_value} {q.completed && '✓'}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--xp-color)', fontSize: 13, fontFamily: 'Rajdhani', fontWeight: 700 }}>
                      <Zap size={12} /> +{q.quest.xp_reward} XP
                    </span>
                  </div>
                </div>

                {!q.completed && (
                  <button onClick={() => updateProgress(q.quest.id, q.quest.name, q.quest.xp_reward)}
                    className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: 12, whiteSpace: 'nowrap' }}>
                    {t('logProgress')}
                  </button>
                )}
                {q.completed && <CheckCircle size={22} color="#16a34a" />}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div style={{ padding: '80px 20px 90px', maxWidth: 700, margin: '0 auto' }}>
      <h2 style={{ fontFamily: 'Rajdhani', fontSize: 28, marginBottom: 8 }}>
        <Map size={24} color="var(--accent)" style={{ display: 'inline', marginRight: 8, verticalAlign: 'middle' }} />
        {t('quests')}
      </h2>
      <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 28 }}>{t('questsSubtitle')}</p>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 60, color: 'var(--text-muted)' }}>{t('loadingQuests')}</div>
      ) : (
        <>
          <Section title={t('dailyQuests')} items={groups.daily} color="#2563eb" />
          <Section title={t('weeklyQuests')} items={groups.weekly} color="#7c3aed" />
          <Section title={t('completed')} items={groups.completed} color="#16a34a" />
          {quests.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>📋</div>
              <p>{t('noQuests')}</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
