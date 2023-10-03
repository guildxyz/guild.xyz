import {
  Circle,
  forwardRef,
  HStack,
  Img,
  Tag,
  TagProps,
  Text,
  useColorModeValue,
} from "@chakra-ui/react"
import { useYourGuilds } from "components/explorer/YourGuilds"
import { useActivityLog } from "../../ActivityLogContext"
import ClickableTagPopover from "./ClickableTagPopover"
import FilterBy from "./ClickableTagPopover/components/FilterBy"

type Props = ClickableGuildTagProps & Omit<TagProps, "colorScheme">

const GuildTag = forwardRef<Props, "span">(
  ({ guildId, ...tagProps }: Props, ref): JSX.Element => {
    const tagColorScheme = useColorModeValue("alpha", "blackalpha")
    const imgBgColor = useColorModeValue("gray.700", "gray.600")

    const { data } = useActivityLog()
    const { data: yourGuilds } = useYourGuilds()

    const guildFromActivityLog = data?.values.guilds.find((g) => g.id === guildId)
    const guildFromYourGuilds = yourGuilds?.find((g) => g.id === guildId)

    const image = guildFromYourGuilds?.imageUrl

    const name = guildFromActivityLog?.name ?? guildFromYourGuilds?.name

    return (
      <Tag
        ref={ref}
        colorScheme={tagColorScheme}
        minW="max-content"
        h="max-content"
        {...tagProps}
      >
        {!name ? (
          "Unknown guild"
        ) : (
          <HStack spacing={1}>
            {image && (
              <Circle bgColor={imgBgColor} size={4}>
                <Img
                  boxSize={image?.startsWith("/guildLogos") ? 2.5 : 4}
                  borderRadius={!image?.startsWith("/guildLogos") && "full"}
                  src={image}
                  alt={name}
                />
              </Circle>
            )}
            <Text as="span" w="max-content">
              {name}
            </Text>
          </HStack>
        )}
      </Tag>
    )
  }
)

type ClickableGuildTagProps = {
  guildId: number
}

const ClickableGuildTag = ({ guildId }: ClickableGuildTagProps): JSX.Element => (
  <ClickableTagPopover
    options={
      <FilterBy
        filter={{
          filter: "guildId",
          value: guildId?.toString(),
        }}
      />
    }
  >
    <GuildTag guildId={guildId} cursor={"pointer"} />
  </ClickableTagPopover>
)

export default GuildTag
export { ClickableGuildTag }
