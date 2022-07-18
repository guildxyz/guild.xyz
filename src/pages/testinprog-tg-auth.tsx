import { Button } from "@chakra-ui/react"
import useTGAuth from "components/[guild]/RolesByPlatform/components/JoinButton/components/JoinModal/hooks/useTGAuthNew"
import { useEffect } from "react"

const TGTest = () => {
  const { authData, isAuthenticating, onOpen } = useTGAuth()

  useEffect(() => {
    console.log(authData)
  }, [authData])

  return (
    <Button
      colorScheme="TELEGRAM"
      isLoading={isAuthenticating}
      loadingText="Authenticate in the popup"
      onClick={onOpen}
    >
      Connect Telegram
    </Button>
  )
}

export default TGTest
