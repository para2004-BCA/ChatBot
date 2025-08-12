import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery, useMutation } from '@apollo/client'
import { LIST_CHATS, CREATE_CHAT } from '../graphql'
import { useUserDisplayName, useSignOut } from '@nhost/react'

export default function Chat() {
  const { data, loading, error, refetch } = useQuery(LIST_CHATS)
  const [createChat, { loading: creating }] = useMutation(CREATE_CHAT)
  const [title, setTitle] = useState('')
  const { signOut } = useSignOut()
  const displayName = useUserDisplayName()

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return
    await createChat({ variables: { title } })
    setTitle('')
    await refetch()
  }

  return (
    <div style={{ maxWidth: 720, margin: '24px auto', padding: '0 16px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '12px 0 24px' }}>
        <h2>Chats</h2>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <span style={{ opacity: 0.8 }}>{displayName || 'You'}</span>
          <button onClick={() => signOut()}>Sign out</button>
        </div>
      </header>

      <form onSubmit={handleCreate} style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="New chat title"
          style={{ flex: 1, padding: 8 }}
        />
        <button type="submit" disabled={creating || !title.trim()}>
          {creating ? 'Creating…' : 'Create'}
        </button>
      </form>

      {loading && <div>Loading…</div>}
      {error && <div style={{ color: 'crimson' }}>{error.message}</div>}

      <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gap: 8 }}>
        {data?.chats?.map((c: any) => (
          <li key={c.id} style={{ border: '1px solid #ddd', borderRadius: 8 }}>
            <Link to={`/chat/${c.id}`} style={{ display: 'block', padding: 12, textDecoration: 'none' }}>
              <div style={{ fontWeight: 600 }}>{c.title}</div>
              <div style={{ fontSize: 12, opacity: 0.7 }}>Created {new Date(c.created_at).toLocaleString()}</div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}