import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'

import { Link } from "react-router-dom"

function App() {
  // const [count, setCount] = useState(0)
  const [mode, setMode] = useState("")
  const [type, setType] = useState("")

  const changeType = (to: string) => setType(to)

  return (
    <div className="flex-center">
      <h1>IPA クイズ</h1>

      <div>問題の形式</div>
      <div>
        <button
          className={mode === "multiple" ? "selected" : ""}
          onClick={() => setMode("multiple")}
        >
          4択
        </button>
        <button
          disabled
          className={mode === "input" ? "selected" : ""}
          onClick={() => setMode("input")}
        >
          記述
        </button>
      </div>

      { mode !== "" && (
        <>
          <div>問題の種類</div>
          <TypeSelector mode={mode} type={type} changeType={changeType} />
        </>
      )}

      <Link id="start-btn" to={"/game/" + type}>スタート</Link>
    </div>
  )
}

const TypeSelector = (
  { mode, type, changeType }: { mode: string, type: string, changeType: (to: string) => void }
) => {

  if (mode === "multiple") {
    return (
      <div>
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
      </div>
    )
  }
  else if (mode === "input") {
    return (
      <div>
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
      </div>
    )
  }
}

export default App
