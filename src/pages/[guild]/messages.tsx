import { Stack } from "@chakra-ui/react"
import NoPermissionToPageFallback from "components/[guild]/NoPermissionToPageFallback"
import GuildTabs from "components/[guild]/Tabs/GuildTabs"
import { ThemeProvider, useThemeContext } from "components/[guild]/ThemeContext"
import useGuild from "components/[guild]/hooks/useGuild"
import Message from "components/[guild]/messages/Message"
import NoMessages from "components/[guild]/messages/NoMessages"
import SendNewMessage from "components/[guild]/messages/SendNewMessage"
import GuildLogo from "components/common/GuildLogo"
import Layout from "components/common/Layout"

const Messages = () => {
  const { name, imageUrl } = useGuild()
  const { textColor, localThemeColor, localBackgroundImage } = useThemeContext()

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
        rightElement={<SendNewMessage size="sm" variant="ghost" />}
      />

      <NoPermissionToPageFallback>
        <Stack>
          <NoMessages />
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
