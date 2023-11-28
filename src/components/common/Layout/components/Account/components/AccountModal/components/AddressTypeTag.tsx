import {
  Img,
  Tag,
  TagLabel,
  TagLeftIcon,
  ThemingProps,
  useBreakpointValue,
} from "@chakra-ui/react"
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

const AddressTypeTag = ({ type, size }: Props) => {
  const tagLeftIconMr = useBreakpointValue({ base: 0, sm: 1 })
  const tagPx = useBreakpointValue({ base: 1, sm: 2 })
  const showTagLabel = useBreakpointValue({ base: false, sm: true })

  return (
    <Tag size={size} px={tagPx}>
      <TagLeftIcon as={Img} src={TYPE_ICONS[type]} alt={type} mr={tagLeftIconMr} />
      {showTagLabel && <TagLabel>{TYPE_NAMES[type]}</TagLabel>}
    </Tag>
  )
}
export default AddressTypeTag
