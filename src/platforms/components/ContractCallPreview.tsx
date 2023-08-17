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
  const { data, isValidating } = useNftDetails(chain, contractAddress)

  useSetRoleImageAndNameFromPlatformData(data?.image, data?.name)

  return (
    <PlatformPreview
      type="CONTRACT_CALL"
      isLoading={isValidating}
      name={data?.name}
      image={data?.image}
    />
  )
}

export default ContractCallPreview
