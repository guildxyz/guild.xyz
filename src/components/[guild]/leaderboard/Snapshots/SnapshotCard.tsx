import { Circle, HStack, Heading, Icon, Stack, Text } from "@chakra-ui/react"
import DisplayCard from "components/common/DisplayCard"
import { CaretRight } from "phosphor-react"
import Star from "static/icons/star.svg"

type Props = {
  image?: JSX.Element
  name: string
  date: string
  onClick: () => void
}

const SnapshotCard = ({ image, name, date, onClick }: Props) => {
  return (
    <DisplayCard bg="whiteAlpha.200" onClick={onClick}>
      <HStack gap={3}>
        <Circle
          position="relative"
          bgColor={"blackAlpha.300"}
          size={12}
          overflow="hidden"
        >
          {image ?? <Star />}
        </Circle>

        <Stack gap={0}>
          <Heading size={"sm"}>{name}</Heading>
          <Text size={"sm"} color="GrayText">
            {date}
          </Text>
        </Stack>
        <Icon as={CaretRight} boxSize={4} ml="auto" />
      </HStack>
    </DisplayCard>
  )
}

export default SnapshotCard
