import { Center, Icon } from "@chakra-ui/react"
import { Circle } from "phosphor-react"

export type MarkerProps = {
  colorScheme?: string
  placement?: "top" | "bottom"
}

const Marker = ({ colorScheme, placement }: MarkerProps): JSX.Element => {
  const pulseColor = `var(--chakra-colors-${colorScheme ?? "primary"}-alpha)`

  return (
    <Center
      pos="absolute"
      right={1}
      bottom={placement === "bottom" ? 1 : "auto"}
      top={placement === "top" ? 1 : "auto"}
      boxSize={0}
      pointerEvents="none"
      sx={{
        "@-webkit-keyframes pulse": {
          "0%": {
            WebkitBoxShadow: `0 0 0 0 ${pulseColor}`,
          },
          "70%": { WebkitBoxShadow: `0 0 0 0.75rem transparent` },
          "100%": { WebkitBoxShadow: `0 0 0 0 transparent` },
        },
        "@keyframes pulse": {
          "0%": {
            MozBoxShadow: `0 0 0 0 ${pulseColor}`,
            boxShadow: `0 0 0 0 ${pulseColor}`,
          },
          "70%": {
            MozBoxShadow: `0 0 0 0.75rem transparent`,
            boxShadow: `0 0 0 0.75rem transparent`,
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
  )
}

export default Marker
