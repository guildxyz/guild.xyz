import {
  HStack,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Portal,
  Progress,
  Spinner,
  Tag,
  TagLabel,
  TagLeftIcon,
  TagRightIcon,
  Text,
} from "@chakra-ui/react"
import { POPOVER_HEADER_STYLES } from "components/[guild]/Requirements/components/RequirementAccessIndicator"
import useActiveStatusUpdates from "hooks/useActiveStatusUpdates"
import { Users } from "phosphor-react"
import { PropsWithChildren } from "react"

type Props = {
  memberCount: number
  roleId?: number
  size?: "sm" | "md"
}

const MemberCount = ({
  memberCount,
  roleId,
  size = "md",
  children,
}: PropsWithChildren<Props>) => {
  const { status, data } = useActiveStatusUpdates(roleId)

  const iconSize = size === "sm" ? "14px" : "16px"

  if (status === "STARTED")
    return (
      <Popover trigger="hover" placement="bottom" isLazy>
        <PopoverTrigger>
          <Tag colorScheme="blue" mt="2px !important" flexShrink={0} size={size}>
            <TagLeftIcon as={Users} boxSize={iconSize} />
            <TagLabel mb="-1px">
              {new Intl.NumberFormat("en", { notation: "compact" }).format(
                memberCount ?? 0
              )}
            </TagLabel>
            <TagRightIcon as={Spinner} />
          </Tag>
        </PopoverTrigger>
        <Portal>
          <PopoverContent>
            <PopoverArrow />
            <PopoverHeader {...POPOVER_HEADER_STYLES} pb="0">
              Syncing members
            </PopoverHeader>
            <PopoverBody pt="1">
              Updating all member accesses. This can take a few hours, feel free to
              come back later!
              <StatusProgress {...{ data, status }} />
            </PopoverBody>
          </PopoverContent>
        </Portal>
      </Popover>
    )

  return (
    <Tag bg="unset" color="gray" mt="3px !important" flexShrink={0} size={size}>
      <TagLeftIcon as={Users} boxSize={iconSize} mr="1.5" />
      <TagLabel mb="-1px">
        {new Intl.NumberFormat("en", { notation: "compact" }).format(
          memberCount ?? 0
        )}
      </TagLabel>
      {children}
    </Tag>
  )
}

const StatusProgress = ({ data, status }) => {
  const percentage = (data.doneChunks / data.totalChunks) * 100

  return (
    <HStack mt="3" mb="1">
      <Progress
        value={status === null ? 100 : percentage || 1}
        colorScheme="blue"
        size="sm"
        borderRadius={"full"}
        flex={1}
        transition="width .3s"
      />
      <Text colorScheme="gray" fontSize="sm" fontWeight={"bold"} flexShrink={0}>
        {percentage.toFixed(0)}%
      </Text>
    </HStack>
  )
}

export default MemberCount
