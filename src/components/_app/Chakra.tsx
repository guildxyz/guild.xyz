import {
  ChakraProvider,
  cookieStorageManagerSSR,
  localStorageManager,
} from "@chakra-ui/react"
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

export default Chakra
