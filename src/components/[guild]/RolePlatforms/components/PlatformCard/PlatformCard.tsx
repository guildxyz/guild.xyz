import RewardCard from "components/common/RewardCard"
import rewards, { CardPropsHook } from "platforms/rewards"
import { PropsWithChildren } from "react"
import { GuildPlatformWithOptionalId, Rest } from "types"

type Props = {
  guildPlatform: GuildPlatformWithOptionalId
  usePlatformCardProps: CardPropsHook
  titleRightElement?: JSX.Element
  actionRow?: JSX.Element
  cornerButton?: JSX.Element
  contentRow?: JSX.Element
} & Rest

const PlatformCard = ({
  guildPlatform,
  usePlatformCardProps,
  titleRightElement,
  actionRow,
  cornerButton,
  contentRow,
  children,
  ...rest
}: PropsWithChildren<Props>) => {
  const { info, name, image, type, shouldHide } = usePlatformCardProps(guildPlatform)

  if (shouldHide) return null

  return (
    <RewardCard
      label={rewards[type].name}
      title={name}
      titleRightElement={titleRightElement}
      description={contentRow || info}
      image={image}
      colorScheme={rewards[type].colorScheme}
      {...{ actionRow, cornerButton }}
      {...rest}
    >
      {children}
    </RewardCard>
  )
}

export default PlatformCard
