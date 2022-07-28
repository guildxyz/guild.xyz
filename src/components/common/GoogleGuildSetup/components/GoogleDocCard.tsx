import {
  Circle,
  HStack,
  Img,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react"
import Button from "components/common/Button"
import Card from "components/common/Card"
import { fileTypeNames } from "components/[guild]/RolePlatforms/components/PlatformCard/components/GoogleCard"
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
      <Stack w="full" spacing={4}>
        <HStack>
          <Circle size={10} bgColor={imageBgColor}>
            <Img src={file.iconLink} alt={file.mimeType} />
          </Circle>
          <Stack spacing={0}>
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

export default GoogleDocCard
