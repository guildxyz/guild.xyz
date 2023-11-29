import { Stack } from "@chakra-ui/react"
import NoPermissionToPageFallback from "components/[guild]/NoPermissionToPageFallback"
import GuildTabs from "components/[guild]/Tabs/GuildTabs"
import { ThemeProvider, useThemeContext } from "components/[guild]/ThemeContext"
import useGuild from "components/[guild]/hooks/useGuild"
import useGuildPermission from "components/[guild]/hooks/useGuildPermission"
import Message from "components/[guild]/messages/Message"
import GuildLogo from "components/common/GuildLogo"
import Layout from "components/common/Layout"
import dynamic from "next/dynamic"

const DynamicSendNewMessage = dynamic(
  () => import("components/[guild]/messages/SendNewMessage")
)
const DynamicNoMessages = dynamic(
  () => import("components/[guild]/messages/NoMessages")
)

const Messages = () => {
  const { textColor, localThemeColor, localBackgroundImage } = useThemeContext()

  const { name, imageUrl } = useGuild()
  const { isAdmin } = useGuildPermission()

  return (
    <Layout
      title={name}
      ogTitle={`Messages${name ? ` - ${name}` : ""}`}
      image={
        <GuildLogo
          imageUrl={imageUrl}
          size={{ base: "56px", lg: "72px" }}
          mt={{ base: 1, lg: 2 }}
          bgColor={textColor === "primary.800" ? "primary.800" : "transparent"}
        />
      }
      imageUrl={imageUrl}
      textColor={textColor}
      background={localThemeColor}
      backgroundImage={localBackgroundImage}
    >
      <GuildTabs
        activeTab="MESSAGES"
        rightElement={isAdmin && <DynamicSendNewMessage size="sm" variant="ghost" />}
      />

      <NoPermissionToPageFallback>
        <Stack>
          <DynamicNoMessages />
          <Message />
        </Stack>
      </NoPermissionToPageFallback>
    </Layout>
  )
}

const MessagesWrapper = () => (
  <ThemeProvider>
    <Messages />
  </ThemeProvider>
)

export default MessagesWrapper
