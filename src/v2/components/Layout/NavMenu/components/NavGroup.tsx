import { Text, VStack } from "@chakra-ui/react"
import { PropsWithChildren } from "react"

type Props = {
  title: string
}

const NavGroup = ({ title, children }: PropsWithChildren<Props>) => (
  <VStack spacing={"2px"}>
    <Text
      as="h4"
      fontWeight={"bold"}
      fontSize={"sm"}
      pl="4"
      my="1"
      w="full"
      colorScheme={"gray"}
    >
      {title}
    </Text>
    {children}
  </VStack>
)

export default NavGroup
