import {
  Circle,
  HStack,
  Img,
  Skeleton,
  SkeletonCircle,
  Stack,
  useColorModeValue,
} from "@chakra-ui/react"
import useGuild from "components/[guild]/hooks/useGuild"
import Button from "components/common/Button"
import Card from "components/common/Card"
import CardMotionWrapper from "components/common/CardMotionWrapper"
import OptionCard from "components/common/OptionCard"
import { Gateables } from "hooks/useGateables"
import NextLink from "next/link"
import { fileTypeNames } from "platforms/Google/useGoogleCardProps"
import { PlatformType } from "types"

type Props = {
  file: Gateables[PlatformType.GOOGLE][number]
  onSelect?: (platformGuildId: string) => void
  onCancel?: () => void
}

const GoogleDocCard = ({ file, onSelect, onCancel }: Props): JSX.Element => {
  const imageBgColor = useColorModeValue("gray.100", "gray.600")

  const { id } = useGuild() ?? {}

  const isUsedInCurrentGuild = file.isGuilded && file.guildId === id

  if (isUsedInCurrentGuild) return null

  return (
    <CardMotionWrapper>
      <OptionCard
        h="max-content"
        title={file.name}
        description={fileTypeNames[file.mimeType]}
        image={
          <Circle size={14} bgColor={imageBgColor}>
            <Img src={file.iconLink} alt={file.mimeType} />
          </Circle>
        }
      >
        <Stack w="full" spacing={4} justifyContent="space-between" h="full">
          {file.isGuilded ? (
            <Button
              as={NextLink}
              href={`/${file.guildId}`}
              colorScheme="gray"
              minW="max-content"
            >
              Go to guild
            </Button>
          ) : onSelect ? (
            <Button
              colorScheme="blue"
              h={10}
              onClick={() => onSelect(file.platformGuildId)}
            >
              Gate file
            </Button>
          ) : onCancel ? (
            <Button h={10} onClick={onCancel}>
              Cancel
            </Button>
          ) : null}
        </Stack>
      </OptionCard>
    </CardMotionWrapper>
  )
}

const GoogleSkeletonCard = () => (
  <Card px={{ base: 5, sm: 6 }} py="7">
    <Stack w="full" spacing={5} justifyContent="space-between" h="full">
      <HStack>
        <SkeletonCircle size="10" />

        <Stack spacing={3} overflow={"hidden"}>
          <Skeleton h={4} w={200} />
          <Skeleton h={4} w={20} />
        </Stack>
      </HStack>
    </Stack>
  </Card>
)

export default GoogleDocCard
export { GoogleSkeletonCard }
