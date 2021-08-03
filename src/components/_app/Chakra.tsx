import {
  ChakraProvider,
  cookieStorageManager,
  localStorageManager,
} from "@chakra-ui/react"
import { GetServerSideProps } from "next"
import theme from "theme"

type Props = {
  cookies?: string
  children: JSX.Element | JSX.Element[]
}

const Chakra = ({ cookies, children }: Props) => {
  const colorModeManager =
    typeof cookies === "string" ? cookieStorageManager(cookies) : localStorageManager

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
