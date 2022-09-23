import {
  ChakraProvider,
  cookieStorageManagerSSR,
  localStorageManager,
} from "@chakra-ui/react"
import { GetServerSideProps } from "next"
import { PropsWithChildren } from "react"
import theme from "theme"

type Props = {
  cookies?: string
}

const Chakra = ({ cookies, children }: PropsWithChildren<Props>) => {
  const colorModeManager =
    typeof cookies === "string"
      ? cookieStorageManagerSSR(cookies)
      : localStorageManager

  return (
    <ChakraProvider colorModeManager={colorModeManager} theme={theme}>
      {children}
    </ChakraProvider>
  )
}

const getServerSideProps: GetServerSideProps = async ({ req }) => ({
  props: {
    cookies: req.headers.cookie ?? "",
  },
})

export default Chakra
export { getServerSideProps }
