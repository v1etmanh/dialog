export default function NotebookSection({ section, unlocked, recentlyUnlocked }) {
  const isNew = recentlyUnlocked?.includes(section.id)

  return (
    <div style={{
      borderRadius: 10,
      overflow: 'hidden',
      border: unlocked ? '1.5px solid var(--gold)' : '1.5px solid rgba(139,94,60,0.25)',
      background: unlocked
        ? 'linear-gradient(135deg, #fff8ee, #fdf0d8)'
        : 'rgba(200,180,150,0.12)',
      transition: 'all 0.4s ease',
      boxShadow: isNew ? '0 0 0 3px rgba(212,160,84,0.5)' : unlocked ? '0 2px 8px rgba(90,50,10,0.1)' : 'none',
      animation: isNew ? 'notebookPop 0.5s ease' : 'none',
    }}>
      <style>{`
        @keyframes notebookPop {
          0%   { transform: scale(0.96); }
          50%  { transform: scale(1.03); }
          100% { transform: scale(1); }
        }
      `}</style>

      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '9px 14px',
        background: unlocked
          ? 'linear-gradient(135deg, rgba(212,160,84,0.2), rgba(212,160,84,0.08))'
          : 'rgba(200,180,150,0.08)',
        borderBottom: unlocked ? '1px solid rgba(212,160,84,0.2)' : 'none',
      }}>
        <span style={{ fontSize: '1rem' }}>{unlocked ? section.icon : '🔒'}</span>
        <span style={{
          fontWeight: 700,
          fontSize: '0.88rem',
          color: unlocked ? 'var(--text)' : 'var(--text-light)',
          flex: 1,
        }}>
          {section.label}
        </span>
        {isNew && (
          <span style={{
            fontSize: '0.68rem',
            fontWeight: 700,
            background: 'var(--gold)',
            color: '#3d1f0a',
            padding: '2px 8px',
            borderRadius: 10,
          }}>
            MỚI!
          </span>
        )}
        {!unlocked && (
          <span style={{
            fontSize: '0.7rem',
            color: 'var(--text-light)',
            fontStyle: 'italic',
          }}>
            Chưa khám phá
          </span>
        )}
      </div>

      {/* Content */}
      {unlocked && (
        <div style={{
          padding: '10px 14px',
          fontSize: '0.84rem',
          lineHeight: '1.6',
          color: 'var(--text)',
          fontFamily: 'var(--font-serif)',
        }}>
          {section.content}
        </div>
      )}
    </div>
  )
}
