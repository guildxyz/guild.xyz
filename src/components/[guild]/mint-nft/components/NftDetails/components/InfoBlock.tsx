import { Stack, Text } from "@chakra-ui/react"
import { PropsWithChildren } from "react"

type Props = {
  label: string
}

const InfoBlock = ({ label, children }: PropsWithChildren<Props>) => (
  <Stack spacing={0} pr={8}>
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

export default InfoBlock
