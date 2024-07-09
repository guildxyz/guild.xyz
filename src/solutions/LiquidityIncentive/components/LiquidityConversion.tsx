import { Icon } from "@chakra-ui/react"
import ConversionInput from "components/[guild]/RolePlatforms/components/AddRoleRewardModal/components/AddTokenPanel/components/ConversionInput"
import useGuildPlatform from "components/[guild]/hooks/useGuildPlatform"
import OptionImage from "components/common/StyledSelect/components/CustomSelectOption/components/OptionImage"
import { ReactNode } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import { useSymbolsOfPair } from "requirements/Uniswap/hooks/useSymbolsOfPair"
import Star from "static/icons/star.svg"
import { Chains } from "wagmiConfig/chains"
import { LiquidityIncentiveForm } from "../LiquidityIncentiveSetupModal"

const LiquidityConversion = () => {
  const { control } = useFormContext<LiquidityIncentiveForm>()
  useWatch({ control, name: "pool.chain" })

  const chain = useWatch({
    name: `pool.chain`,
    control,
  })

  const baseCurrency = useWatch({
    name: `pool.data.baseCurrency`,
    control,
  })
  const token0 = useWatch({ name: `pool.data.token0`, control })
  const token1 = useWatch({ name: `pool.data.token1`, control })

  const { symbol0, symbol1 } = useSymbolsOfPair(
    Chains[chain],
    token0 || null,
    token1 || null
  )

  const pointsPlatformId = useWatch({ name: "pointsId", control })
  const setupImageUrl = useWatch({ name: "imageUrl", control })

  const setupName = useWatch({ name: "name", control })

  const { guildPlatform: selectedPointsPlatform } = useGuildPlatform(
    pointsPlatformId || null
  )

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
      fromText={(baseCurrency === "token0" ? symbol0 : symbol1) ?? ""}
      fromImage={undefined}
      toText={name}
      toImage={pointsPlatformImage}
    />
  )
}

export default LiquidityConversion
