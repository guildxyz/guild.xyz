import { usePostHogContext } from "components/_app/PostHogProvider"
import { PlatformType } from "types"
import { useAccessedGuildPoints } from "../AccessHub/hooks/useAccessedGuildPoints"
import useGuild from "../hooks/useGuild"
import useGuildPermission from "../hooks/useGuildPermission"
import Tabs, { TabsProps } from "./Tabs"
import TabButton from "./components/TabButton"

type Props = {
  activeTab:
    | "HOME"
    | "EVENTS"
    | "LEADERBOARD"
    | "MEMBERS"
    | "ACTIVITY"
    | "ANALYTICS"
    | "MESSAGES"
} & TabsProps

const GuildTabs = ({ activeTab, ...rest }: Props): JSX.Element => {
  const { urlName, featureFlags, eventSources, guildPlatforms } = useGuild()

  /**
   * We automatically import Discord events if the guild has a Discord reward, and we
   * fetch event from sources which are defined in the `eventSources` object.
   *
   * We use this logic instead of the useGuildEvents hook to make sure we only fetch
   * events if the user visits that subpage
   */
  const hasEvents =
    guildPlatforms?.some((gp) => gp.platformId === PlatformType.DISCORD) ||
    Object.values(eventSources ?? {}).length > 0

  const { isAdmin } = useGuildPermission()

  const { captureEvent } = usePostHogContext()

  const existingPointsRewards = useAccessedGuildPoints("ALL")
  const firstExistingPointsReward = existingPointsRewards?.[0]

  return (
    <Tabs {...rest}>
      <TabButton href={`/${urlName}`} isActive={activeTab === "HOME"}>
        Home
      </TabButton>

      {firstExistingPointsReward && (
        <TabButton
          href={`/${urlName}/leaderboard/${firstExistingPointsReward.id}`}
          isActive={activeTab === "LEADERBOARD"}
          onClick={() => {
            captureEvent("Click on leaderboard tab", {
              from: "home",
              guild: urlName,
            })
          }}
        >
          Leaderboard
        </TabButton>
      )}
      {(activeTab === "EVENTS" || hasEvents) && (
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
      )}
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
        <TabButton
          href={`/${urlName}/analytics`}
          isActive={activeTab === "ANALYTICS"}
        >
          Analytics
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
