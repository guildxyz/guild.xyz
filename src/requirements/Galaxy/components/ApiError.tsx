/**
 * We'll probably generalize this component so we can use it for every requirement,
 * but for now I put it here, since we're only using it for the Galxe requirement
 * types
 */

import { HStack, Icon, Text } from "@chakra-ui/react"
import useAccess from "components/[guild]/hooks/useAccess"
import { Warning } from "phosphor-react"

const ApiError = (): JSX.Element => {
  const { data } = useAccess()
  const accessErrors = data
    ?.map((access) => access.errors)
    ?.filter((error) => !!error)
    ?.flat()

  const galxeApiError = accessErrors?.find(
    (error) => error.errorType === "DATA_PROVIDER_ERROR" && error.subType === "galxe"
  )

  if (!galxeApiError) return null

  return (
    <HStack color="orange.200" fontSize="xs" spacing={1}>
      <Icon as={Warning} />
      <Text as="span">Galxe's API currently unavailable</Text>
    </HStack>
  )
}

export default ApiError
