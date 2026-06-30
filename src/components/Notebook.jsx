import NotebookSection from './NotebookSection.jsx'

export default function Notebook({ npcData, unlockedSections, recentlyUnlocked, completionPct, onClose }) {
  const { title, sections } = npcData.notebook

  return (
    <>
      <style>{`
        @keyframes slideInNotebook {
          from { transform: translateX(100%); opacity: 0; }
          to   { transform: translateX(0);   opacity: 1; }
        }
      `}</style>

      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(30,10,0,0.5)',
          backdropFilter: 'blur(2px)',
          zIndex: 10,
        }}
      />

      {/* Panel */}
      <div style={{
        position: 'fixed',
        top: 0,
        right: 0,
        width: '100%',
        maxWidth: 380,
        height: '100%',
        background: 'linear-gradient(160deg, #fdf3e3, #f5e0c0)',
        boxShadow: '-8px 0 40px rgba(60,20,0,0.4)',
        zIndex: 11,
        display: 'flex',
        flexDirection: 'column',
        animation: 'slideInNotebook 0.35s cubic-bezier(0.22,1,0.36,1)',
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, var(--wood-dark), var(--wood))',
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: '1.5rem' }}>📔</span>
            <div>
              <div style={{ color: '#f0d090', fontWeight: 700, fontSize: '1rem' }}>
                Sổ Ghi Chép
              </div>
              <div style={{ color: 'rgba(240,208,144,0.7)', fontSize: '0.78rem' }}>
                {title}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.12)',
              border: '1px solid rgba(255,255,255,0.2)',
              color: '#f0d090',
              borderRadius: 8,
              padding: '6px 14px',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'background 0.2s',
            }}
            onMouseEnter={e => { e.target.style.background = 'rgba(255,255,255,0.22)' }}
            onMouseLeave={e => { e.target.style.background = 'rgba(255,255,255,0.12)' }}
          >
            Đóng ✕
          </button>
        </div>

        {/* Progress bar */}
        <div style={{ padding: '12px 20px 8px', flexShrink: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-mid)', fontWeight: 600 }}>
              Tiến độ khám phá
            </span>
            <span style={{ fontSize: '0.78rem', color: 'var(--wood)', fontWeight: 700 }}>
              {completionPct}%
            </span>
          </div>
          <div style={{
            height: 8,
            borderRadius: 4,
            background: 'rgba(139,94,60,0.15)',
            overflow: 'hidden',
          }}>
            <div style={{
              height: '100%',
              width: `${completionPct}%`,
              background: completionPct === 100
                ? 'linear-gradient(90deg, #27ae60, #2ecc71)'
                : 'linear-gradient(90deg, var(--wood), var(--gold))',
              borderRadius: 4,
              transition: 'width 0.6s cubic-bezier(0.34,1.56,0.64,1)',
            }} />
          </div>
          {completionPct === 100 && (
            <div style={{
              marginTop: 6,
              textAlign: 'center',
              fontSize: '0.8rem',
              color: '#27ae60',
              fontWeight: 700,
            }}>
              ✓ Hoàn thành chủ đề này!
            </div>
          )}
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: 'rgba(139,94,60,0.2)', margin: '0 20px', flexShrink: 0 }} />

        {/* Sections */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '14px 20px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
        }}>
          {sections.map(section => (
            <NotebookSection
              key={section.id}
              section={section}
              unlocked={unlockedSections.has(section.id)}
              recentlyUnlocked={recentlyUnlocked}
            />
          ))}
        </div>

        {/* Hint */}
        <div style={{
          padding: '10px 20px',
          borderTop: '1px solid rgba(139,94,60,0.2)',
          fontSize: '0.75rem',
          color: 'var(--text-light)',
          textAlign: 'center',
          fontStyle: 'italic',
          flexShrink: 0,
        }}>
          Hãy đặt câu hỏi để mở khóa thêm thông tin!
        </div>
      </div>
    </>
  )
}
