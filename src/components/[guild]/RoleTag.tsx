import {
  Img,
  Tag,
  TagLabel,
  TagLeftIcon,
  TagProps,
  forwardRef,
  useColorModeValue,
} from "@chakra-ui/react"

type Props = {
  name: string
  imageUrl?: string
  isHidden?: boolean
} & TagProps

const RoleTag = forwardRef<Props, "span">(
  ({ name, imageUrl, isHidden, ...rest }, ref): JSX.Element => {
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
      </Tag>
    )
  }
)

export default RoleTag
