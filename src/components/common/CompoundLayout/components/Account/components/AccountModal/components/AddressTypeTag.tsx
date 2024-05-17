import { Img, Tag, ThemingProps, Tooltip } from "@chakra-ui/react"
import { User } from "types"

type AddressType = Exclude<User["addresses"][number]["walletType"], "EVM">

type Props = {
  type: AddressType
  size?: ThemingProps<"Tag">["size"]
}

const TYPE_ICONS: Record<AddressType, string> = {
  FUEL: "/walletLogos/fuel.svg",
}

const TYPE_NAMES: Record<AddressType, string> = {
  FUEL: "Fuel",
}

const AddressTypeTag = ({ type, size }: Props) => (
  <Tooltip placement="top" hasArrow label={TYPE_NAMES[type]}>
    <Tag size={size} px={1}>
      <Img src={TYPE_ICONS[type]} alt={TYPE_NAMES[type]} />
    </Tag>
  </Tooltip>
)

export default AddressTypeTag
