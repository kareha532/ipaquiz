import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Game from './Game.tsx'
import FallBack from './Fallback.tsx'
import AudioToIPA from './game/AudioToIPA.tsx'

const router = createBrowserRouter([
  {
    path: "/",
    index: true,
    element: <App />
  },
  {
    path: "/game",
    element: <Game />,
    children: [
      {
        path: "audiotoipa",
        element: <AudioToIPA />,
      },
      {
        path: "ipatoaudio",
        element: <FallBack />,
        // element: <IPAToAudio />
      },
      {
        path: "ipatoword",
        element: <FallBack />,
        // element: <IPAToWord />
      },
      {
        path: "wordtoipa",
        element: <FallBack />,
        // element: <WordToIPA />
      }
    ]
  }
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={ router } />
  </StrictMode>,
)
