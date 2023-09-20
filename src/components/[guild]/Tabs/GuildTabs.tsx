import PulseMarker from "components/common/PulseMarker"
import { usePostHogContext } from "components/_app/PostHogProvider"
import useLocalStorage from "hooks/useLocalStorage"
import { PlatformType } from "types"
import useGuild from "../hooks/useGuild"
import useGuildPermission from "../hooks/useGuildPermission"
import useIsMember from "../hooks/useIsMember"
import TabButton from "./components/TabButton"
import Tabs from "./Tabs"

type Props = {
  activeTab: "HOME" | "EVENTS" | "MEMBERS" | "ACTIVITY"
  rightElement?: JSX.Element
}

const GuildTabs = ({ activeTab, rightElement }: Props): JSX.Element => {
  const { onboardingComplete, urlName, featureFlags, guildPlatforms } = useGuild()
  const { isAdmin } = useGuildPermission()
  const isMember = useIsMember()

  const showOnboarding = isAdmin && !onboardingComplete

  const showAccessHub =
    (guildPlatforms?.some(
      (guildPlatform) => guildPlatform.platformId === PlatformType.CONTRACT_CALL
    ) ||
      isMember ||
      isAdmin) &&
    !showOnboarding

  const [eventsSeen, setEventsSeen] = useLocalStorage<boolean>("eventsSeen", false)
  const { captureEvent } = usePostHogContext()

  return (
    <Tabs sticky rightElement={rightElement}>
      <TabButton href={`/${urlName}`} isActive={activeTab === "HOME"}>
        {showAccessHub ? "Home" : "Roles"}
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
