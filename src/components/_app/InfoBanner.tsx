import { Alert, AlertIcon, HStack, Text } from "@chakra-ui/react"
import { useRouter } from "next/router"

const IGNORED_PATHS = ["/", "/oauth", "/oauth-result"]

const InfoBanner = (): JSX.Element => {
  const { pathname } = useRouter()

  if (IGNORED_PATHS.includes(pathname)) return null

  return (
    <Alert
      status="info"
      borderRadius="none"
      py={1.5}
      fontSize="sm"
      fontWeight="medium"
    >
      <HStack spacing={1.5} alignItems="start">
        <AlertIcon position="relative" top={0.5} m={0} boxSize={4} />
        <Text as="span">
          We are aware of the ongoing X (Twitter) authentication issues which may
          impact your experience. Your patience is appreciated as we resolve this
          matter.
        </Text>
      </HStack>
    </Alert>
  )
}

export default InfoBanner
