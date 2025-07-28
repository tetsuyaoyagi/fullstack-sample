import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import './index.css'

import ChatArea from 'component/Chat.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <main>
      <ChatArea />
    </main>
  </StrictMode>,
)
