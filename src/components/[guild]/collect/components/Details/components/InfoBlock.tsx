import { Stack, Text, useColorModeValue } from "@chakra-ui/react"
import { PropsWithChildren } from "react"

type Props = {
  label: string
}

const InfoBlock = ({ label, children }: PropsWithChildren<Props>) => {
  const bgColor = useColorModeValue("blackAlpha.100", "whiteAlpha.100")

  return (
    <Stack spacing={0} bg={bgColor} borderRadius={"lg"} p="4">
      <Text
        as="span"
        fontSize="sm"
        fontWeight="bold"
        colorScheme="gray"
        textTransform="uppercase"
      >
        {label}
      </Text>
      {typeof children === "string" ? (
        <Text as="span" fontSize="md" colorScheme="gray">
          {children}
        </Text>
      ) : (
        children
      )}
    </Stack>
  )
}

export default InfoBlock
