import NoPermissionToPageFallback from "components/[guild]/NoPermissionToPageFallback"
import GuildTabs from "components/[guild]/Tabs/GuildTabs"
import { ThemeProvider, useThemeContext } from "components/[guild]/ThemeContext"
import useGuild from "components/[guild]/hooks/useGuild"
import NoMessages from "components/[guild]/messages/NoMessages"
import Button from "components/common/Button"
import GuildLogo from "components/common/GuildLogo"
import Layout from "components/common/Layout"
import { Chat } from "phosphor-react"

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
        rightElement={
          <Button size="sm" variant="ghost" leftIcon={<Chat />}>
            New message
          </Button>
        }
      />

      <NoPermissionToPageFallback>
        <NoMessages />
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
