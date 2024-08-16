import { Collapse, SimpleGrid } from "@chakra-ui/react"
import ClientOnly from "components/common/ClientOnly"
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
    <ClientOnly>
      <Collapse
        in={showAccessHub}
        unmountOnExit
        style={{
          width: "calc(100% + 20px)",
          paddingBottom: 10,
          marginBottom: -10,
          paddingInline: 10,
          marginInline: -10,
        }}
      >
        <SimpleGrid
          columns={{
            base: 1,
            md: 2,
            lg: 3,
            xl: 4,
          }}
          gap={4}
        >
          <CampaignCards />
          {isAdmin && <DynamicCreatedPageCard />}
          {shouldShowGuildPin && <DynamicGuildPinRewardCard />}
        </SimpleGrid>
      </Collapse>
    </ClientOnly>
  )
}

export default AccessHub
