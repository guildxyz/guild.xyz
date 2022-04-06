import { Flex, Img, Stack, Text } from "@chakra-ui/react"
import Button from "components/common/Button"
import Card from "components/common/Card"

type Props = {
  serverData: { id: number; name: string; image: string }
  onSelect?: (id: number) => void
  onCancel?: () => void
}

const DCServerCard = ({ serverData, onSelect, onCancel }: Props): JSX.Element => (
  <Card position="relative">
    <Img
      position="absolute"
      inset={0}
      w="full"
      src={serverData.image}
      alt={serverData.name}
      filter="blur(10px)"
      transform="scale(1.25)"
      opacity={0.5}
    />

    <Stack position="relative" direction="column" spacing={0}>
      <Flex py={8} alignItems="center" justifyContent="center">
        <Img
          src={serverData.image}
          alt={serverData.name}
          borderRadius="full"
          boxSize={28}
        />
      </Flex>

      <Stack
        maxW="full"
        direction="row"
        px={{ base: 5, sm: 6 }}
        pb={{ base: 5, sm: 6 }}
        justifyContent="space-between"
        alignItems="center"
        spacing={4}
      >
        <Text
          as="span"
          isTruncated
          fontFamily="display"
          fontSize="xl"
          fontWeight="bold"
          letterSpacing="wide"
        >
          {serverData.name}
        </Text>
        {onSelect && (
          <Button
            h={10}
            colorScheme="DISCORD"
            onClick={() => onSelect(serverData.id)}
          >
            Setup
          </Button>
        )}
        {!onSelect && onCancel && (
          <Button h={10} onClick={onCancel}>
            Cancel
          </Button>
        )}
      </Stack>
    </Stack>
  </Card>
)

export default DCServerCard
