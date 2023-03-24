import {
  Box,
  Collapse,
  Flex,
  Heading,
  HStack,
  Img,
  SimpleGrid,
  SlideFade,
  Spacer,
  Text,
  useBreakpointValue,
  useColorMode,
  useDisclosure,
} from "@chakra-ui/react"
import Card from "components/common/Card"
import GuildLogo from "components/common/GuildLogo"
import { motion } from "framer-motion"
import dynamic from "next/dynamic"
import { Question } from "phosphor-react"
import { memo, useEffect } from "react"
import { PlatformType, Role, Visibility as VisibilityType } from "types"
import parseDescription from "utils/parseDescription"
import useAccess from "../hooks/useAccess"
import useGuild from "../hooks/useGuild"
import useGuildPermission from "../hooks/useGuildPermission"
import RoleRequirements from "../Requirements"
import Visibility from "../Visibility"
import AccessIndicator from "./components/AccessIndicator"
import MemberCount from "./components/MemberCount"
import Reward, { RewardDisplay } from "./components/Reward"

type Props = {
  role: Role
}

const DynamicEditRole = dynamic(() => import("./components/EditRole"))

const MotionImg = motion(Img)

const RoleCard = memo(({ role }: Props) => {
  const { guildPlatforms } = useGuild()
  const { isAdmin } = useGuildPermission()
  const { hasAccess } = useAccess(role.id)
  const { isOpen, onClose, onToggle } = useDisclosure({ defaultIsOpen: !hasAccess })

  const { colorMode } = useColorMode()
  const isMobile = useBreakpointValue({ base: true, md: false }, { fallback: "md" })

  useEffect(() => {
    if (!isAdmin && hasAccess) onClose()
  }, [hasAccess])

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
      position="relative"
    >
      <Collapse in={isOpen} startingHeight={isMobile ? "90px" : "94px"}>
        <SimpleGrid columns={{ base: 1, md: 2 }}>
          <Flex
            direction="column"
            p={5}
            borderRightWidth={isOpen && { base: 0, md: 1 }}
            borderRightColor={colorMode === "light" ? "gray.200" : "gray.600"}
          >
            <HStack justifyContent="space-between" spacing={3} pos="relative">
              <HStack spacing={4} minW={0} flexShrink={0}>
                <GuildLogo
                  imageUrl={role.imageUrl}
                  size={{ base: "48px", md: "52px" }}
                />
                <Heading
                  as="h3"
                  fontSize="xl"
                  fontFamily="display"
                  minW={0}
                  overflowWrap={"break-word"}
                >
                  {role.name}
                </Heading>
                {isOpen ? (
                  <Visibility
                    entityVisibility={role.visibility}
                    mt="6px !important"
                    showTagLabel
                  />
                ) : (
                  <HStack
                    pos={{ base: "absolute", md: "unset" }}
                    right={{ base: 0, md: "unset" }}
                  >
                    {role.rolePlatforms?.map((platform, i) => {
                      const guildPlatform = guildPlatforms?.find(
                        (p) => p.id === platform.guildPlatformId
                      )
                      return (
                        <MotionImg
                          layoutId={`${role.id}_role_${guildPlatform?.id}_reward_img`}
                          transition={{
                            type: "spring",
                            duration: 0.6,
                            bounce: 0.2,
                            delay: i * 0.05,
                          }}
                          key={i}
                          src={`/platforms/${PlatformType[
                            guildPlatform?.platformId
                          ]?.toLowerCase()}.png`}
                          boxSize="6"
                        />
                      )
                    })}
                  </HStack>
                )}
              </HStack>
              <SlideFade
                offsetY={10}
                in={isOpen}
                style={{
                  width: isOpen ? "auto" : "0 !important",
                  overflow: "hidden",
                }}
              >
                <MemberCount memberCount={role.memberCount} roleId={role.id} />
                {isAdmin && (
                  <>
                    <Spacer m="0 !important" />
                    <DynamicEditRole roleId={role.id} />
                  </>
                )}
              </SlideFade>
            </HStack>
            {role.description && (
              <SlideFade offsetY={10} in={isOpen}>
                <Box pt={6} wordBreak="break-word">
                  {parseDescription(role.description)}
                </Box>
              </SlideFade>
            )}
            <Box pt={6} mt="auto">
              {role.rolePlatforms?.map((platform, i) => (
                <SlideFade
                  key={platform.guildPlatformId}
                  offsetY={10}
                  in={isOpen}
                  transition={{ enter: { delay: i * 0.1 } }}
                >
                  <Reward withLink platform={platform} role={role} />
                </SlideFade>
              ))}
              {role.hiddenRewards && (
                <RewardDisplay
                  label={"Some secret rewards"}
                  icon={<Question size={25} />}
                />
              )}
            </Box>
          </Flex>
          <Flex
            direction="column"
            p={5}
            bgColor={
              isOpen && (colorMode === "light" ? "gray.50" : "blackAlpha.300")
            }
            transition="background .2s"
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
                transition="opacity .2s"
              >
                Requirements to qualify
              </Text>
              <Spacer />
              {!isMobile && (
                <AccessIndicator roleId={role.id} {...{ isOpen, onToggle }} />
              )}
            </HStack>
            <RoleRequirements role={role} isOpen={isOpen} />
          </Flex>
        </SimpleGrid>
      </Collapse>
      {isMobile && <AccessIndicator roleId={role.id} {...{ isOpen, onToggle }} />}
    </Card>
  )
})

export default RoleCard
