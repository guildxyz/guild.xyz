import { Icon } from "@chakra-ui/react"
import ConversionInput from "components/[guild]/RolePlatforms/components/AddRoleRewardModal/components/AddTokenPanel/components/ConversionInput"
import useGuildPlatform from "components/[guild]/hooks/useGuildPlatform"
import OptionImage from "components/common/StyledSelect/components/CustomSelectOption/components/OptionImage"
import { ReactNode } from "react"
import { useWatch } from "react-hook-form"
import { UniswapChains } from "requirements/Uniswap/hooks/useParsePoolTokenId"
import { useSymbolsOfPair } from "requirements/Uniswap/hooks/useSymbolsOfPair"
import Star from "static/icons/star.svg"
import { Chains } from "wagmiConfig/chains"

const LiquidityConversion = () => {
  const chain: UniswapChains = useWatch({
    name: `pool.chain`,
  })

  const token0 = useWatch({ name: `pool.data.token0` })
  const token1 = useWatch({ name: `pool.data.token1` })

  const { symbol0, symbol1 } = useSymbolsOfPair(Chains[chain], token0, token1)

  const pointsPlatformId = useWatch({ name: "pointsId" })
  const setupImageUrl = useWatch({ name: "imageUrl" })

  const setupName = useWatch({ name: "name" })

  const { guildPlatform: selectedPointsPlatform } =
    useGuildPlatform(pointsPlatformId)

  const imageUrl =
    selectedPointsPlatform?.platformGuildData?.imageUrl || setupImageUrl

  const name =
    selectedPointsPlatform?.platformGuildData?.name || setupName || "points"

  const pointsPlatformImage: ReactNode = imageUrl ? (
    <OptionImage
      img={imageUrl}
      alt={selectedPointsPlatform?.platformGuildData?.name ?? "Point type image"}
    />
  ) : (
    <Icon as={Star} />
  )

  return (
    <ConversionInput
      name={"conversion"}
      fromText={`${symbol0 ?? "___"}/${symbol1 ?? "___"}`}
      fromImage={undefined}
      toText={name}
      toImage={pointsPlatformImage}
    />
  )
}

export default LiquidityConversion
