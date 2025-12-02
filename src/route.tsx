import App from './App.tsx'
import { createBrowserRouter } from 'react-router-dom'
import Game from './Game.tsx'
import FallBack from './Fallback.tsx'
import AudioToIPA from './game/AudioToIPA.tsx'
import AudioToInput from './game/AudioToInput.tsx'
import WordToIPA from './game/WordToIPA.tsx'
import IPAToWord from './game/IPAToWord.tsx'

export const router = createBrowserRouter([
  {
    path: "/",
    index: true,
    element: <App />
  },
  {
    path: "game",
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
        path: "audiotoinput",
        element: <AudioToInput />,
        // element: <WordToIPA />
      },
      {
        path: "ipatoword",
        element: <IPAToWord />,
        // element: <IPAToWord />
      },
      {
        path: "wordtoipa",
        element: <WordToIPA />,
        // element: <WordToIPA />
      },
    ]
  }
], { basename: "/ipaquiz" })
