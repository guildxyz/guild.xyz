import { HStack, Text } from "@chakra-ui/react"

type Props = {
  text: string
  icon?: JSX.Element
}

const AccessText = ({ text, icon }: Props): JSX.Element => (
  <HStack display={{ base: "none", md: "flex" }} spacing="2" width="max-content">
    <Text fontSize="md" fontWeight="medium">
      {text}
    </Text>
    {icon}
  </HStack>
)

export default AccessText
