import { useEffect, useRef, useState } from "react"
import { symbols } from "../ipa.ts"
import { useOutletContext } from "react-router-dom"

type playStateT = "NOTPLAYED" | "LOADING" | "LOADED" | "PLAYING" | "PAUSED" | "ENDED"
type scoreT = {
  symbol: string,
  id: string,
  corrected: boolean
}

export default function AudioToInput() {

  const [playState, setPlayState] = useState<playStateT>('NOTPLAYED')
  const [isFinishedPlaying, setIsFinishedPlaying] = useState(false)

  const [
    currentIdx,
    setCurrentIdx,
    questionAmount,
    isFinishedGame,
    setIsFinishedGame
  ] = useOutletContext<any>()

  // const [answerIdx, setAnswerIdx] = useState(0) // Correct choice
  // const [nextAnswerIdx, setNextAnswerIdx] = useState(0) // Correct choice
  const [speakerIdx, setSpeakerIdx] = useState(0)
  const [score, setScore] = useState<scoreT[]>([])
  const [isCorrect, setIsCorrect] = useState(false)
  const [isAnswered, setIsAnswered] = useState(false)
  // const [selectedChoice, setSelectedChoice] = useState("")

  // const ipa: Record<string, any>[] = symbols.slice(0, 10)
  const [choice, setChoice] = useState<Record<string, any>[]>([])
  const currentQuestion = choice[currentIdx]
  const baseURL = "https://www.internationalphoneticassociation.org/IPAcharts/inter_chart_2018/sounds"
  const speakers = ["JE", "JH", "PL", "JW"]

  const audioRef = useRef<HTMLAudioElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const createdChoices = createChoices()
    setTimeout(() => setChoice(() => createdChoices), 500)
    audioRef.current?.load()
  }, [])

  const createChoices = () => {
    let choiceC = []
    for (let i = 0; i < 10; i++) {
      const idx = Math.floor(Math.random() * symbols.length)
      choiceC.push(symbols[idx])
    }
    // console.log(choiceC)
    return choiceC

  }

  const handleEndAudio = () => {
    setSpeakerIdx(Math.floor(Math.random() * 4))

    if (playState !== "LOADED") {
      // audioRef.current?.load() // Reset(reload) the source
    }

    setIsFinishedPlaying(true)
    setPlayState("ENDED")
  }

  const handleLoadedAudio = () => {
    if (playState === "NOTPLAYED") {
      setPlayState("LOADED")
    }
    else if (playState === "LOADING") {
      setPlayState("PLAYING")
      audioRef.current?.play()
    }
  }

  const handlePlayAudio = () => {
    if (playState === "NOTPLAYED") {
      audioRef.current?.load()
      setPlayState("LOADING")
      return
    }

    if (!audioRef.current?.paused) {
      audioRef.current?.pause()
      setPlayState("PAUSED")
    }
    else {
      audioRef.current?.play()
      setPlayState("PLAYING")
    }
  }

  const handleReviewAudio = (id: string) => {
    audioRef.current!.src = baseURL + "/" + speakers[speakerIdx] + "/" + id + ".mp3"
    audioRef.current?.load()
    audioRef.current?.play()
    setPlayState("PLAYING")
  }

  const handleCorrect = () => {
    // console.log("Correct!")
    const newScore = score.slice()
    setIsCorrect(true)
    newScore.push({ symbol: choice[currentIdx].symbol, id: currentQuestion.id, corrected: true })
    setScore(newScore)
  }

  const handleIncorrect = () => {
    // console.log("Incorrect...")
    const newScore = score.slice()
    newScore.push({ symbol: choice[currentIdx].symbol, id: currentQuestion.id, corrected: false })
    setScore(newScore)
  }

  const handleAnswer = (userChoice: string) => {
    audioRef.current?.pause()

    setIsAnswered(true)

    // console.log(userChoice)
    if (userChoice === currentQuestion.symbol) {
      handleCorrect()
    }
    else {
      handleIncorrect()
    }

    setPlayState("NOTPLAYED")

    // console.log(currentIdx, questionAmount)

    if (currentIdx + 1 === questionAmount) {
      setTimeout(() => setIsFinishedGame(true), 1000)
      return
    }

    // preload the next audio by determining the next answer in advance(delaying render)
    audioRef.current!.src = baseURL + "/" + speakers[speakerIdx] + "/" + choice[currentIdx + 1].id + ".mp3"
    audioRef.current?.load()

    setTimeout(() => {
      setIsFinishedPlaying(false)
      setIsCorrect(false)
      setCurrentIdx(currentIdx + 1)
      setPlayState("LOADED")
      setIsAnswered(false)
    }, 1000)

    // console.log(choice, answerIdx)
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
        <audio
          ref={audioRef}
          onCanPlay={handleLoadedAudio}
          onEnded={handleEndAudio}
        />
        <div id="result">
          {score.map((s, i) => (
            <button
              key={i}
              onClick={() => handleReviewAudio(s.id)}
              className={`
              ${s.corrected ? "corrected" : "incorrected"}
            `}
            >
              {s.symbol}
            </button>
          ))}
        </div>
      </>
    )
  }
  else if (!choice.length) {
    return (
      <div></div>
    )
  }
  else {
    return (
      <>
        <audio
          ref={audioRef}
          onCanPlay={handleLoadedAudio}
          onEnded={handleEndAudio}
          src={baseURL + "/" + speakers[speakerIdx] + "/" + currentQuestion.id + ".mp3"}
        />
        { /* JSON.stringify(choice) */}
        { /* JSON.stringify(score) */}
        { /*playState*/}

        { /* audioRef.current?.src */ }

        <div>
          <button
            id="play-btn"
            className={`
              ${playState === "PLAYING" ? "playing" : ""} 
              ${playState === "ENDED" ? "played" : ""} 
              ${handleAnswerColor()}
            `}
            disabled={playState !== "LOADING" ? false : true}
            onClick={handlePlayAudio}

          >
            {isAnswered
              ? <span>{currentQuestion.symbol}</span>
              : <PlayButton playState={playState} />
            }
          </button>
        </div>

        { /* isCorrect.toString() */}
        { /* questionAmount */}

        {isFinishedPlaying &&
          <div id="choices-container">
            <input placeholder="ここにIPAを入力..." ref={inputRef} id="input" />
            <button
              // className={selectedChoice === c.symbol ? "selected" : ""}
              onClick={() => handleAnswer(inputRef.current?.value as string)}
            >回答
            </button>
          </div>
        }
      </>
    )
  }
}

