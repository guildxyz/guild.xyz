import { Img, Text } from "@chakra-ui/react"
import { RewardDisplay } from "components/[guild]/RoleCard/components/Reward"
import useGuild from "components/[guild]/hooks/useGuild"
import { GuildAction, useMintCredentialContext } from "../MintCredentialContext"

const CredentialReward = (): JSX.Element => {
  const { credentialType, credentialImage } = useMintCredentialContext()
  const { name } = useGuild()

  const credentialDescription: Record<GuildAction, string> = {
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
          src={`${process.env.NEXT_PUBLIC_IPFS_GATEWAY}${credentialImage}`}
          alt="Guild Credential image"
          borderRadius="full"
          boxSize="6"
        />
      }
      label={
        <>
          {`Guild Credential: `}
          <Text as="span" fontWeight={"semibold"}>
            {credentialDescription[credentialType]}
          </Text>
        </>
      }
    />
  )
}

export default CredentialReward
