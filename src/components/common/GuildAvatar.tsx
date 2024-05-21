import { Box, BoxProps, Icon, ResponsiveValue } from "@chakra-ui/react"
import dynamic from "next/dynamic"
import { memo } from "react"
import addressAvatarPairs from "static/avatars/addressAvatarPairs"

type Props = {
  size?: ResponsiveValue<number>
  address: string
} & BoxProps

const GuildAvatar = memo(({ size = 8, address, ...rest }: Props): JSX.Element => {
  const Avatar = dynamic(
    () =>
      import(
        `static/avatars/${addressAvatarPairs[address?.toLowerCase()?.slice(-2)]}.svg`
      )
  )

  return (
    <Box boxSize={size} {...rest}>
      <Icon as={Avatar} boxSize={size} />
    </Box>
  )
})

export default GuildAvatar
