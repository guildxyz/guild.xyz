import { Circle, Icon, Tag, Tooltip, useColorModeValue } from "@chakra-ui/react"
import { useAccessedGuildPoints } from "components/[guild]/AccessHub/hooks/useAccessedGuildPoints"
import useRequirements from "components/[guild]/hooks/useRequirements"
import GuildLogo from "components/common/GuildLogo"
import { ArrowRight } from "phosphor-react"
import { useTokenRewardContext } from "platforms/Token/TokenRewardContext"
import { useMemo } from "react"
import Star from "static/icons/star.svg"
import { RolePlatform } from "types"

const TokenConversionTag = ({ platform }: { platform: RolePlatform }) => {
  const {
    imageUrl,
    token: {
      data: { symbol },
    },
  } = useTokenRewardContext()

  const amount = useMemo(() => {
    const operation: any = platform.dynamicAmount.operation
    const params = operation.params
    return Number((params?.multiplier + params?.addition).toFixed(7))
  }, [platform])

  const { data: requirements } = useRequirements(
    platform.dynamicAmount?.operation?.input?.[0]?.roleId
  )
  const req = requirements?.find(
    (r) => r.id === platform.dynamicAmount?.operation?.input?.[0]?.requirementId
  )

  const pointsTypeId = req?.data?.guildPlatformId

  const accessedPoints = useAccessedGuildPoints("ALL")

  const pointType = accessedPoints?.find((ap) => ap.id === pointsTypeId)
  const bgColor = useColorModeValue("gray.800", "gray.700")

  return (
    <>
      <Tooltip
        label={`You are rewarded ${amount} ${symbol} for each of your ${
          pointType?.platformGuildData.name || "points"
        }.`}
        hasArrow
      >
        <Tag width={"fit-content"} size="lg">
          {pointType !== undefined && (
            <>
              {pointType?.platformGuildData.imageUrl ? (
                <>
                  <GuildLogo
                    imageUrl={pointType?.platformGuildData.imageUrl}
                    size={"16px"}
                    mr={1}
                  />
                </>
              ) : (
                <Circle size={5} bgColor={bgColor} mr={1} p={"4px"}>
                  <Star color="white" />
                </Circle>
              )}
            </>
          )}
          1 <Icon as={ArrowRight} boxSize={"10px"} ml={2} />{" "}
          <GuildLogo imageUrl={imageUrl} size={"16px"} mr={1} ml={2} /> {amount}
        </Tag>
      </Tooltip>
    </>
  )
}

export default TokenConversionTag
