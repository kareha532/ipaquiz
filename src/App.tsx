import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'

import { useNavigate } from "react-router-dom"

function App() {
  // const [count, setCount] = useState(0)
  const [mode, setMode] = useState("")
  const [type, setType] = useState("")
  const navi = useNavigate()

  const changeType = (to: string) => setType(to)

  const startGame = () => {
    navi("/game/" + type)
  }

  const resetGame = () => {
    setMode("")
    setType("")
  }

  return (
    <div className="flex-center">
      <h1>IPA クイズ</h1>

      <div className='subheader'>問題の形式</div>
      <div className='selector'>
        <button
          className={mode === "multiple" ? "selected" : ""}
          onClick={() => setMode("multiple")}
        >
          4択
        </button>
        <button
          className={mode === "input" ? "selected" : ""}
          onClick={() => setMode("input")}
        >
          記述
        </button>
      </div>

      {mode !== "" && (
        <>
          <div className='subheader'>問題の種類</div>
          <div className='selector'>
            <TypeSelector mode={mode} type={type} changeType={changeType} />
          </div>
        </>
      )}

      {type &&
        <div id="start-reset-btn-container">
          <button onClick={startGame} id="start-btn" >スタート</button>
          <button onClick={resetGame} id="reset-btn" >リセット</button>
        </div>
      }
    </div>
  )
}

const TypeSelector = (
  { mode, type, changeType }: { mode: string, type: string, changeType: (to: string) => void }
) => {

  if (mode === "multiple") {
    return (
      <>
        <button
          className={type === "audiotoipa" ? "selected" : ""}
          onClick={() => changeType("audiotoipa")}>
          音声→IPA
        </button>
        <button
          disabled
          className={type === "ipatoaudio" ? "selected" : ""}
          onClick={() => changeType("ipatoaudio")}
        >
          IPA→音声
        </button>
      </>
    )
  }
  else if (mode === "input") {
    return (
      <>
        <button
          className={type === "audiotoinput" ? "selected" : ""}
          onClick={() => changeType("audiotoinput")}
        >
          音声→IPA
        </button>
        <button
          className={type === "wordtoipa" ? "selected" : ""}
          onClick={() => changeType("wordtoipa")}
        >
          単語→IPA
        </button>
        <button
          className={type === "ipatoword" ? "selected" : ""}
          onClick={() => changeType("ipatoword")}
        >
          IPA→単語
        </button>
      </>
    )
  }
}

export default App
