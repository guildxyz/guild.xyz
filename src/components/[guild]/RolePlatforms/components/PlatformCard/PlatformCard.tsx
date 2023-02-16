import RewardCard from "components/common/RewardCard"
import platforms from "platforms"
import { PropsWithChildren } from "react"
import { GuildPlatform, PlatformName, Rest } from "types"

type Props = {
  actionRow?: JSX.Element
  cornerButton?: JSX.Element
  guildPlatform: GuildPlatform
  usePlatformProps: (guildPlatform: GuildPlatform) => {
    link?: string
    image?: string | JSX.Element
    name: string
    info?: string
    type: PlatformName
  }
} & Rest

const PlatformCard = ({
  usePlatformProps,
  guildPlatform,
  actionRow,
  cornerButton,
  children,
  ...rest
}: PropsWithChildren<Props>) => {
  const { info, name, image, type } = usePlatformProps(guildPlatform)

  return (
    <RewardCard
      label={platforms[type].name}
      title={name}
      description={info}
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
