import Card from "components/common/Card"
import { PropsWithChildren, forwardRef } from "react"
import { Rest } from "types"

export const DISPLAY_CARD_INTERACTIVITY_STYLES = {
  _before: {
    content: `""`,
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    bg: "gray.300",
    opacity: 0,
    transition: "opacity 0.2s",
  },
  _hover: {
    _before: {
      opacity: 0.1,
    },
  },
  _active: {
    _before: {
      opacity: 0.17,
    },
  },
  cursor: "pointer",
}

const DisplayCard = forwardRef(
  ({ children, ...rest }: PropsWithChildren<Rest>, ref): JSX.Element => (
    <Card
      role="group"
      position="relative"
      px={{ base: 5, md: 6 }}
      py={{ base: 6, md: 7 }}
      w="full"
      h="full"
      justifyContent="center"
      ref={ref}
      {...DISPLAY_CARD_INTERACTIVITY_STYLES}
      {...rest}
    >
      {children}
    </Card>
  ),
)

export default DisplayCard
