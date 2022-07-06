import { Text } from "@chakra-ui/react"

const DiscordRoleVideo = (): JSX.Element => (
  <>
    <Text>
      Make sure the <i>Guild.xyz bot</i> role is above every user's role it'll have
      to manage
    </Text>

    <video src="/videos/dc-bot-role-config-guide.webm" muted autoPlay loop>
      Your browser does not support the HTML5 video tag.
    </video>
  </>
)

export default DiscordRoleVideo
