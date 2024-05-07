import { Icon, Stack, Text } from "@chakra-ui/react"
import { useAccessedGuildPoints } from "components/[guild]/AccessHub/hooks/useAccessedGuildPoints"
import OptionImage from "components/common/StyledSelect/components/CustomSelectOption/components/OptionImage"
import { Star } from "phosphor-react"
import DynamicTypeForm from "platforms/Token/DynamicTypeForm"
import { ReactNode } from "react"
import { useWatch } from "react-hook-form"
import Token from "static/icons/token.svg"
import ConversionInput from "./ConversionInput"

export enum SnapshotOption {
  GUILD_POINTS = "GUILD_POINTS",
  CUSTOM = "CUSTOM",
}

const DynamicAmount = ({
  tokenData,
}: {
  tokenData: { name: string; symbol: string; decimals: number; logoURI: string }
}) => {
  const pointsPlatforms = useAccessedGuildPoints()
  const pointsPlatformId = useWatch({ name: "data.guildPlatformId" })
  const selectedPointsPlatform = pointsPlatforms.find(
    (gp) => gp.id === pointsPlatformId
  )

  const pointsPlatformImage: ReactNode = selectedPointsPlatform?.platformGuildData
    ?.imageUrl ? (
    <OptionImage
      img={selectedPointsPlatform?.platformGuildData?.imageUrl}
      alt={selectedPointsPlatform?.platformGuildData?.name ?? "Point type image"}
    />
  ) : (
    <Icon as={Star} />
  )

  return (
    <>
      <Text colorScheme="gray">
        Claimable amount is dynamic based on a snapshot containing each eligible user
        paired with a number.
      </Text>

      <DynamicTypeForm />

      <Stack gap={0}>
        <ConversionInput
          name="multiplier"
          toImage={
            tokenData.logoURI ? (
              <OptionImage img={tokenData.logoURI} alt={tokenData.symbol} />
            ) : (
              <Token />
            )
          }
          fromImage={pointsPlatformImage}
          defaultMultiplier={1}
        />
      </Stack>
    </>
  )
}

export default DynamicAmount
