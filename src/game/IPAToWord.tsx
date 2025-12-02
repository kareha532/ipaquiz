import { useEffect, useRef, useState } from "react"
import { words } from "../ipa.ts"
import { useOutletContext } from "react-router-dom"

// type playStateT = "NOTPLAYED" | "LOADING" | "LOADED" | "PLAYING" | "PAUSED" | "ENDED"
type scoreT = {
  lang: string,
  word: string,
  ipa: string[],
  corrected: boolean
}

export default function WordToIPA() {

  // const [playState, setPlayState] = useState<playStateT>('NOTPLAYED')
  // const [isFinishedPlaying, setIsFinishedPlaying] = useState(false)

  const [
    currentIdx,
    setCurrentIdx,
    questionAmount,
    isFinishedGame,
    setIsFinishedGame
  ] = useOutletContext<any>()

  // const [answerIdx, setAnswerIdx] = useState(0) // Correct choice
  // const [nextAnswerIdx, setNextAnswerIdx] = useState(0) // Correct choice
  // const [speakerIdx, setSpeakerIdx] = useState(0)
  const [score, setScore] = useState<scoreT[]>([])
  const [isCorrect, setIsCorrect] = useState(false)
  const [isAnswered, setIsAnswered] = useState(false)
  // const [selectedChoice, setSelectedChoice] = useState("")

  // const ipa: Record<string, any>[] = symbols.slice(0, 10)
  const [choice, setChoice] = useState<typeof words>([])
  const currentQuestion = choice[currentIdx]
  // const baseURL = "https://www.internationalphoneticassociation.org/IPAcharts/inter_chart_2018/sounds"
  // const speakers = ["JE", "JH", "PL", "JW"]

  // const audioRef = useRef<HTMLAudioElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const createdChoices = createChoices()
    setTimeout(() => setChoice(() => createdChoices), 500)
    // audioRef.current?.load()
  }, [])

  const createChoices = () => {
    let choiceC: typeof words = []
    const choiceIdx = new Set<number>()
    while (choiceIdx.size < 10) {
      const idx = Math.floor(Math.random() * words.length)
      // TODO use Set() to avoid duplication!
      if (choiceIdx.has(idx)) continue

      choiceIdx.add(idx)
      const wordsC = words[idx]
      switch (wordsC.lang) {
        case "fr": wordsC.lang = "フランス語"; break;
        case "en": wordsC.lang = "英語"; break;
      }
      choiceC.push(words[idx])
    }
    // console.log(choiceC)
    return choiceC

  }

  const handleCorrect = () => {
    // console.log("Correct!")
    const newScore = score.slice()
    setIsCorrect(true)
    newScore.push({ lang: currentQuestion.lang, word: currentQuestion.word, ipa: currentQuestion.ipa, corrected: true })
    setScore(newScore)
  }

  const handleIncorrect = () => {
    // console.log("Incorrect...")
    const newScore = score.slice()
    newScore.push({ lang: currentQuestion.lang, word: currentQuestion.word, ipa: currentQuestion.ipa, corrected: false })
    setScore(newScore)
  }

  const handleAnswer = (userChoice: string) => {

    setIsAnswered(true)

    // remove all "." / "ˈ" / 2ndary-stress
    const easedWord = currentQuestion.word.replaceAll(/œ/g, "oe")

    // console.log(easedIPA)
    if (currentQuestion.word === userChoice || easedWord === userChoice) {
      handleCorrect()
    }
    else {
      handleIncorrect()
    }

    // console.log(currentIdx, questionAmount)

    if (currentIdx + 1 === questionAmount) {
      setTimeout(() => setIsFinishedGame(true), 1000)
      return
    }
    setTimeout(() => {
      setIsCorrect(false)
      setCurrentIdx(currentIdx + 1)
      inputRef.current!.value = ""
      setIsAnswered(false)
    }, 1000)

    // console.log(choice, answerIdx)
  }

  const handleInputEnter = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAnswer(inputRef.current?.value as string)
    }
  }

  const handleRenderMultipleIPA = (arr: any[]) => {
    console.log(arr)
    let jsx: React.JSX.Element[] = []
    arr.forEach((c, i) => {
      if (i === arr.length - 1) {
        jsx.push(<span>/{c}/</span>)
      }
      else {
        jsx.push(<span className="word-body-ipa">/{c}/, </span>)
      }
    })

    return jsx
  }

  const handleAnswerColor = () => {
    if (!isAnswered) return

    if (isCorrect) {
      return "corrected"
    }
    else {
      return "incorrected"
    }
  }

  if (isFinishedGame) {
    return (
      <>
        <h1>結果</h1>
        <div id="result-input">
          {score.map((s, i) => (
            <button
              key={i}
              className={`
              ${s.corrected ? "corrected" : "incorrected"}
            `}
            >
              <div className="result-lang">{s.lang.toUpperCase()}</div>
              <div className="result-word">{s.word}</div>
              <div className="result-ipa">
                {handleRenderMultipleIPA(s.ipa)}
              </div>
            </button>
          ))}
        </div>
      </>
    )
  }
  else if (!choice.length) {
    return (
      <div id="word-container">🎉問題を生成中…</div>
    )
  }
  else {
    return (
      <>
        { /* JSON.stringify(choice) */}
        { /* JSON.stringify(score) */}

        <div id="word-container" className={handleAnswerColor()}>
          <div id="word-lang" className={handleAnswerColor()}>{currentQuestion.lang.toUpperCase()}</div>
          <div id="word-body" className={handleAnswerColor()}>
            {handleRenderMultipleIPA(currentQuestion.ipa)}
          </div>
        </div>
        {
          // <div>{ currentQuestion.ipa }</div>
        }

        { /* isCorrect.toString() */}
        { /* questionAmount */}

        <div id="choices-container">
          <input
            tabIndex={0}
            placeholder="ここに単語を入力..."
            onKeyDown={(e) => handleInputEnter(e)}
            ref={inputRef}
            disabled={isAnswered}
            id="input" />
          <button
            // className={selectedChoice === c.symbol ? "selected" : ""}
            disabled={isAnswered}
            onClick={() => handleAnswer(inputRef.current?.value as string)}
          >回答
          </button>
        </div>
      </>
    )
  }
}

