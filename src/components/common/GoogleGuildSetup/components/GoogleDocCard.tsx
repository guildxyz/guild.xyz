import { HStack, Img, Stack, Text } from "@chakra-ui/react"
import Button from "components/common/Button"
import Card from "components/common/Card"
import { GoogleFile } from "types"

type Props = {
  file: GoogleFile
  isLoading: boolean
  loadingText: string
  onSelect: (platformGuildId: string) => void
}

const GoogleDocCard = ({
  file,
  isLoading,
  loadingText,
  onSelect,
}: Props): JSX.Element => (
  <Card px={{ base: 5, sm: 6 }} py="7">
    <Stack w="full" spacing={4}>
      <HStack>
        <Img
          src={file.iconLink?.replace("/16", "/32")}
          alt={file.mimeType}
          boxSize={6}
        />
        <Text
          as="span"
          fontFamily="display"
          fontSize="xl"
          fontWeight="bold"
          letterSpacing="wide"
          maxW="full"
          isTruncated
        >
          {file.name}
        </Text>
      </HStack>

      <Button
        isDisabled={isLoading}
        isLoading={isLoading}
        loadingText={loadingText}
        onClick={() => onSelect(file.platformGuildId)}
      >
        Gate file
      </Button>
    </Stack>
  </Card>
)

export default GoogleDocCard
