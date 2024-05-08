import { Alert, AlertIcon, HStack, IconButton, Text } from "@chakra-ui/react"
import { useRouter } from "next/router"
import { X } from "phosphor-react"
import { PropsWithChildren } from "react"

const IGNORED_PATHS = ["/", "/oauth", "/oauth-result"]

type Props = {
  onClose?: () => void
}

const InfoBanner = ({
  onClose,
  children,
}: PropsWithChildren<Props>): JSX.Element => {
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
      <HStack w="full" justifyContent="space-between">
        <HStack spacing={1.5} alignItems="start">
          <AlertIcon position="relative" top={0.5} m={0} boxSize={4} />
          <Text as="span">{children}</Text>
        </HStack>

        {typeof onClose === "function" && (
          <IconButton
            aria-label="Close"
            variant="ghost"
            icon={<X />}
            size="xs"
            borderRadius="full"
            onClick={onClose}
          />
        )}
      </HStack>
    </Alert>
  )
}

export default InfoBanner
