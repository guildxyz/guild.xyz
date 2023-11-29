import { usePostHogContext } from "components/_app/PostHogProvider"
import useGuild from "../hooks/useGuild"
import useGuildPermission from "../hooks/useGuildPermission"
import Tabs, { TabsProps } from "./Tabs"
import TabButton from "./components/TabButton"

type Props = {
  activeTab: "HOME" | "EVENTS" | "MEMBERS" | "ACTIVITY" | "MESSAGES"
} & TabsProps

const GuildTabs = ({ activeTab, ...rest }: Props): JSX.Element => {
  const { urlName, featureFlags } = useGuild()
  const { isAdmin } = useGuildPermission()

  const { captureEvent } = usePostHogContext()

  return (
    <Tabs {...rest}>
      <TabButton href={`/${urlName}`} isActive={activeTab === "HOME"}>
        Home
      </TabButton>

      <TabButton
        href={`/${urlName}/events`}
        isActive={activeTab === "EVENTS"}
        onClick={() => {
          captureEvent("Click on events tab", {
            from: "home",
            guild: urlName,
          })
        }}
      >
        Events
      </TabButton>
      {isAdmin && featureFlags.includes("CRM") && (
        <TabButton href={`/${urlName}/members`} isActive={activeTab === "MEMBERS"}>
          Members
        </TabButton>
      )}
      {isAdmin && (
        <TabButton href={`/${urlName}/activity`} isActive={activeTab === "ACTIVITY"}>
          Activity log
        </TabButton>
      )}
      {isAdmin && (
        <TabButton href={`/${urlName}/messages`} isActive={activeTab === "MESSAGES"}>
          Messages
        </TabButton>
      )}
    </Tabs>
  )
}
export default GuildTabs
