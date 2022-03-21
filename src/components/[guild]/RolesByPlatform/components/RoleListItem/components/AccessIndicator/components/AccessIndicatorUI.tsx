import { Stack, Text } from "@chakra-ui/react"

type Props = {
  icon: JSX.Element
  label: string
}

const AccessIndicatorUI = ({ icon, label }: Props): JSX.Element => {
  const Icon = icon

  return (
    <Stack
      direction={{ base: "row", md: "column" }}
      alignItems="center"
      w={{ md: "36" }}
      pt="2"
    >
      {Icon}
      <Text colorScheme="gray" fontSize="sm" textAlign="center">
        {label}
      </Text>
    </Stack>
  )
}

export default AccessIndicatorUI
