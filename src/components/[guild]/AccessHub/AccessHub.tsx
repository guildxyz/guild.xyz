import {
  Alert,
  AlertDescription,
  AlertTitle,
  Collapse,
  Icon,
  SimpleGrid,
  Stack,
} from "@chakra-ui/react"
import { StarHalf } from "@phosphor-icons/react"
import Card from "components/common/Card"
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

  const showAccessHub = isAdmin || isMember || (hasVisiblePages && !group)

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
          {(isMember || isAdmin) &&
            (!group ? !groups?.length : true) &&
            !shouldShowGuildPin && (
              <Card>
                <Alert status="info" h="full">
                  <Icon as={StarHalf} boxSize="5" mr="2" mt="1px" weight="regular" />
                  <Stack>
                    <AlertTitle>
                      {!group ? "No accessed reward" : "No rewards yet"}
                    </AlertTitle>
                    <AlertDescription>
                      {!!group && isAdmin
                        ? "This page doesn’t have any auto-managed rewards yet. Add some roles below so their rewards will appear here!"
                        : "You're a member of the guild, but your roles don't give you any auto-managed rewards. The owner might add some in the future or reward you another way!"}
                    </AlertDescription>
                  </Stack>
                </Alert>
              </Card>
            )}

          {isAdmin && <DynamicCreatedPageCard />}
          {shouldShowGuildPin && <DynamicGuildPinRewardCard />}
        </SimpleGrid>
      </Collapse>
    </ClientOnly>
  )
}

export default AccessHub
