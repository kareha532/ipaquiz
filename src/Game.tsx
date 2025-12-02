import { Outlet, useLocation } from "react-router-dom";
import "./game.sass"
import { useState } from "react";

export default function Game() {
  const router = useLocation()
  const [currentIdx, setCurrentIdx] = useState(0) // Q.
  const questionAmount = 10

  return (
    <>
      <small>You're at { router.pathname }</small>
      <div>{ currentIdx + 1 } / { questionAmount }</div>
      <div>
        <Outlet context={[currentIdx, setCurrentIdx, questionAmount]}/>
      </div>
    </>
  )
}
