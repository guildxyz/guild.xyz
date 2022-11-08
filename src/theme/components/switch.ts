import { switchAnatomy as parts } from "@chakra-ui/anatomy"
import { PartsStyleFunction, SystemStyleFunction } from "@chakra-ui/react"
import { mode } from "@chakra-ui/theme-tools"

const baseStyleTrack: SystemStyleFunction = (props) => {
  const { colorScheme: c } = props

  return {
    _checked: {
      bg: mode(`${c}.500`, `${c}.500`)(props),
    },
  }
}

const baseStyle: PartsStyleFunction<typeof parts> = (props) => ({
  track: baseStyleTrack(props),
})

const styles = {
  baseStyle,
}

export default styles
