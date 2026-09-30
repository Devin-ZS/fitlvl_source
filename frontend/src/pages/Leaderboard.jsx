import { useState, useEffect } from 'react';
import { axios } from '../context/AuthContext';
import { useLang } from '../context/LanguageContext';
import { Trophy, Zap, Flame } from 'lucide-react';

export default function Leaderboard() {
  const [board, setBoard] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLang();

  useEffect(() => {
    axios.get('/leaderboard/').then(r => { setBoard(r.data); setLoading(false); });
  }, []);

  const rankColors = ['#d97706', '#9ca3af', '#b45309'];
  const rankIcons = ['👑', '🥈', '🥉'];

  return (
    <div style={{ padding: '80px 20px 90px', maxWidth: 700, margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <h2 style={{ fontSize: 32, marginBottom: 6 }}>
          <Trophy size={28} color="var(--xp-color)" style={{ display: 'inline', marginRight: 8, verticalAlign: 'middle' }} />
          {t('leaderboardTitle')}
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>{t('leaderboardSub')}</p>
      </div>

      {board.length >= 3 && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 28, alignItems: 'flex-end' }}>
          <div className="card" style={{ textAlign: 'center', padding: '16px 12px' }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>🥈</div>
            <div style={{ fontSize: 26 }}>{board[1].avatar}</div>
            <div style={{ fontFamily: 'Rajdhani', fontWeight: 700, fontSize: 15, marginTop: 6 }}>{board[1].username}</div>
            <div style={{ color: '#9ca3af', fontFamily: 'Rajdhani', fontWeight: 700, fontSize: 13 }}>Lv {board[1].level}</div>
            <div style={{ color: 'var(--text-muted)', fontSize: 12 }}>{board[1].total_xp.toLocaleString()} XP</div>
          </div>

          <div className="card animate-glow" style={{
            textAlign: 'center', padding: '20px 12px',
            border: '1px solid rgba(217,119,6,0.4)',
            background: 'linear-gradient(135deg, var(--bg-card), rgba(217,119,6,0.05))',
          }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>👑</div>
            <div style={{ fontSize: 30 }}>{board[0].avatar}</div>
            <div style={{ fontFamily: 'Rajdhani', fontWeight: 700, fontSize: 17, marginTop: 6, color: 'var(--xp-color)' }}>{board[0].username}</div>
            <div style={{ color: 'var(--xp-color)', fontFamily: 'Rajdhani', fontWeight: 700, fontSize: 14 }}>Lv {board[0].level}</div>
            <div style={{ color: 'var(--text-secondary)', fontSize: 12 }}>{board[0].total_xp.toLocaleString()} XP</div>
          </div>

          <div className="card" style={{ textAlign: 'center', padding: '14px 12px' }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>🥉</div>
            <div style={{ fontSize: 26 }}>{board[2].avatar}</div>
            <div style={{ fontFamily: 'Rajdhani', fontWeight: 700, fontSize: 15, marginTop: 6 }}>{board[2].username}</div>
            <div style={{ color: '#b45309', fontFamily: 'Rajdhani', fontWeight: 700, fontSize: 13 }}>Lv {board[2].level}</div>
            <div style={{ color: 'var(--text-muted)', fontSize: 12 }}>{board[2].total_xp.toLocaleString()} XP</div>
          </div>
        </div>
      )}

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>{t('loadingRankings')}</div>
        ) : board.map((entry, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 14, padding: '14px 20px',
            borderBottom: i < board.length - 1 ? '1px solid var(--border)' : 'none',
            background: entry.is_me ? 'var(--accent-dim)' : 'transparent',
          }}>
            <div style={{ width: 32, textAlign: 'center', fontFamily: 'Rajdhani', fontWeight: 700, fontSize: 16, color: i < 3 ? rankColors[i] : 'var(--text-muted)' }}>
              {i < 3 ? rankIcons[i] : `#${i + 1}`}
            </div>
            <div style={{
              width: 40, height: 40, borderRadius: 12, background: 'var(--bg-elevated)',
              border: entry.is_me ? '2px solid var(--accent)' : '1px solid var(--border)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20,
            }}>{entry.avatar}</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontFamily: 'Rajdhani', fontWeight: 700, fontSize: 16, color: entry.is_me ? 'var(--accent)' : 'var(--text-primary)' }}>
                  {entry.username}
                </span>
                {entry.is_me && (
                  <span style={{ fontSize: 10, color: 'var(--accent)', background: 'var(--accent-dim)', padding: '1px 6px', borderRadius: 10, fontFamily: 'Rajdhani', fontWeight: 700 }}>
                    {t('you')}
                  </span>
                )}
              </div>
              <div style={{ display: 'flex', gap: 12, fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>
                <span>{t('level')} {entry.level}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 2, color: '#ff6b35' }}>
                  <Flame size={11} /> {entry.streak}d
                </span>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--xp-color)', fontFamily: 'Rajdhani', fontWeight: 700 }}>
                <Zap size={13} />{entry.total_xp.toLocaleString()}
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Total XP</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
