import { Outlet, useLocation } from "react-router-dom";
import "./game.sass"

export default function Game() {
  const router = useLocation()

  return (
    <>
      <small>You're at { router.pathname }</small>
      <div>1 / 10</div>
      <div>
        <Outlet />
      </div>
    </>
  )
}