const PlayButton = ({ playState }: { playState: playStateT }) => {
  if (playState === "NOTPLAYED") {
    return (
      /* play icon */
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-play-fill" viewBox="0 0 16 16">
        <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393" />
      </svg>
    )
  }
  else if (playState === "LOADING") {
    /* waiting icon */
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-hourglass-split" viewBox="0 0 16 16">
        <path d="M2.5 15a.5.5 0 1 1 0-1h1v-1a4.5 4.5 0 0 1 2.557-4.06c.29-.139.443-.377.443-.59v-.7c0-.213-.154-.451-.443-.59A4.5 4.5 0 0 1 3.5 3V2h-1a.5.5 0 0 1 0-1h11a.5.5 0 0 1 0 1h-1v1a4.5 4.5 0 0 1-2.557 4.06c-.29.139-.443.377-.443.59v.7c0 .213.154.451.443.59A4.5 4.5 0 0 1 12.5 13v1h1a.5.5 0 0 1 0 1zm2-13v1c0 .537.12 1.045.337 1.5h6.326c.216-.455.337-.963.337-1.5V2zm3 6.35c0 .701-.478 1.236-1.011 1.492A3.5 3.5 0 0 0 4.5 13s.866-1.299 3-1.48zm1 0v3.17c2.134.181 3 1.48 3 1.48a3.5 3.5 0 0 0-1.989-3.158C8.978 9.586 8.5 9.052 8.5 8.351z" />
      </svg>
    )
  }
  if (playState === "LOADED" || playState === "PAUSED") {
    return (
      /* play icon */
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-play-fill" viewBox="0 0 16 16">
        <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393" />
      </svg>
    )
  }
  else if (playState === "ENDED") {
    return (
      /* replay icon */
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-clockwise" viewBox="0 0 16 16">
        <path fill-rule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2z" />
        <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466" />
      </svg>
    )
  }
  else {
    return (
      /* pause icon */
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pause-fill" viewBox="0 0 16 16">
        <path d="M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5m5 0A1.5 1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5" />
      </svg>
    )
  }
}
