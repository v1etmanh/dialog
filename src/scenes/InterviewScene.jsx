import { useState } from 'react'
import NPCPortrait from '../components/NPCPortrait.jsx'
import MessageList from '../components/MessageList.jsx'
import TextInput from '../components/TextInput.jsx'
import Notebook from '../components/Notebook.jsx'
import { useNotebook } from '../hooks/useNotebook.js'
import { useConversation } from '../hooks/useConversation.js'

export default function InterviewScene({ npcData, onBack, onComplete }) {
  const [notebookOpen, setNotebookOpen] = useState(false)

  const {
    unlockedSections,
    recentlyUnlocked,
    unlockSections,
    completionPct,
    isComplete,
    unlockedCount,
    totalSections,
  } = useNotebook(npcData)

  const { messages, sendMessage, isTyping } = useConversation(npcData, (ids) => {
    unlockSections(ids)
  })

  // Trigger completion callback once
  const [completionFired, setCompletionFired] = useState(false)
  if (isComplete && !completionFired) {
    setCompletionFired(true)
    setTimeout(() => onComplete(npcData), 1200)
  }

  const pctColor = completionPct === 100
    ? '#27ae60'
    : completionPct >= 60
      ? 'var(--gold)'
      : 'var(--wood-light)'

  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      background: 'linear-gradient(160deg, #3d1f0a, #1a0a00)',
      overflow: 'hidden',
    }}>

      {/* ── Top bar ───────────────────────────────────── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 16px',
        background: 'rgba(0,0,0,0.3)',
        borderBottom: '1.5px solid rgba(212,160,84,0.3)',
        flexShrink: 0,
        gap: 8,
      }}>
        <button
          onClick={onBack}
          style={{
            background: 'rgba(253,243,227,0.1)',
            border: '1.5px solid rgba(212,160,84,0.4)',
            color: '#f0d090',
            borderRadius: 8,
            padding: '7px 14px',
            fontSize: '0.85rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s',
            whiteSpace: 'nowrap',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(253,243,227,0.2)' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(253,243,227,0.1)' }}
        >
          ← Làng
        </button>

        <div style={{ textAlign: 'center', flex: 1, minWidth: 0 }}>
          <div style={{ color: '#f0d090', fontWeight: 700, fontSize: '0.95rem', truncate: true }}>
            {npcData.name}
          </div>
          <div style={{ color: 'rgba(240,208,144,0.6)', fontSize: '0.72rem' }}>
            {npcData.topic}
          </div>
        </div>

        <button
          onClick={() => setNotebookOpen(true)}
          style={{
            background: recentlyUnlocked.length > 0
              ? 'linear-gradient(135deg, #d4a054, #f0c060)'
              : 'rgba(253,243,227,0.1)',
            border: '1.5px solid rgba(212,160,84,0.5)',
            color: recentlyUnlocked.length > 0 ? '#3d1f0a' : '#f0d090',
            borderRadius: 8,
            padding: '7px 12px',
            fontSize: '0.83rem',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.25s',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            whiteSpace: 'nowrap',
            animation: recentlyUnlocked.length > 0 ? 'notebookPulse 0.6s ease' : 'none',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = recentlyUnlocked.length > 0 ? 'linear-gradient(135deg, #c4903e,#e0b050)' : 'rgba(253,243,227,0.22)' }}
          onMouseLeave={e => { e.currentTarget.style.background = recentlyUnlocked.length > 0 ? 'linear-gradient(135deg, #d4a054, #f0c060)' : 'rgba(253,243,227,0.1)' }}
        >
          <style>{`
            @keyframes notebookPulse {
              0%   { transform: scale(1); }
              40%  { transform: scale(1.12); }
              100% { transform: scale(1); }
            }
          `}</style>
          📔 {unlockedCount}/{totalSections}
        </button>
      </div>

      {/* ── Main content ──────────────────────────────── */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}>

        {/* NPC portrait section */}
        <div style={{
          flexShrink: 0,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-end',
          padding: '16px 16px 0',
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.2), transparent)',
        }}>
          <NPCPortrait
            portraitId={npcData.portrait}
            width={240}
            height={300}
          />
        </div>

        {/* Progress bar under portrait */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '10px 24px 8px',
          flexShrink: 0,
        }}>
          <span style={{ fontSize: '0.72rem', color: pctColor, fontWeight: 600, whiteSpace: 'nowrap' }}>
            📔 {completionPct}%
          </span>
          <div style={{
            flex: 1,
            height: 5,
            borderRadius: 3,
            background: 'rgba(255,255,255,0.12)',
            overflow: 'hidden',
          }}>
            <div style={{
              height: '100%',
              width: `${completionPct}%`,
              background: completionPct === 100
                ? 'linear-gradient(90deg, #27ae60, #2ecc71)'
                : `linear-gradient(90deg, var(--wood-light), ${pctColor})`,
              borderRadius: 3,
              transition: 'width 0.6s ease',
            }} />
          </div>
          {isComplete && (
            <span style={{ fontSize: '0.72rem', color: '#27ae60', fontWeight: 700 }}>
              ✓ Hoàn thành!
            </span>
          )}
        </div>

        {/* Chat panel */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          background: 'linear-gradient(to bottom, rgba(253,243,227,0.06), rgba(253,243,227,0.1))',
          borderTop: '1.5px solid rgba(212,160,84,0.2)',
          margin: '0 12px',
          borderRadius: '12px 12px 0 0',
        }}>
          <MessageList
            messages={messages}
            isTyping={isTyping}
            npcName={npcData.name}
          />
        </div>
      </div>

      {/* ── Input ─────────────────────────────────────── */}
      <div style={{ margin: '0 12px', borderRadius: '0 0 12px 12px', overflow: 'hidden', flexShrink: 0 }}>
        <TextInput onSend={sendMessage} disabled={isTyping} />
      </div>

      {/* Padding at bottom */}
      <div style={{ height: 8, flexShrink: 0 }} />

      {/* ── Notebook overlay ─────────────────────────── */}
      {notebookOpen && (
        <Notebook
          npcData={npcData}
          unlockedSections={unlockedSections}
          recentlyUnlocked={recentlyUnlocked}
          completionPct={completionPct}
          onClose={() => setNotebookOpen(false)}
        />
      )}
    </div>
  )
}
