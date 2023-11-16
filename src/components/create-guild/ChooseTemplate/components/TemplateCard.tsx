import {
  Box,
  Checkbox,
  Circle,
  Collapse,
  Flex,
  HStack,
  Heading,
  Icon,
  SimpleGrid,
  Spacer,
  Text,
  Tooltip,
  Wrap,
  useColorModeValue,
} from "@chakra-ui/react"
import LogicDivider from "components/[guild]/LogicDivider"
import RequirementDisplayComponent from "components/[guild]/Requirements/components/RequirementDisplayComponent"
import HiddenRewards from "components/[guild]/RoleCard/components/HiddenRewards"
import {
  RewardDisplay,
  RewardIcon,
} from "components/[guild]/RoleCard/components/Reward"
import Card from "components/common/Card"
import GuildLogo from "components/common/GuildLogo"
import { Check } from "phosphor-react"
import platforms, { PlatformAsRewardRestrictions } from "platforms/platforms"
import { Fragment, KeyboardEvent } from "react"
import { useWatch } from "react-hook-form"
import {
  GuildFormType,
  GuildPlatform,
  PlatformType,
  Requirement,
  RoleFormType,
} from "types"
import capitalize from "utils/capitalize"

type Template = {
  name: string
  description?: string
  role: RoleFormType
}

type Props = Template & {
  selected?: boolean
  part: number
  onClick: (templateName: string) => void
  onCheckReward: (rewardIndex: number) => void
}

const getRewardLabel = (platform: Partial<GuildPlatform>) => {
  switch (platform.platformId) {
    case PlatformType.DISCORD:
      return "Role in: "

    case PlatformType.GOOGLE:
      return `${capitalize(platform.platformGuildData.role ?? "reader")} access to: `

    default:
      return "Access to: "
  }
}

