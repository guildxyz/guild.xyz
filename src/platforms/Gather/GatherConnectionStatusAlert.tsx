import { Alert, AlertIcon, AlertStatus, Spinner, Text } from "@chakra-ui/react"
import { SWRResponse } from "swr"

const GatherConnectionStatusAlert = ({
  isLoading,
  success,
  error,
}: {
  isLoading: boolean
  success: boolean
  error: SWRResponse["error"]
}) => {
  const getAlertDetails = () => {
    if (isLoading) {
      return {
        status: "info",
        display: "flex",
        gap: 4,
        children: (
          <>
            <Spinner size={"sm"} /> <Text>Checking connection...</Text>
          </>
        ),
      }
    } else if (success) {
      return {
        status: "success",
        children: (
          <>
            <AlertIcon mt={0} />
            <p>
              <strong>Connection successful!</strong> Your space ID and API key have
              been successfully verified.
            </p>
          </>
        ),
      }
    } else if (error) {
      return {
        status: "warning",
        display: "flex",
        children: (
          <>
            <AlertIcon mt={0} />
            <p>
              {error.type === "APIKeyError" ? (
                <>
                  <strong>Unable to access your account!</strong> Please make sure to
                  enter a valid API key.
                </>
              ) : (
                <>
                  <strong>Failed to connect to space!</strong> Please make sure to
                  enter a valid API key and space URL.
                </>
              )}
            </p>
          </>
        ),
      }
    } else {
      return {
        status: "info",
        children: (
          <>
            <AlertIcon mt={0} />
            <p>Enter API key and space URL below to set up connection.</p>
          </>
        ),
      }
    }
  }

  const { status, children, ...rest } = getAlertDetails()

  return (
    <Alert
      overflow="initial"
      mb={6}
      alignItems="center"
      status={status as AlertStatus}
      {...rest}
    >
      {children}
    </Alert>
  )
}

export default GatherConnectionStatusAlert
