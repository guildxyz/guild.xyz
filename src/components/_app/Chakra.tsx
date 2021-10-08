import { ChakraProvider, cookieStorageManager } from "@chakra-ui/react"
import { GetServerSideProps } from "next"
import { PropsWithChildren } from "react"
import theme from "theme"

type Props = {
  cookies?: string
}

const Chakra = ({ cookies, children }: PropsWithChildren<Props>) => {
  // Making sure that we're using dark mode on client side routing too
  const localCookies = cookies || "chakra-ui-color-mode=dark" // Use dark color if color mode is not set
  const colorModeManager = cookieStorageManager(localCookies)

  return (
    <ChakraProvider colorModeManager={colorModeManager} theme={theme}>
      {children}
    </ChakraProvider>
  )
}

const getServerSideProps: GetServerSideProps = async ({ req }) => ({
  props: {
    cookies: req.headers.cookie ?? "chakra-ui-color-mode=dark", // Use dark color if color mode is not set
  },
})

export default Chakra
export { getServerSideProps }
