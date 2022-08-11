import { PropsWithChildren } from "react"
import { GuildPlatform, PlatformName } from "types"
import PlatformCard, { PlatformCardProps } from "./PlatformCard"

const PlatformCardWithInjectedProps = ({
  useCardProps,
  guildPlatform,
  children,
  ...rest
}: PropsWithChildren<
  {
    useCardProps: (guildPlatform: GuildPlatform) => {
      type: PlatformName
      name: string
      image?: string | JSX.Element
      info?: string
      link?: string
    }
    guildPlatform: GuildPlatform
  } & Partial<PlatformCardProps>
>) => {
  const props = useCardProps(guildPlatform)

  return (
    <PlatformCard {...props} {...rest}>
      {children}
    </PlatformCard>
  )
}

export default PlatformCardWithInjectedProps
