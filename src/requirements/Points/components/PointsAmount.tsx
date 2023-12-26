import ExistingPointsTypeSelect from "components/[guild]/RolePlatforms/components/AddRoleRewardModal/components/AddPointsPanel/components/ExistingPointsTypeSelect"
import useGuild from "components/[guild]/hooks/useGuild"
import { useWatch } from "react-hook-form"
import GuildSelect from "requirements/common/GuildSelect"
import MinMaxAmount from "requirements/common/MinMaxAmount"
import { PlatformType } from "types"

type Props = {
  baseFieldPath: string
}

const PointsAmount = ({ baseFieldPath }: Props): JSX.Element => {
  const guildId = useWatch({ name: `${baseFieldPath}.data.guildId` })
  const guildPlatformId = useWatch({ name: `${baseFieldPath}.data.guildPlatformId` })

  const { guildPlatforms, isLoading } = useGuild(guildId)

  const existingPointsRewards = guildPlatforms?.filter(
    (gp) => gp.platformId === PlatformType.POINTS
  )

  return (
    <>
      <GuildSelect baseFieldPath={baseFieldPath} />

      <ExistingPointsTypeSelect
        existingPointsRewards={existingPointsRewards}
        selectedExistingId={guildPlatformId}
        isLoading={isLoading}
      />

      <MinMaxAmount baseFieldPath={baseFieldPath} field={null} />
    </>
  )
}

export default PointsAmount
