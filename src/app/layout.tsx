import { dystopian, inter } from "fonts"
import { PropsWithChildren } from "react"
import Providers from "./components/Providers"

const AppLayout = ({ children }: PropsWithChildren<unknown>) => (
  <html lang="en" className={`${inter.variable} ${dystopian.variable}`}>
    <body style={{ overflowX: "hidden", overflowY: "auto" }}>
      <Providers>{children}</Providers>
    </body>
  </html>
)

export default AppLayout
