import { useColorMode } from "@chakra-ui/react"
import Card from "components/common/Card"
import { PropsWithChildren } from "react"
import { Rest } from "types"

const DisplayCard = ({
  children,
  ...rest
}: PropsWithChildren<Rest>): JSX.Element => {
  const { colorMode } = useColorMode()

  return (
    <Card
      role="group"
      position="relative"
      px={{ base: 5, md: 6 }}
      py={{ base: 6, md: 7 }}
      w="full"
      h="full"
      bg={colorMode === "light" ? "white" : "gray.700"}
      justifyContent="center"
      _before={{
        content: `""`,
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        bg: "gray.300",
        opacity: 0,
        transition: "opacity 0.2s",
      }}
      _hover={{
        _before: {
          opacity: 0.1,
        },
      }}
      _active={{
        _before: {
          opacity: 0.17,
        },
      }}
      {...rest}
    >
      {children}
    </Card>
  )
}

export default DisplayCard
