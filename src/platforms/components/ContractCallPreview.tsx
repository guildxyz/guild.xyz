import useSetRoleImageAndNameFromPlatformData from "components/[guild]/AddRewardButton/hooks/useSetRoleImageAndNameFromPlatformData"
import useNftDetails from "components/[guild]/collect/hooks/useNftDetails"
import { useWatch } from "react-hook-form"
import PlatformPreview from "./PlatformPreview"

const ContractCallPreview = (): JSX.Element => {
  const chain = useWatch({
    name: "rolePlatforms.0.guildPlatform.platformGuildData.chain",
  })
  const contractAddress = useWatch({
    name: "rolePlatforms.0.guildPlatform.platformGuildData.contractAddress",
  })
  const { name, image, isLoading } = useNftDetails(chain, contractAddress)

  useSetRoleImageAndNameFromPlatformData(image, name)

  return (
    <PlatformPreview
      type="CONTRACT_CALL"
      isLoading={isLoading}
      name={name}
      image={image}
    />
  )
}

export default ContractCallPreview
