import {
  Collapse,
  Flex,
  HStack,
  SimpleGrid,
  SlideFade,
  Spacer,
  useBreakpointValue,
  useDisclosure,
} from "@chakra-ui/react"
import Card from "components/common/Card"
import ClientOnly from "components/common/ClientOnly"
import useMembership, {
  useRoleMembership,
} from "components/explorer/hooks/useMembership"
import dynamic from "next/dynamic"
import { memo, useEffect, useRef } from "react"
import { Role } from "types"
import RoleRequirements from "../Requirements"
import useGuild from "../hooks/useGuild"
import useGuildPermission from "../hooks/useGuildPermission"
import AccessIndicator from "./components/AccessIndicator"
import { RoleCardMemberCount } from "./components/MemberCount"
import { RewardIcon } from "./components/Reward"
import RoleDescription from "./components/RoleDescription"
import RoleHeader from "./components/RoleHeader"
import RoleRequirementsSection, {
  RoleRequirementsSectionHeader,
} from "./components/RoleRequirementsSection"
import { RoleRewards } from "./components/RoleRewards"

type Props = {
  role: Role
}

const DynamicEditRole = dynamic(() => import("./components/EditRole"))

const RoleCard = memo(({ role }: Props) => {
  const { guildPlatforms, isDetailed } = useGuild()
  const { isAdmin } = useGuildPermission()
  const { isMember } = useMembership()
  const { hasRoleAccess } = useRoleMembership(role.id)
  /**
   * If using defaultIsOpen: !hasAccess, the RewardIcons doesn't show initially in
   * collapsed state when going back to explorer -> coming back to guild until
   * opening and closing the role, because the same layoutId is mounted twice and it
   * animates to the later one in the DOM (the hidden Rewards below)
   */
  const { isOpen, onClose, onOpen, onToggle } = useDisclosure({
    defaultIsOpen: true,
  })
  const {
    isOpen: isExpanded,
    onToggle: onToggleExpanded,
    onClose: onCloseExpanded,
  } = useDisclosure()
  const descriptionRef = useRef<HTMLDivElement>(null)
  const initialRequirementsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) onCloseExpanded()
  }, [isOpen, onCloseExpanded])

  const isMobile = useBreakpointValue({ base: true, md: false }, { fallback: "md" })

  const collapsedHeight = isMobile && role.visibility === "PUBLIC" ? "90px" : "94px"

  return (
    <Card
      id={`role-${role.id}`}
      role="group"
      scrollMarginTop={"calc(var(--chakra-space-12) + var(--chakra-space-6))"}
      // scrollMarginTop doesn't work with overflow="hidden"
      overflow="clip"
      sx={{
        ":target": {
          boxShadow: "var(--chakra-shadows-outline)",
        },
      }}
      onClick={() => {
        if (window.location.hash === `#role-${role.id}`) window.location.hash = "!"
      }}
      {...(role.visibility === "HIDDEN"
        ? {
            borderWidth: 2,
            borderStyle: "dashed",
          }
        : {})}
    >
      <Collapse in={isOpen} startingHeight={collapsedHeight}>
        <SimpleGrid columns={{ base: 1, md: 2 }}>
          <Flex direction="column">
            <RoleHeader {...{ role, isOpen }}>
              {!isOpen && (
                <HStack
                  flex="1 0 auto"
                  justifyContent={{ base: "flex-end", md: "unset" }}
                >
                  {role.rolePlatforms?.map((platform, i) => {
                    const guildPlatform = guildPlatforms?.find(
                      (p) => p.id === platform.guildPlatformId
                    )

                    return (
                      <SlideFade key={i} in={!isOpen} delay={i * 0.05}>
                        <RewardIcon
                          rolePlatformId={platform.id}
                          guildPlatform={guildPlatform}
                        />
                      </SlideFade>
                    )
                  })}
                </HStack>
              )}
              {/**
               * Using `display: none` instead of conditional rendering or Fade wrapper so these
               * expensive components don't rerender but do get removed from the layout
               */}
              <HStack
                flex="1 0 auto"
                justifyContent="flex-end"
                sx={!isOpen && { display: "none" }}
                animation="slideFadeIn .2s"
              >
                <RoleCardMemberCount
                  memberCount={role.memberCount}
                  lastSyncedAt={role.lastSyncedAt}
                  roleId={role.id}
                />

                {isAdmin && isDetailed && (
                  <>
                    <Spacer m="0 !important" />
                    <DynamicEditRole roleId={role.id} />
                  </>
                )}
              </HStack>
            </RoleHeader>
            {role.description && (
              <SlideFade
                offsetY={10}
                in={isOpen}
                /**
                 * Spreading inert because it's not added to @types/react yet:
                 * https://github.com/DefinitelyTyped/DefinitelyTyped/pull/60822
                 */
                {...(!isOpen && ({ inert: "true" } as any))}
              >
                <RoleDescription
                  description={role.description}
                  {...{
                    isExpanded,
                    onToggleExpanded,
                    descriptionRef,
                    initialRequirementsRef,
                  }}
                />
              </SlideFade>
            )}

            <RoleRewards role={role} isOpen={isOpen} />
          </Flex>
          <RoleRequirementsSection isOpen={isOpen}>
            <RoleRequirementsSectionHeader isOpen={isOpen}>
              <Spacer />
              <ClientOnly>
                {!isMobile && (
                  <AccessIndicator roleId={role.id} {...{ isOpen, onToggle }} />
                )}
              </ClientOnly>
            </RoleRequirementsSectionHeader>
            <RoleRequirements
              {...{
                role,
                isOpen,
                isExpanded,
                onToggleExpanded,
                descriptionRef,
                initialRequirementsRef,
              }}
            />
          </RoleRequirementsSection>
        </SimpleGrid>
      </Collapse>

      <ClientOnly>
        {isMobile && <AccessIndicator roleId={role.id} {...{ isOpen, onToggle }} />}
      </ClientOnly>
    </Card>
  )
})

export default RoleCard