const TemplateCard = ({
  name,
  description,
  role,
  selected,
  part,
  onClick,
  onCheckReward,
}: Props): JSX.Element => {
  const roleBottomBgColor = useColorModeValue("gray.50", "blackAlpha.300")
  const roleBottomBorderColor = useColorModeValue("gray.200", "gray.600")

  const roles = useWatch<GuildFormType, "roles">({ name: "roles" })
  const guildPlatforms = useWatch<GuildFormType, "guildPlatforms">({
    name: "guildPlatforms",
  })

  return (
    <Box
      shadow={part === 0 ? "sm" : "md"}
      tabIndex={0}
      onClick={() => onClick(name)}
      onKeyDown={(e: KeyboardEvent) => {
        if (e.key !== "Enter" && e.key !== " ") return
        e.preventDefault()
        onClick(name)
      }}
      position="relative"
      mb={3}
      borderRadius="2xl"
      overflow="hidden"
      _before={{
        content: `""`,
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        bg: "gray.300",
        opacity: 0,
        transition: "opacity 0.2s",
      }}
      _hover={{
        _before: {
          opacity: part === 0 ? 0.1 : 0,
        },
      }}
      _active={{
        _before: {
          opacity: part === 0 ? 0.17 : 0,
        },
      }}
      cursor={part === 0 ? "pointer" : "default"}
      h="max-content"
      w="full"
    >
      <Card overflow="hidden">
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
                    mt="-1px !important"
                  >
                    {role.name}
                  </Heading>
                </Wrap>
              </HStack>
            </HStack>

            <Collapse in={part === 0}>
              <Box pl={5} pb={5}>
                {description}
              </Box>
            </Collapse>

            <Collapse in={part === 1} style={{ marginTop: "auto" }}>
              <Box
                p={5}
                pt={2}
                borderWidth={2}
                borderColor="primary.500"
                borderRadius={6}
                background={roleBottomBgColor}
                borderStyle={"dashed"}
                m={5}
              >
                {guildPlatforms?.length ? (
                  guildPlatforms.map((platform, i) => {
                    const isDisabled =
                      platforms[platform.platformName].asRewardRestriction ===
                        PlatformAsRewardRestrictions.SINGLE_ROLE &&
                      roles
                        .filter((r) => r.name !== name)
                        .some((r) =>
                          r.rolePlatforms?.find(
                            (rolePlatform) => rolePlatform.guildPlatformIndex === i
                          )
                        )

                    return (
                      <Tooltip
                        key={i}
                        label={
                          isDisabled
                            ? `${
                                platforms[platform.platformName].name
                              } rewards can only be added to one role`
                            : ""
                        }
                        hasArrow
                      >
                        <HStack
                          gap={3}
                          alignItems={"flex-start"}
                          onClick={(e) => {
                            e.preventDefault()
                            if (!isDisabled) onCheckReward(i)
                          }}
                        >
                          <Checkbox
                            pt={4}
                            isDisabled={isDisabled}
                            isChecked={
                              !!roles
                                .find((r) => r.name === name)
                                ?.rolePlatforms?.find(
                                  (rolePlatform) =>
                                    rolePlatform.guildPlatformIndex === i
                                )
                            }
                          />
                          <RewardDisplay
                            flexGrow={1}
                            label={
                              <>
                                {getRewardLabel(platform)}
                                <Text as="span" fontWeight="bold">
                                  {getValueToDisplay(platform)}
                                </Text>
                              </>
                            }
                            icon={
                              <RewardIcon
                                rolePlatformId={platform.id}
                                guildPlatform={platform as GuildPlatform}
                                withMotionImg={false}
                              />
                            }
                          />
                        </HStack>
                      </Tooltip>
                    )
                  })
                ) : (
                  <Text colorScheme="gray" fontSize={14} pt={3}>
                    You haven't set any platforms that could be rewards in step 1.
                    You can go back and set some now, or add rewards later
                  </Text>
                )}
                {role.hiddenRewards && <HiddenRewards />}
              </Box>
            </Collapse>
          </Flex>

          <Flex
            direction="column"
            bgColor={roleBottomBgColor}
            borderLeftWidth={{ base: 0, md: 1 }}
            borderLeftColor={roleBottomBorderColor}
            transition="background .2s"
            // Card's `overflow: clip` isn't enough in Safari
            borderTopRightRadius={{ md: "2xl" }}
            borderBottomRightRadius={{ md: "2xl" }}
            pos="relative"
          >
            <HStack p={5} pb={0} mb={{ base: 4, md: 6 }} transition="transform .2s">
              <Text
                as="span"
                mt="1"
                mr="2"
                fontSize="xs"
                fontWeight="bold"
                color="gray"
                textTransform="uppercase"
                noOfLines={1}
                transition="opacity .2s"
              >
                Requirements to qualify
              </Text>
              <Spacer />
            </HStack>
            <Box p={5} pt={0}>
              {role.requirements.map((requirement, i) => (
                <Fragment key={i}>
                  <RequirementDisplayComponent
                    requirement={requirement as Requirement}
                    {...(["EMAIL_VERIFIED", "TWITTER_FOLLOWER_COUNT"].includes(
                      requirement.type
                    )
                      ? { footer: null }
                      : undefined)}
                  />
                  {i < role.requirements.length - 1 && (
                    <LogicDivider logic={role.logic} py={1} />
                  )}
                </Fragment>
              ))}
            </Box>
          </Flex>
        </SimpleGrid>
      </Card>
      {part === 0 && (
        <Flex
          position="absolute"
          inset={0}
          justifyContent="end"
          p={5}
          borderWidth={2}
          borderStyle={selected ? "solid" : "dashed"}
          borderColor={selected && part === 0 && "green.500"}
          borderRadius="2xl"
          pointerEvents="none"
          transition="border 0.16s ease"
        >
          {selected ? (
            <Circle
              bgColor="green.500"
              color="white"
              size={6}
              transition="opacity 0.16s ease"
              opacity={selected ? 1 : 0}
            >
              <Icon as={Check} />
            </Circle>
          ) : (
            <Circle
              borderColor={"gray"}
              borderStyle={"solid"}
              borderWidth={2}
              size={6}
            />
          )}
        </Flex>
      )}
    </Box>
  )
}

const getValueToDisplay = (
  platform: Partial<GuildPlatform> & {
    platformName: string
  }
): string =>
  platform.platformGuildData.name ??
  `${platforms[platform.platformName].name} ${
    platforms[platform.platformName].gatedEntity
  }`

export default TemplateCard
export type { Template }
