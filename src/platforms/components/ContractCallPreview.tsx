import { Wrap } from "@chakra-ui/react"
import useSetRoleImageAndNameFromPlatformData from "components/[guild]/AddRewardButton/hooks/useSetRoleImageAndNameFromPlatformData"
import {
  CapacityTag,
  EndTimeTag,
  StartTimeTag,
} from "components/[guild]/RolePlatforms/components/PlatformCard/components/AvailabilityTags"
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

  const startTime = useWatch({
    name: "rolePlatforms.0.startTime",
  })
  const endTime = useWatch({
    name: "rolePlatforms.0.endTime",
  })

  return (
    <RewardPreview
      type="CONTRACT_CALL"
      isLoading={isLoading}
      name={name}
      image={imageUrl}
    >
      <Wrap>
        {!!maxSupply && <CapacityTag capacity={Number(maxSupply)} />}
        {!!startTime && <StartTimeTag startTime={startTime} />}

        {!!endTime && <EndTimeTag endTime={endTime} />}
      </Wrap>
    </RewardPreview>
  )
}

export default ContractCallPreview
