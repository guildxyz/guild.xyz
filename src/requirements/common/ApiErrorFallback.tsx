import { HStack, Icon, Text } from "@chakra-ui/react"
import useAccess from "components/[guild]/hooks/useAccess"
import { Warning } from "phosphor-react"
import { PropsWithChildren } from "react"
import capitalize from "utils/capitalize"

type Props = {
  errorMsg?: string
}

const ApiErrorFallback = ({
  errorMsg,
  children,
}: PropsWithChildren<Props>): JSX.Element => {
  const { data } = useAccess()
  const accessErrors = data
    ?.map((access) => access.errors)
    ?.filter((error) => !!error)
    ?.flat()

  const apiError = accessErrors?.find(
    (error) => error.errorType === "DATA_PROVIDER_ERROR"
  )

  if (!apiError && !errorMsg) return <>{children}</>

  return (
    <HStack color="orange.200" fontSize="xs" spacing={1} alignItems="start">
      <Icon as={Warning} position="relative" top={0.5} />
      <Text as="span">
        {errorMsg ??
          `${capitalize(apiError.subType ?? "")}'${
            apiError.subType?.endsWith("s") ? "" : "s"
          } API currently unavailable`}
      </Text>
    </HStack>
  )
}

export default ApiErrorFallback
