import { PropsWithChildren } from "react"

type Props = PropsWithChildren

const MainSection = ({ children }: Props) => (
  <div className="relative max-w-screen-xl px-8">{children}</div>
)

export default MainSection
