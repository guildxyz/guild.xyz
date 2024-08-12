import { Stack } from "@chakra-ui/react"
import NoPermissionToPageFallback from "components/[guild]/NoPermissionToPageFallback"
import GuildTabs from "components/[guild]/Tabs/GuildTabs"
import { ThemeProvider, useThemeContext } from "components/[guild]/ThemeContext"
import useGuild from "components/[guild]/hooks/useGuild"
import useGuildPermission from "components/[guild]/hooks/useGuildPermission"
import { MessageSkeleton } from "components/[guild]/messages/Message"
import useGuildMessages from "components/[guild]/messages/hooks/useGuildMessages"
import Card from "components/common/Card"
import ErrorAlert from "components/common/ErrorAlert"
import GuildLogo from "components/common/GuildLogo"
import Layout from "components/common/Layout"
import { BackButton } from "components/common/Layout/components/BackButton"
import dynamic from "next/dynamic"

const DynamicSendNewMessage = dynamic(
  () => import("components/[guild]/messages/SendNewMessage")
)
const DynamicNoMessages = dynamic(
  () => import("components/[guild]/messages/NoMessages")
)
const DynamicMessage = dynamic(() => import("components/[guild]/messages/Message"))

const Messages = () => {
  const { textColor, localThemeColor, localBackgroundImage } = useThemeContext()

  const { name, imageUrl } = useGuild()
  const { isAdmin } = useGuildPermission()

  const { data, error, isLoading } = useGuildMessages()

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
      backButton={<BackButton />}
    >
      <GuildTabs
        activeTab="MESSAGES"
        rightElement={
          isAdmin &&
          data?.length > 0 && (
            <DynamicSendNewMessage size="sm" variant="ghost" flexShrink={0} />
          )
        }
      />

      <NoPermissionToPageFallback>
        <Stack>
          {isLoading ? (
            [...Array(3)].map((_, i) => <MessageSkeleton key={i} />)
          ) : error ? (
            <Card>
              <ErrorAlert
                mb={0}
                label={
                  typeof error?.error === "string"
                    ? error.error
                    : "An unknown error occurred"
                }
              />
            </Card>
          ) : data?.length > 0 ? (
            data.map((message) => (
              <DynamicMessage key={message.id} message={message} />
            ))
          ) : (
            <DynamicNoMessages />
          )}
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
