import { Outlet, useLocation, useNavigate } from "react-router-dom";
import "./game.sass"
import { useState } from "react";

export default function Game() {
  const router = useLocation()
  const [currentIdx, setCurrentIdx] = useState(0) // Q.
  const questionAmount = 10

  const [isFinishedGame, setIsFinishedGame] = useState(false)

  const navi = useNavigate()

  return (
    <>
      <div>You're at {router.pathname}</div>
      { !isFinishedGame && <div id="question-counter">{ currentIdx + 1} / {questionAmount}</div> }
      <div>
        <Outlet context={[currentIdx, setCurrentIdx, questionAmount, isFinishedGame, setIsFinishedGame]} />
      </div>
      <button className="go-home-btn" style={{ marginTop: "2em" }} onClick={() => navi('/')}>トップへ</button>
    </>
  )
}
