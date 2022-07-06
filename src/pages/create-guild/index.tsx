import { SimpleGrid } from "@chakra-ui/react"
import { WithRumComponentContext } from "@datadog/rum-react-integration"
import Button from "components/common/Button"
import Layout from "components/common/Layout"
import OptionCard from "components/common/OptionCard"
import useDCAuthWithCallback from "components/[guild]/RolesByPlatform/components/JoinButton/components/JoinModal/hooks/useDCAuthWithCallback"
import dynamic from "next/dynamic"
import Link from "next/link"
import { useRouter } from "next/router"
import { ArrowSquareIn, CaretRight } from "phosphor-react"
import { useMemo } from "react"

const CreateGuildPage = (): JSX.Element => {
  const router = useRouter()
  const { callbackWithDCAuth, isAuthenticating, authorization } =
    useDCAuthWithCallback("guilds", () => router.push("/create-guild/discord"))

  const DynamicCtaIcon = useMemo(
    () => dynamic(async () => (!authorization ? ArrowSquareIn : CaretRight)),
    [authorization]
  )

  return (
    <Layout title="Choose platform">
      <SimpleGrid columns={{ base: 1, md: 2 }} gap={{ base: 4, md: 6 }}>
        <OptionCard
          size="lg"
          title="Discord"
          image="/platforms/discord.jpg"
          bgImage="/platforms/discord_bg.png"
          description="Manage roles & guard server"
        >
          <Button
            onClick={callbackWithDCAuth}
            isLoading={isAuthenticating}
            colorScheme="DISCORD"
            loadingText={"Check the popup window"}
            rightIcon={<DynamicCtaIcon />}
          >
            Select server
          </Button>
        </OptionCard>
        <OptionCard
          size="lg"
          title="Telegram"
          image="/platforms/telegram.png"
          bgImage="/platforms/telegram_bg.png"
          description="Token gate your group"
        >
          <Link href={`/create-guild/telegram`} passHref>
            <Button as="a" colorScheme="TELEGRAM" rightIcon={<CaretRight />}>
              Next
            </Button>
          </Link>
        </OptionCard>
      </SimpleGrid>
    </Layout>
  )
}

export default WithRumComponentContext("Create guild index page", CreateGuildPage)