// const PlayButton = ({ playState }: { playState: playStateT }) => {
//   if (playState === "NOTPLAYED") {
//     return (
//       /* play icon */
//       <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-play-fill" viewBox="0 0 16 16">
//         <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393" />
//       </svg>
//     )
//   }
//   else if (playState === "LOADING") {
//     /* waiting icon */
//     return (
//       <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-hourglass-split" viewBox="0 0 16 16">
//         <path d="M2.5 15a.5.5 0 1 1 0-1h1v-1a4.5 4.5 0 0 1 2.557-4.06c.29-.139.443-.377.443-.59v-.7c0-.213-.154-.451-.443-.59A4.5 4.5 0 0 1 3.5 3V2h-1a.5.5 0 0 1 0-1h11a.5.5 0 0 1 0 1h-1v1a4.5 4.5 0 0 1-2.557 4.06c-.29.139-.443.377-.443.59v.7c0 .213.154.451.443.59A4.5 4.5 0 0 1 12.5 13v1h1a.5.5 0 0 1 0 1zm2-13v1c0 .537.12 1.045.337 1.5h6.326c.216-.455.337-.963.337-1.5V2zm3 6.35c0 .701-.478 1.236-1.011 1.492A3.5 3.5 0 0 0 4.5 13s.866-1.299 3-1.48zm1 0v3.17c2.134.181 3 1.48 3 1.48a3.5 3.5 0 0 0-1.989-3.158C8.978 9.586 8.5 9.052 8.5 8.351z" />
//       </svg>
//     )
//   }
//   if (playState === "LOADED" || playState === "PAUSED") {
//     return (
//       /* play icon */
//       <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-play-fill" viewBox="0 0 16 16">
//         <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393" />
//       </svg>
//     )
//   }
//   else if (playState === "ENDED") {
//     return (
//       /* replay icon */
//       <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-clockwise" viewBox="0 0 16 16">
//         <path fill-rule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2z" />
//         <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466" />
//       </svg>
//     )
//   }
//   else {
//     return (
//       /* pause icon */
//       <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pause-fill" viewBox="0 0 16 16">
//         <path d="M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5m5 0A1.5 1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5" />
//       </svg>
//     )
//   }
// }
