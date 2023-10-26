import PulseMarker from "components/common/PulseMarker"
import { usePostHogContext } from "components/_app/PostHogProvider"
import useLocalStorage from "hooks/useLocalStorage"
import useGuild from "../hooks/useGuild"
import useGuildPermission from "../hooks/useGuildPermission"
import TabButton from "./components/TabButton"
import Tabs, { TabsProps } from "./Tabs"

type Props = {
  activeTab: "HOME" | "EVENTS" | "MEMBERS" | "ACTIVITY"
} & TabsProps

const GuildTabs = ({ activeTab, ...rest }: Props): JSX.Element => {
  const { urlName, featureFlags } = useGuild()
  const { isAdmin } = useGuildPermission()

  const [eventsSeen, setEventsSeen] = useLocalStorage<boolean>("eventsSeen", false)
  const { captureEvent } = usePostHogContext()

  return (
    <Tabs {...rest}>
      <TabButton href={`/${urlName}`} isActive={activeTab === "HOME"}>
        Home
      </TabButton>
      <PulseMarker
        placement="top"
        hidden={eventsSeen}
        mx={activeTab === "EVENTS" ? 2 : 0}
      >
        <TabButton
          href={`/${urlName}/events`}
          isActive={activeTab === "EVENTS"}
          onClick={() => {
            setEventsSeen(true)
            captureEvent("Click on events tab", {
              from: "home",
              guild: urlName,
            })
          }}
        >
          Events
        </TabButton>
      </PulseMarker>
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
    </Tabs>
  )
}
export default GuildTabs
