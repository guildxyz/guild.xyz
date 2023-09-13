import { Box, Center, Icon } from "@chakra-ui/react"
import { Circle } from "phosphor-react"
import { PropsWithChildren } from "react"
import { Rest } from "types"

type Props = {
  colorScheme?: string
  placement?: "top" | "bottom"
  hidden?: boolean
} & Rest

const PulseMarker = ({
  colorScheme,
  placement = "bottom",
  hidden,
  children,
  ...rest
}: PropsWithChildren<Props>): JSX.Element => {
  const pulseColor = `var(--chakra-colors-${colorScheme ?? "primary"}-alpha)`

  return (
    <Box position="relative" {...rest}>
      {children}
      <Center
        pos="absolute"
        right={1}
        bottom={placement === "bottom" ? 1 : "auto"}
        top={placement === "top" ? 1 : "auto"}
        boxSize={0}
        pointerEvents={"none"}
        display={hidden ? "none" : "flex"}
        sx={{
          "@-webkit-keyframes pulse": {
            "0%": {
              WebkitBoxShadow: `0 0 0 0 ${pulseColor}`,
            },
            "70%": { WebkitBoxShadow: `0 0 0 15px transparent` },
            "100%": { WebkitBoxShadow: `0 0 0 0 transparent` },
          },
          "@keyframes pulse": {
            "0%": {
              MozBoxShadow: `0 0 0 0 ${pulseColor}`,
              boxShadow: `0 0 0 0 ${pulseColor}`,
            },
            "70%": {
              MozBoxShadow: `0 0 0 15px transparent`,
              boxShadow: `0 0 0 15px transparent`,
            },
            "100%": {
              MozBoxShadow: `0 0 0 0 transparent`,
              boxShadow: `0 0 0 0 transparent`,
            },
          },
        }}
      >
        <Icon
          as={Circle}
          weight="fill"
          pos="absolute"
          boxSize="3"
          color={`${colorScheme ?? "primary"}.500`}
          animation="pulse 2s infinite"
          borderRadius="full"
        />
      </Center>
    </Box>
  )
}

export default PulseMarker
