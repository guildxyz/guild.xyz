import RewardCard from "components/common/RewardCard"
import platforms from "platforms/platforms"
import { ComponentType, PropsWithChildren } from "react"
import { GuildPlatform, PlatformName, PlatformType, Rest } from "types"

type Props = {
  actionRow?: JSX.Element
  cornerButton?: JSX.Element
  guildPlatform: GuildPlatform
  usePlatformProps: (guildPlatform: GuildPlatform) => {
    link?: string
    image?: string | JSX.Element
    name: string
    info?: string | JSX.Element
    type: PlatformName
    EditRolePlatformRow?: ComponentType<any>
  }
  withEditRolePlatformRow?: boolean
} & Rest

const PlatformCard = ({
  usePlatformProps,
  guildPlatform,
  actionRow,
  cornerButton,
  withEditRolePlatformRow,
  children,
  ...rest
}: PropsWithChildren<Props>) => {
  const { info, name, image, type, EditRolePlatformRow } =
    usePlatformProps(guildPlatform)

  return (
    <RewardCard
      label={platforms[type].name}
      title={name}
      description={
        !!EditRolePlatformRow && withEditRolePlatformRow ? (
          <EditRolePlatformRow
            platformType={PlatformType[guildPlatform.platformId]}
            onDone={console.log}
          />
        ) : (
          info
        )
      }
      image={image}
      colorScheme={platforms[type].colorScheme}
      {...{ actionRow, cornerButton }}
      {...rest}
    >
      {children}
    </RewardCard>
  )
}

export default PlatformCard
