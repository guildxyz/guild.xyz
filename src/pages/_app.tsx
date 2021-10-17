import Chakra from "components/_app/Chakra"
import "focus-visible/dist/focus-visible"
import type { AppProps } from "next/app"
import "theme/custom-scrollbar.css"

const App = ({ Component, pageProps }: AppProps): JSX.Element => (
  <Chakra cookies={pageProps.cookies}>
    <Component {...pageProps} />
  </Chakra>
)

export { getServerSideProps } from "components/_app/Chakra"

export default App
