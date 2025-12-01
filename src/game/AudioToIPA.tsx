import { useEffect, useRef, useState } from "react"
import { symbols, classifiedChoices } from "../ipa.js"

export default function AudioToIPA() {
  const [isPlaying, setIsPlaying] = useState(true)
  const [selectedChoice, setSelectedChoice] = useState("")
  const [currentIdx, setCurrentIdx] = useState(0)
  const [answerIdx, setAnswerIdx] = useState(0)
  const [speakerIdx, setSpeakerIdx] = useState(0)
  const [isFinishedPlaying, setIsFinishedPlaying] = useState(false)
  const [score, setScore] = useState<Record<string, any>[]>([])

  // const ipa: Record<string, any>[] = symbols.slice(0, 10)
  const [choice, setChoice] = useState<Record<string, any>[]>([])
  const currentQuestion = choice[currentIdx]
  const baseURL = "https://www.internationalphoneticassociation.org/IPAcharts/inter_chart_2018/sounds"
  const speakers = ["JE", "JH", "PL", "JW"]

  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    const createdChoices = createChoices()
    setChoice(() => createdChoices)
    setAnswerIdx(Math.floor(Math.random() * createdChoices[currentIdx].length))
  }, [])

  const createChoices = () => {
    let choiceC = []
    for (let i = 0; i < 10; i++) {
      const idx = Math.floor(Math.random() * classifiedChoices.length)
      let randChoice = classifiedChoices[idx].choices

      if (randChoice.length > 4) {
        // TODO select four au hasard
        const randChoiceC = randChoice.slice(0, 4)
        randChoice = randChoiceC
      }

      choiceC.push(randChoice)
    }

    return choiceC

  }

  const handleEndAudio = () => {
    setIsPlaying(true)
    if (!isFinishedPlaying) setIsFinishedPlaying(true)
  }
  const handlePlayAudio = () => {
    if (!audioRef.current?.paused) {
      audioRef.current?.pause()
      setIsPlaying(true)
    }
    else {
      setSpeakerIdx(Math.floor(Math.random() * 4))
      audioRef.current?.load() // Reset(reload) the source
      audioRef.current?.play()
      setIsPlaying(false)
    }
  }

  const handleCorrect = () => {
    console.log("Correct!")
    const newScore = score.slice()
    newScore.push({ symbol: choice[currentIdx][answerIdx].symbol, corrected: true })
    setScore(newScore)
  }

  const handleIncorrect = () => {
    console.log("Incorrect...")
    const newScore = score.slice()
    newScore.push({ symbol: choice[currentIdx][answerIdx].symbol, corrected: false })
    setScore(newScore)
  }

  const handleAnswer = (userChoice: string) => {
    audioRef.current?.pause()

    console.log(userChoice)
    setSelectedChoice(userChoice)
    if (userChoice === choice[currentIdx][answerIdx].symbol) {
      handleCorrect()
    }
    else {
      handleIncorrect()
    }

    setIsFinishedPlaying(false)
    setCurrentIdx(currentIdx + 1)
    setAnswerIdx(() => Math.floor(Math.random() * choice[currentIdx].length))
    console.log(choice, answerIdx)
  }

  if (!choice.length) {
    console.log("Hi")
    return <>Loading Data...</>
  }
  else {
    return (
      <>
        <audio ref={audioRef} onEnded={() => handleEndAudio()}>
          <source src={baseURL + "/" + speakers[speakerIdx] + "/" + currentQuestion[answerIdx] + ".mp3"} type="audio/mp3" />
        </audio>
        { /* JSON.stringify(choice) */}
        {JSON.stringify(score)}
        {JSON.stringify(currentQuestion)}
        <div><button id="play-btn" onClick={handlePlayAudio}>
          {isPlaying
            ?
            /* play icon */
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-play-fill" viewBox="0 0 16 16">
              <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393" />
            </svg>
            :
            /* pause icon */
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pause-fill" viewBox="0 0 16 16">
              <path d="M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5m5 0A1.5 1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5" />
            </svg>
          }
        </button></div>
        {
          // <div><button onClick={() => setCurrentIdx(currentIdx + 1)}>Next</button></div>
        }

        {isFinishedPlaying &&
          <div id="choices-container">
            {choice[currentIdx].slice(0, 4).map((c: Record<string, any>) => (
              <button className={selectedChoice === c.symbol ? "selected" : ""} onClick={() => handleAnswer(c.symbol)}>{c.symbol}</button>
            ))}
          </div>
        }
      </>
    )
  }
}
