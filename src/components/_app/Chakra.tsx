import {
  ChakraProvider,
  cookieStorageManager,
  localStorageManager,
} from "@chakra-ui/react"
import theme from "theme"

const Chakra = ({ cookies, children }) => {
  const colorModeManager =
    typeof cookies === "string" ? cookieStorageManager(cookies) : localStorageManager

  return (
    <ChakraProvider colorModeManager={colorModeManager} theme={theme}>
      {children}
    </ChakraProvider>
  )
}

const getServerSideProps = ({ req }) => ({
  props: {
    cookies: req.headers.cookie ?? "",
  },
})

export default Chakra
export { getServerSideProps }
