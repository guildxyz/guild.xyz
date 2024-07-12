import { Icon, Tooltip, useColorModeValue } from "@chakra-ui/react"
import { useMintGuildPinContext } from "components/[guild]/Requirements/components/GuildCheckout/MintGuildPinContext"
import useGuild from "components/[guild]/hooks/useGuild"
import useGuildPermission from "components/[guild]/hooks/useGuildPermission"
import RewardCard from "components/common/RewardCard"
import dynamic from "next/dynamic"
import { CircleWavyCheck, Question } from "phosphor-react"

const DynamicMintGuildPin = dynamic(
  () =>
    import("components/[guild]/Requirements/components/GuildCheckout/MintGuildPin")
)
const DynamicMintFuelGuildPin = dynamic(
  () =>
    import(
      "components/[guild]/Requirements/components/GuildCheckout/MintGuildPin/Fuel/MintFuelGuildPin"
    )
)

const GuildPinRewardCard = () => {
  const bgColor = useColorModeValue("var(--chakra-colors-gray-100)", "#343439")
  const bgFile = useColorModeValue("bg_light.svg", "bg.svg")

  const { isAdmin } = useGuildPermission()
  const { guildPin } = useGuild()

  const { isInvalidImage, isTooSmallImage } = useMintGuildPinContext()

  return (
    <RewardCard
      data-test="guild-pin-reward-card"
      label={
        <>
          <Icon as={CircleWavyCheck} mb="-2px" mr="1.5" />
          Guild.xyz
          <Tooltip label="This is a built in reward by Guild.xyz" hasArrow>
            <Icon as={Question} mb="-2px" ml="1.5" />
          </Tooltip>
        </>
      }
      title="Guild Pin"
      image="/img/guild-pin-key-3d.svg"
      colorScheme={!guildPin?.isActive ? "gray" : "GUILD"}
      borderStyle={!guildPin?.isActive && "dashed"}
      description={
        !guildPin?.isActive
          ? "Mintable badge of membership"
          : "Onchain badge that shows your support and belonging to this community."
      }
      bg={bgColor}
      _before={{
        content: '""',
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        bg: `linear-gradient(to top right, ${bgColor} 70%, transparent), url('/landing/${bgFile}')`,
        bgSize: "140%",
        bgRepeat: "no-repeat",
        bgPosition: "top 7px right 7px",
        opacity: "0.07",
      }}
    >
      {(!(isInvalidImage || isTooSmallImage) || isAdmin) &&
        (guildPin?.chain !== "FUEL" ? (
          <DynamicMintGuildPin />
        ) : (
          <DynamicMintFuelGuildPin />
        ))}
    </RewardCard>
  )
}

export default GuildPinRewardCard
