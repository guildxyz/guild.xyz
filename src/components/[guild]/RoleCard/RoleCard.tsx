import { Card } from "@/components/ui/Card"
import { useDisclosure } from "@/hooks/useDisclosure"
import { cn } from "@/lib/utils"
import { useRoleMembership } from "components/explorer/hooks/useMembership"
import {
  AnimatePresence,
  AnimationProps,
  LazyMotion,
  domAnimation,
  m,
} from "framer-motion"
import dynamic from "next/dynamic"
import { Role } from "types"
import { useMediaQuery } from "usehooks-ts"
import { RoleRequirements } from "../Requirements/RoleRequirements"
import useGuild from "../hooks/useGuild"
import useGuildPermission from "../hooks/useGuildPermission"
import { AccessIndicator } from "./components/AccessIndicator"
import { RoleCardMemberCount } from "./components/MemberCount"
import { RewardIcon } from "./components/Reward"
import { RoleDescription } from "./components/RoleDescription"
import { RoleHeader } from "./components/RoleHeader"
import {
  RoleRequirementsSection,
  RoleRequirementsSectionHeader,
} from "./components/RoleRequirementsSection"
import { RoleRewards } from "./components/RoleRewards"

type Props = {
  role: Role
}

type RoleCardState = "open" | "closed"

const rewardIconContainerAnimationVariants = {
  open: {
    opacity: 0,
  },
  closed: {
    opacity: 1,
    transition: {
      duration: 0.2,
      staggerChildren: 0.05,
    },
  },
} as const satisfies Record<RoleCardState, AnimationProps["animate"]>

const rewardIconAnimationVariants = {
  open: {
    opacity: 0,
    translateX: 4,
  },
  closed: {
    opacity: 1,
    translateX: 0,
  },
} as const satisfies Record<RoleCardState, AnimationProps["animate"]>

const roleHeaderDetailsAnimationVariants = {
  closed: {
    opacity: 0,
    translateY: 4,
  },
  open: {
    opacity: 1,
    translateY: 0,
  },
} as const satisfies Record<RoleCardState, AnimationProps["animate"]>

const DynamicEditRole = dynamic(() => import("./components/EditRole"))

const RoleCard = ({ role }: Props) => {
  const { guildPlatforms, isDetailed } = useGuild()
  const { isAdmin } = useGuildPermission()
  const { hasRoleAccess } = useRoleMembership(role.id)
  const { isOpen, onToggle } = useDisclosure({
    defaultIsOpen: !hasRoleAccess,
  })

  const isMobile = useMediaQuery("(max-width: 640px")
  const collapsedHeight = isMobile && role.visibility === "PUBLIC" ? "90px" : "94px"

  return (
    <LazyMotion features={domAnimation}>
      <Card
        id={`role-${role.id}`}
        role="group"
        // scrollMarginTop doesn't work with overflow: hidden, that's why we used overflow: clip instead
        className={cn(
          "scroll-mt-[calc(theme(space.12)+theme(space.6))] overflow-clip target:ring-4 target:ring-ring",
          {
            "border-2 border-border border-dashed": role.visibility === "HIDDEN",
          }
        )}
        onClick={() => {
          if (window.location.hash === `#role-${role.id}`) window.location.hash = "!"
        }}
      >
        <m.div
          className="grid md:grid-cols-2"
          animate={{
            height: isOpen ? "auto" : collapsedHeight,
          }}
        >
          <div className="flex flex-col md:min-h-[22rem]">
            <RoleHeader role={role} isOpen={isOpen}>
              <AnimatePresence mode="popLayout">
                {isOpen ? (
                  <m.div
                    key="role-header-details"
                    className="flex flex-shrink-0 flex-grow basis-auto justify-end"
                    initial="closed"
                    animate="open"
                    exit="closed"
                    variants={roleHeaderDetailsAnimationVariants}
                  >
                    <RoleCardMemberCount
                      memberCount={role.memberCount}
                      lastSyncedAt={role.lastSyncedAt}
                      roleId={role.id}
                    />

                    {isAdmin && isDetailed && (
                      <div className="ml-auto">
                        <DynamicEditRole roleId={role.id} />
                      </div>
                    )}
                  </m.div>
                ) : (
                  <m.div
                    key="reward-icons"
                    className="flex flex-shrink-0 flex-grow basis-auto items-center justify-end md:justify-normal"
                    initial="open"
                    animate="closed"
                    exit="open"
                    variants={rewardIconContainerAnimationVariants}
                  >
                    {role.rolePlatforms?.map((platform) => {
                      const guildPlatform = guildPlatforms?.find(
                        (p) => p.id === platform.guildPlatformId
                      )

                      return (
                        <m.div
                          variants={rewardIconAnimationVariants}
                          className="-mr-2 rounded-full border-2 border-card"
                        >
                          <RewardIcon
                            rolePlatformId={platform.id}
                            guildPlatform={guildPlatform}
                          />
                        </m.div>
                      )
                    })}
                  </m.div>
                )}
              </AnimatePresence>
            </RoleHeader>

            {role.description && (
              <RoleDescription
                description={role.description}
                // boolean values didn't work, I guess that's a bug
                inert={!isOpen ? ("true" as unknown as boolean) : undefined}
                className={cn("translate-y-2 opacity-0 duration-200", {
                  "translate-y-0 opacity-100": isOpen,
                })}
              />
            )}

            <RoleRewards role={role} isOpen={isOpen} />
          </div>
          <RoleRequirementsSection isOpen={isOpen}>
            <RoleRequirementsSectionHeader isOpen={isOpen}>
              {!isMobile && (
                <AccessIndicator
                  roleId={role.id}
                  isOpen={isOpen}
                  onToggle={onToggle}
                />
              )}
            </RoleRequirementsSectionHeader>
            <RoleRequirements role={role} isOpen={isOpen} withScroll />
          </RoleRequirementsSection>
        </m.div>

        {isMobile && <AccessIndicator roleId={role.id} {...{ isOpen, onToggle }} />}
      </Card>
    </LazyMotion>
  )
}

export { RoleCard }
