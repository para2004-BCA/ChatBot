import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { NhostProvider } from '@nhost/react'
import { NhostApolloProvider } from '@nhost/react-apollo'
import nhost from './nhost'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import RequireAuth from './components/RequireAuth'
import Auth from './routes/Auth'
import Chat from './routes/Chat'
import ChatRoom from './routes/ChatRoom'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <NhostProvider nhost={nhost}>
      <NhostApolloProvider nhost={nhost}>
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route
              path="/"
              element={
                <RequireAuth>
                  <Chat />
                </RequireAuth>
              }
            />
            <Route
              path="/chat/:id"
              element={
                <RequireAuth>
                  <ChatRoom />
                </RequireAuth>
              }
            />
          </Routes>
        </BrowserRouter>
      </NhostApolloProvider>
    </NhostProvider>
  </StrictMode>,
)
