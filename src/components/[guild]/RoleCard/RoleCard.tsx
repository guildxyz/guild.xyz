import {
  Box,
  Collapse,
  Flex,
  Heading,
  HStack,
  SimpleGrid,
  SlideFade,
  Spacer,
  Text,
  useBreakpointValue,
  useColorModeValue,
  useDisclosure,
  Wrap,
} from "@chakra-ui/react"
import Card from "components/common/Card"
import GuildLogo from "components/common/GuildLogo"
import dynamic from "next/dynamic"
import { memo, useEffect, useRef } from "react"
import { PlatformType, Role, Visibility as VisibilityType } from "types"
import useAccess from "../hooks/useAccess"
import useGuild from "../hooks/useGuild"
import useGuildPermission from "../hooks/useGuildPermission"
import useIsMember from "../hooks/useIsMember"
import RoleRequirements from "../Requirements"
import Visibility from "../Visibility"
import AccessIndicator from "./components/AccessIndicator"
import HiddenRewards from "./components/HiddenRewards"
import MemberCount from "./components/MemberCount"
import Reward, { RewardIcon } from "./components/Reward"
import { ContractCallRewardIcon } from "./components/Reward/components/ContractCallReward"
import RoleDescription from "./components/RoleDescription"

type Props = {
  role: Role
}

const DynamicEditRole = dynamic(() => import("./components/EditRole"))

const RoleCard = memo(({ role }: Props) => {
  const { guildPlatforms } = useGuild()
  const { isAdmin } = useGuildPermission()
  const isMember = useIsMember()
  const { hasAccess } = useAccess(role.id)
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
  }, [isOpen])

  useEffect(() => {
    if (isMember && hasAccess && !isAdmin) onClose()
    else onOpen()
  }, [hasAccess, isMember])

  const isMobile = useBreakpointValue({ base: true, md: false }, { fallback: "md" })
  const requirementsSectionBgColor = useColorModeValue("gray.50", "blackAlpha.300")
  const requirementsSectionBorderColor = useColorModeValue("gray.200", "gray.600")

  const collapsedHeight =
    isMobile && role.visibility === VisibilityType.PUBLIC ? "90px" : "94px"

  return (
    <Card
      id={`role-${role.id}`}
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
      {...(role.visibility === VisibilityType.HIDDEN
        ? {
            borderWidth: 2,
            borderStyle: "dashed",
          }
        : {})}
    >
      <Collapse in={isOpen} startingHeight={collapsedHeight}>
        <SimpleGrid columns={{ base: 1, md: 2 }}>
          <Flex direction="column">
            <HStack spacing={3} p={5}>
              <HStack spacing={4} minW={0}>
                <GuildLogo
                  imageUrl={role.imageUrl}
                  size={{ base: "48px", md: "52px" }}
                />
                <Wrap spacingX={3} spacingY={1}>
                  <Heading
                    as="h3"
                    fontSize="xl"
                    fontFamily="display"
                    minW={0}
                    overflowWrap={"break-word"}
                    noOfLines={!isOpen && 1}
                    mt="-1px !important"
                  >
                    {role.name}
                  </Heading>
                  <Visibility entityVisibility={role.visibility} showTagLabel />
                </Wrap>
              </HStack>
              {!isOpen && (
                <HStack
                  flex="1 0 auto"
                  justifyContent={{ base: "flex-end", md: "unset" }}
                >
                  {role.rolePlatforms?.map((platform, i) => {
                    const guildPlatform = guildPlatforms?.find(
                      (p) => p.id === platform.guildPlatformId
                    )
                    const Component =
                      guildPlatform.platformId === PlatformType.CONTRACT_CALL
                        ? ContractCallRewardIcon
                        : RewardIcon

                    return (
                      <Component
                        rolePlatformId={platform.id}
                        guildPlatform={guildPlatform}
                        transition={{
                          bounce: 0.2,
                          delay: i * 0.05,
                        }}
                        key={i}
                      />
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
                <MemberCount memberCount={role.memberCount} roleId={role.id} />

                {isAdmin && (
                  <>
                    <Spacer m="0 !important" />
                    <DynamicEditRole roleId={role.id} />
                  </>
                )}
              </HStack>
            </HStack>
            {role.description && (
              <SlideFade
                offsetY={10}
                in={isOpen}
                /**
                 * Spreading inert because it's not added to @types/react yet:
                 * https://github.com/DefinitelyTyped/DefinitelyTyped/pull/60822
                 */
                {...(!isOpen && { inert: "true" })}
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
            <Box p={5} pt={2} mt="auto">
              {role.rolePlatforms?.map((platform, i) => (
                <SlideFade
                  key={platform.guildPlatformId}
                  offsetY={10}
                  in={isOpen}
                  transition={{ enter: { delay: i * 0.1 } }}
                  /**
                   * Spreading inert because it's not added to @types/react yet:
                   * https://github.com/DefinitelyTyped/DefinitelyTyped/pull/60822
                   */
                  {...(!isOpen && { inert: "true" })}
                >
                  <Reward platform={platform} role={role} withLink withMotionImg />
                </SlideFade>
              ))}
              {role.hiddenRewards && <HiddenRewards />}
            </Box>
          </Flex>
          <Flex
            direction="column"
            p={5}
            bgColor={isOpen && requirementsSectionBgColor}
            borderLeftWidth={{ base: 0, md: 1 }}
            borderLeftColor={isOpen ? requirementsSectionBorderColor : "transparent"}
            transition="background .2s"
            // Card's `overflow: clip` isn't enough in Safari
            borderTopRightRadius={{ md: "2xl" }}
            borderBottomRightRadius={{ md: "2xl" }}
            pos="relative"
          >
            <HStack
              mb={{ base: 4, md: 6 }}
              transform={!isOpen && "translateY(10px)"}
              transition="transform .2s"
            >
              <Text
                as="span"
                mt="1"
                mr="2"
                fontSize="xs"
                fontWeight="bold"
                color="gray"
                textTransform="uppercase"
                noOfLines={1}
                opacity={isOpen ? 1 : 0}
                pointerEvents={!isOpen ? "none" : "auto"}
                transition="opacity .2s"
              >
                Requirements to qualify
              </Text>
              <Spacer />
              {!isMobile && (
                <AccessIndicator roleId={role.id} {...{ isOpen, onToggle }} />
              )}
            </HStack>
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
          </Flex>
        </SimpleGrid>
      </Collapse>
      {isMobile && <AccessIndicator roleId={role.id} {...{ isOpen, onToggle }} />}
    </Card>
  )
})

export default RoleCard
