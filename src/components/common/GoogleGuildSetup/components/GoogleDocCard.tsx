import {
  Circle,
  HStack,
  Img,
  Skeleton,
  SkeletonCircle,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react"
import Button from "components/common/Button"
import Card from "components/common/Card"
import { fileTypeNames } from "components/[guild]/RolePlatforms/components/PlatformCard/components/useGoogleCardProps/useGoogleCardProps"
import { GoogleFile } from "types"

type Props = {
  file: GoogleFile
  onSelect?: (platformGuildId: string) => void
  onCancel?: () => void
}

const GoogleDocCard = ({ file, onSelect, onCancel }: Props): JSX.Element => {
  const imageBgColor = useColorModeValue("gray.100", "gray.800")

  return (
    <Card px={{ base: 5, sm: 6 }} py="7">
      <Stack w="full" spacing={4} justifyContent="space-between" h="full">
        <HStack>
          <Circle size={10} bgColor={imageBgColor}>
            <Img src={file.iconLink} alt={file.mimeType} />
          </Circle>
          <Stack spacing={0} overflow={"hidden"}>
            <Text
              as="span"
              fontFamily="display"
              fontSize="lg"
              fontWeight="bold"
              letterSpacing="wide"
              maxW="full"
              isTruncated
            >
              {file.name}
            </Text>
            <Text as="span" color="gray">
              {fileTypeNames[file.mimeType]}
            </Text>
          </Stack>
        </HStack>

        {onSelect && (
          <Button
            colorScheme="blue"
            h={10}
            onClick={() => onSelect(file.platformGuildId)}
          >
            Gate file
          </Button>
        )}

        {onCancel && (
          <Button h={10} onClick={onCancel}>
            Cancel
          </Button>
        )}
      </Stack>
    </Card>
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
      <Skeleton h={10} borderRadius="xl" w="full" />
    </Stack>
  </Card>
)

export default GoogleDocCard
export { GoogleSkeletonCard }
