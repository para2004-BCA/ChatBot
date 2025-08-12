import { useEffect, useMemo, useRef, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useMutation, useQuery, useSubscription } from '@apollo/client'
import { INSERT_USER_MESSAGE, LIST_MESSAGES, MESSAGES_SUB, SEND_MESSAGE_ACTION } from '../graphql'

export default function ChatRoom() {
  const { id } = useParams<{ id: string }>()
  const chatId = id as string
  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)
  const bottomRef = useRef<HTMLDivElement | null>(null)

  const { data: initial, loading: loadingInitial, error: initError } = useQuery(LIST_MESSAGES, { variables: { chat_id: chatId } })
  const { data: live } = useSubscription(MESSAGES_SUB, { variables: { chat_id: chatId } })
  const messages = useMemo(() => live?.messages ?? initial?.messages ?? [], [initial?.messages, live?.messages])

  const [insertUserMessage] = useMutation(INSERT_USER_MESSAGE)
  const [sendMessageAction] = useMutation(SEND_MESSAGE_ACTION)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages?.length])

  async function handleSend(e: React.FormEvent) {
    e.preventDefault()
    const content = text.trim()
    if (!content) return

    try {
      setSending(true)
      setText('')
      // 1) Save the user message
      await insertUserMessage({ variables: { chat_id: chatId, content } })
      // 2) Trigger the bot via Hasura Action -> n8n -> OpenRouter -> insert assistant message
      await sendMessageAction({ variables: { chat_id: chatId, message: content } })
    } finally {
      setSending(false)
    }
  }

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '16px' }}>
      <header style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <Link to="/">← Back</Link>
        <h3 style={{ margin: 0 }}>Chat</h3>
      </header>

      {loadingInitial && <div>Loading…</div>}
      {initError && <div style={{ color: 'crimson' }}>{initError.message}</div>}

      <div style={{ display: 'grid', gap: 8, marginBottom: 12 }}>
        {messages?.map((m: any) => (
          <div key={m.id} style={{
            display: 'flex',
            justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start'
          }}>
            <div style={{
              background: m.role === 'user' ? '#0b5' : '#eee',
              color: m.role === 'user' ? 'white' : 'black',
              padding: '8px 12px',
              borderRadius: 16,
              maxWidth: '80%'
            }}>
              {m.content}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSend} style={{ display: 'flex', gap: 8 }}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type your message"
          style={{ flex: 1, padding: 10 }}
        />
        <button type="submit" disabled={sending || !text.trim()}>
          {sending ? 'Sending…' : 'Send'}
        </button>
      </form>
    </div>
  )
}