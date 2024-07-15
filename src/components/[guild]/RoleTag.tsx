import {
  Center,
  Img,
  Tag,
  TagLabel,
  TagLeftIcon,
  TagProps,
  TagRightIcon,
  forwardRef,
  useColorModeValue,
} from "@chakra-ui/react"
import { IconProps } from "@phosphor-icons/react/dist/lib/types"
import { ForwardRefExoticComponent, RefAttributes, memo } from "react"

type Props = {
  name: string
  imageUrl?: string
  isHidden?: boolean
  rightIcon?: ForwardRefExoticComponent<IconProps & RefAttributes<SVGSVGElement>>
  amount?: number
} & TagProps

const RoleTag = memo(
  forwardRef<Props, "span">(
    ({ name, imageUrl, isHidden, rightIcon, amount, ...rest }, ref): JSX.Element => {
      const publicRoleBg = useColorModeValue("gray.700", "blackAlpha.300")

      return (
        <Tag
          ref={ref}
          {...(isHidden
            ? { variant: "solid", colorScheme: "gray" }
            : { bg: publicRoleBg, color: "white" })}
          overflow="hidden"
          {...rest}
        >
          {imageUrl &&
            (imageUrl?.startsWith("/guildLogos") ? (
              <TagLeftIcon as={Img} src={imageUrl} />
            ) : (
              <TagLeftIcon
                as={Img}
                src={imageUrl}
                borderRadius={"full"}
                boxSize="3.5"
              />
            ))}
          <TagLabel>{name ?? "Unknown role"}</TagLabel>
          {amount ? (
            <Center bgColor="blackAlpha.300" h={6} px={1.5} ml={2} mr={-2}>
              {amount}
            </Center>
          ) : rightIcon ? (
            <TagRightIcon as={rightIcon} />
          ) : null}
        </Tag>
      )
    }
  )
)

export default RoleTag
