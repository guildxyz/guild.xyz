import { Icon, Stack, Text, useColorMode } from "@chakra-ui/react"
import Link from "components/common/Link"
import { Plus } from "phosphor-react"

type Props = {
  text: string
  link: string
}

const AddCard = ({ text, link }: Props): JSX.Element => {
  const { colorMode } = useColorMode()

  return (
    <Link
      href={link}
      _hover={{
        textDecor: "none",
        bg: colorMode === "light" ? "gray.100" : "whiteAlpha.50",
      }}
      borderRadius="2xl"
      display="flex"
      w="full"
      h="full"
      px={{ base: 5, sm: 7 }}
      py="8"
      borderWidth={2}
      borderColor={colorMode === "light" ? "gray.200" : "gray.600"}
      order={1}
    >
      <Stack direction="row" spacing={{ base: 5, sm: 10 }} alignItems="center">
        <Icon
          as={Plus}
          boxSize={8}
          color={colorMode === "light" ? "gray.300" : "gray.500"}
        />
        <Text
          fontWeight="bold"
          color={colorMode === "light" ? "gray.400" : "gray.500"}
        >
          {text}
        </Text>
      </Stack>
    </Link>
  )
}

export default AddCard