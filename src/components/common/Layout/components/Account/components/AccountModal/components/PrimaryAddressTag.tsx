import { Tag, ThemingProps, Tooltip } from "@chakra-ui/react"

type Props = {
  size?: ThemingProps<"Tag">["size"]
}

const PrimaryAddressTag = ({ size }: Props): JSX.Element => (
  <Tooltip
    label="Guild owners will receive this address if they export members from their guild."
    placement="top"
    hasArrow
  >
    <Tag tabIndex={0} alignSelf="center" cursor="default" size={size}>
      Primary
    </Tag>
  </Tooltip>
)

export default PrimaryAddressTag
