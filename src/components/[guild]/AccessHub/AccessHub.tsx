import { Collapsible, CollapsibleContent } from "@/components/ui/Collapsible"
import useMembership from "components/explorer/hooks/useMembership"
import dynamic from "next/dynamic"
import useGuild from "../hooks/useGuild"
import useGuildPermission from "../hooks/useGuildPermission"
import useRoleGroup from "../hooks/useRoleGroup"
import CampaignCards from "./components/CampaignCards"

const DynamicGuildPinRewardCard = dynamic(
  () => import("./components/GuildPinRewardCard")
)

const DynamicCreatedPageCard = dynamic(() =>
  import("./components/CreatePageCard").then((m) => m.CreatePageCard)
)

const AccessHub = (): JSX.Element => {
  const { featureFlags, guildPin, groups, roles } = useGuild()

  const group = useRoleGroup()
  const { isAdmin } = useGuildPermission()
  const { isMember } = useMembership()

  const shouldShowGuildPin =
    !group &&
    featureFlags?.includes("GUILD_CREDENTIAL") &&
    ((isMember && guildPin?.isActive) || isAdmin)

  const hasVisiblePages = !!groups?.length && roles?.some((role) => !!role.groupId)

  const showAccessHub = isAdmin || (hasVisiblePages && !group) || shouldShowGuildPin

  return (
    <Collapsible open={showAccessHub} className="w-full">
      <CollapsibleContent
        // So we don't cut the shadows
        className="-m-2 w-[calc(100%+1rem)] p-2"
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <CampaignCards />
          {isAdmin && <DynamicCreatedPageCard />}
          {shouldShowGuildPin && <DynamicGuildPinRewardCard />}
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}

export { AccessHub }
