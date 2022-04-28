import { SimpleGrid, Text, VStack } from "@chakra-ui/react"
import { WithRumComponentContext } from "@datadog/rum-react-integration"
import Button from "components/common/Button"
import Card from "components/common/Card"
import Layout from "components/common/Layout"
import useDCAuth from "components/[guild]/RolesByPlatform/components/JoinButton/components/JoinModal/hooks/useDCAuth"
import { PlatformLogo } from "components/[guild]/RolesByPlatform/components/Platform"
import Link from "next/link"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"

const PlatformButton = ({ children, type, ...rest }) => (
  <Card>
    <Button size={"xl"} variant={"ghost"} h={{ base: 48, md: 80 }} {...rest}>
      <VStack spacing="4">
        <PlatformLogo type={type} boxSize="8" borderRadius="xl" />
        <Text fontWeight={"bold"} fontSize="xl">
          {children}
        </Text>
      </VStack>
    </Button>
  </Card>
)

const CreateGuildPage = (): JSX.Element => {
  const router = useRouter()
  const { onOpen, isAuthenticating, authorization } = useDCAuth("guilds")
  const [hasClickedDiscord, setHasClickedDiscord] = useState(false)

  const handleClick = () => {
    onOpen()
    setHasClickedDiscord(true)
  }

  const goToDiscord = () => router.push("/create-guild/discord")

  useEffect(() => {
    if (!authorization || !hasClickedDiscord) return

    goToDiscord()
  }, [authorization, hasClickedDiscord, router])

  return (
    <Layout title="Choose a Realm">
      <SimpleGrid columns={2} gap="6">
        <PlatformButton
          type="DISCORD"
          onClick={authorization ? goToDiscord : handleClick}
          isLoading={isAuthenticating}
          loadingText={"Check the popup window"}
        >
          Discord
        </PlatformButton>
        <Link href={`/create-guild/telegram`} passHref>
          <PlatformButton as="a" type="TELEGRAM">
            Telegram
          </PlatformButton>
        </Link>
      </SimpleGrid>
    </Layout>
  )
}

export default WithRumComponentContext("Create guild index page", CreateGuildPage)
