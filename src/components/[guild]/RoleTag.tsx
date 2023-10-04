import {
  forwardRef,
  Img,
  Tag,
  TagLabel,
  TagLeftIcon,
  TagProps,
  TagRightIcon,
  useColorModeValue,
} from "@chakra-ui/react"
import { IconProps } from "phosphor-react"
import { ForwardRefExoticComponent, RefAttributes } from "react"

type Props = {
  name: string
  imageUrl?: string
  isHidden?: boolean
  rightIcon?: ForwardRefExoticComponent<IconProps & RefAttributes<SVGSVGElement>>
} & TagProps

const RoleTag = forwardRef<Props, "span">(
  ({ name, imageUrl, isHidden, rightIcon, ...rest }, ref): JSX.Element => {
    const publicRoleBg = useColorModeValue("gray.700", "blackAlpha.300")

    return (
      <Tag
        ref={ref}
        {...(isHidden
          ? { variant: "solid", colorScheme: "gray" }
          : { bg: publicRoleBg, color: "white" })}
        {...rest}
      >
        {imageUrl &&
          (imageUrl?.startsWith("/guildLogos") ? (
            <TagLeftIcon as={Img} src={imageUrl} />
          ) : (
            <TagLeftIcon as={Img} src={imageUrl} borderRadius={"full"} boxSize="4" />
          ))}
        <TagLabel>{name ?? "Unknown role"}</TagLabel>

        {rightIcon && <TagRightIcon as={rightIcon} />}
      </Tag>
    )
  }
)

export default RoleTag
