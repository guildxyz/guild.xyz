import { HStack, Icon, Text } from "@chakra-ui/react"
import useAccess from "components/[guild]/hooks/useAccess"
import { Warning } from "phosphor-react"
import { PropsWithChildren } from "react"
import capitalize from "utils/capitalize"

type Props = {
  errorApiName?: string
}

const createApiErrorMsg = (apiName: string) =>
  `${apiName} API error, please contact ${apiName} to report`

const ApiErrorFallback = ({
  errorApiName,
  children,
}: PropsWithChildren<Props>): JSX.Element => {
  const { data } = useAccess()
  const accessErrors = data
    ?.map((access) => access.errors)
    ?.filter((error) => !!error)
    ?.flat()

  const providerError = accessErrors?.find(
    (error) => error.errorType === "DATA_PROVIDER_ERROR"
  )

  if (!providerError && !errorApiName) return <>{children}</>

  return (
    <HStack color="orange.200" fontSize="xs" spacing={1} alignItems="start">
      <Icon as={Warning} position="relative" top={0.5} />
      <Text as="span">
        {errorApiName
          ? createApiErrorMsg(errorApiName)
          : `${capitalize(providerError.subType ?? "")}'${
              providerError.subType?.endsWith("s") ? "" : "s"
            } API currently unavailable`}
      </Text>
    </HStack>
  )
}

export default ApiErrorFallback
