import { PropsWithChildren } from "react"
import { AuthWall } from "./_components/AuthWall"

const Layout = ({ children }: PropsWithChildren) => {
  return <AuthWall>{children}</AuthWall>
}

export default Layout
