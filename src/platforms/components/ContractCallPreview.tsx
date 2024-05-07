import { Text, Wrap } from "@chakra-ui/react"
import useSetRoleImageAndNameFromPlatformData from "components/[guild]/AddRewardButton/hooks/useSetRoleImageAndNameFromPlatformData"
import { CapacityTag } from "components/[guild]/RolePlatforms/components/PlatformCard/components/AvailabilityTags"
import useNftDetails from "components/[guild]/collect/hooks/useNftDetails"
import { useWatch } from "react-hook-form"
import RewardPreview from "./RewardPreview"

const ContractCallPreview = (): JSX.Element => {
  const chain = useWatch({
    name: "rolePlatforms.0.guildPlatform.platformGuildData.chain",
  })
  const contractAddress = useWatch({
    name: "rolePlatforms.0.guildPlatform.platformGuildData.contractAddress",
  })
  const imageUrl = useWatch({
    name: "rolePlatforms.0.guildPlatform.platformGuildData.imageUrl",
  })
  const { name, isLoading, maxSupply } = useNftDetails(chain, contractAddress)

  useSetRoleImageAndNameFromPlatformData(imageUrl, name)

  return (
    <RewardPreview
      type="CONTRACT_CALL"
      isLoading={isLoading}
      name={name}
      image={imageUrl}
    >
      <Wrap>
        {!!maxSupply && <CapacityTag capacity={maxSupply} />}
        <Text colorScheme="gray" fontSize="sm" fontWeight="normal">
          You'll be able to set up claim start/end date later
        </Text>
      </Wrap>
    </RewardPreview>
  )
}

export default ContractCallPreview
