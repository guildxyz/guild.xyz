import { Flex, Img, Stack, Text } from "@chakra-ui/react"
import Button from "components/common/Button"
import Card from "components/common/Card"

type Props = {
  serverData: { value: string; label: string; img: string }
  onSelect?: (id: string) => void
  onCancel?: () => void
}

const DCServerCard = ({ serverData, onSelect, onCancel }: Props): JSX.Element => {
  const image =
    serverData?.img?.length > 0 ? serverData.img : "/default_discord_icon.png"

  return (
    <Card position="relative">
      <Img
        position="absolute"
        inset={0}
        w="full"
        src={image}
        alt={serverData.label}
        filter="blur(10px)"
        transform="scale(1.25)"
        opacity={0.5}
      />

      <Stack position="relative" direction="column" spacing={0}>
        <Flex py={8} alignItems="center" justifyContent="center">
          <Img src={image} alt={serverData.label} borderRadius="full" boxSize={28} />
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
            {serverData.label}
          </Text>
          {onSelect && (
            <Button
              h={10}
              colorScheme="DISCORD"
              onClick={() => onSelect(serverData.value)}
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
}

export default DCServerCard
