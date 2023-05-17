import { Img, Text } from "@chakra-ui/react"
import useGuild from "components/[guild]/hooks/useGuild"
import { RewardDisplay } from "components/[guild]/RoleCard/components/Reward"
import { GuildAction, useMintGuildPinContext } from "../MintGuildPinContext"

const GuildPinReward = (): JSX.Element => {
  const { pinType, pinImage } = useMintGuildPinContext()
  const { name } = useGuild()

  const guildPinDescription: Record<GuildAction, string> = {
    [GuildAction.JOINED_GUILD]: `Joined ${name} `,
    [GuildAction.IS_OWNER]: `Owner of ${name} `,
    [GuildAction.IS_ADMIN]: `Admin of ${name} `,
  }

  return (
    <RewardDisplay
      icon={
        <Img
          w="full"
          zIndex={1}
          src={`${process.env.NEXT_PUBLIC_IPFS_GATEWAY}${pinImage}`}
          alt="Guild Pin image"
          borderRadius="full"
          boxSize="6"
        />
      }
      label={
        <>
          {`Guild Pin: `}
          <Text as="span" fontWeight={"semibold"}>
            {guildPinDescription[pinType]}
          </Text>
        </>
      }
    />
  )
}

export default GuildPinReward
