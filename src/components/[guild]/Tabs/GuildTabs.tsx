import { usePostHogContext } from "components/_app/PostHogProvider"
import useMemberships from "components/explorer/hooks/useMemberships"
import { PlatformType } from "types"
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
  const { id, urlName, featureFlags, guildPlatforms, roles } = useGuild()
  const { isAdmin } = useGuildPermission()

  const { memberships } = useMemberships()

  const accessedRoleIds =
    memberships?.find((membership) => membership.guildId === id)?.roleIds || []

  const { captureEvent } = usePostHogContext()

  const existingPointsReward = guildPlatforms?.find((gp) => {
    const isVisibleOnAnyRole =
      roles
        .flatMap((role) => role.rolePlatforms)
        .filter((rp) => rp.guildPlatformId === gp.id)
        .filter((rl) =>
          rl.visibility === "PRIVATE" ? accessedRoleIds?.includes(rl.roleId) : true
        )
        .some((rl) => rl.visibility != "HIDDEN") || isAdmin
    return gp.platformId === PlatformType.POINTS && isVisibleOnAnyRole
  })

  return (
    <Tabs {...rest}>
      <TabButton href={`/${urlName}`} isActive={activeTab === "HOME"}>
        Home
      </TabButton>

      {existingPointsReward && (
        <TabButton
          href={`/${urlName}/leaderboard/${existingPointsReward.id}`}
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
        <TabButton
          href={`/${urlName}/analytics`}
          isActive={activeTab === "ANALYTICS"}
        >
          Analytics
        </TabButton>
      )}
      {isAdmin &&
        (featureFlags.includes("MESSAGING") ? (
          <TabButton
            href={`/${urlName}/messages`}
            isActive={activeTab === "MESSAGES"}
          >
            Messages
          </TabButton>
        ) : (
          <TabButton data-intercom-selector="messages-tab-button">
            Messages
          </TabButton>
        ))}
    </Tabs>
  )
}
export default GuildTabs
