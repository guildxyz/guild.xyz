import { HStack, Icon, Text } from "@chakra-ui/react"
import useAccess from "components/[guild]/hooks/useAccess"
import { Warning } from "phosphor-react"
import { PropsWithChildren } from "react"
import capitalize from "utils/capitalize"

type Props = {
  requirementId: number
  errorApiName?: string
}

const createApiErrorMsg = (apiName: string) =>
  `${apiName} API error, please contact ${apiName} to report`

const ApiErrorFallback = ({
  requirementId,
  errorApiName,
  children,
}: PropsWithChildren<Props>): JSX.Element => {
  const { data } = useAccess()
  const accessErrors = data
    ?.map((access) => access.errors)
    ?.filter(Boolean)
    ?.filter((error) => error?.requirementId === requirementId)
    ?.flat()

  const providerError = accessErrors?.find(
    (error) => error.errorType === "DATA_PROVIDER_ERROR"
  )

  if (!providerError && !errorApiName) return <>{children}</>

  return (
    <HStack color="orange.200" fontSize="xs" spacing={1} alignItems="start">
      <Icon as={Warning} position="relative" top={0.5} />
      <Text as="span">
        {providerError
          ? `${capitalize(providerError.subType ?? "something went wrong")}'${
              providerError.subType?.endsWith("s") ? "" : "s"
            } API currently unavailable`
          : createApiErrorMsg(errorApiName)}
      </Text>
    </HStack>
  )
}

export default ApiErrorFallback
