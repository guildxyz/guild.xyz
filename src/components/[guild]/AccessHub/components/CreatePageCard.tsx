import {} from "@/components/ui/Alert"
import {
  Circle,
  HStack,
  Icon,
  Text,
  VStack,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react"
import { FolderSimplePlus } from "@phosphor-icons/react"
import { Plus } from "@phosphor-icons/react/dist/ssr"
import CreateCampaignModal from "components/[guild]/CreateCampaignModal"
import Button from "components/common/Button"
import ColorCard from "components/common/ColorCard"
import ColorCardLabel from "components/common/ColorCard/ColorCardLabel"

const CreatePageCard = () => {
  const imageBgColor = useColorModeValue("gray.700", "gray.600")
  const { isOpen, onClose } = useDisclosure()

  return (
    <ColorCard
      color="gray.500"
      display="flex"
      flexDir="column"
      justifyContent="space-between"
      pt={{ base: 10, sm: 11 }}
      borderStyle="dashed"
    >
      <HStack spacing={3} minHeight={10} mb={5}>
        <Circle
          borderRadius="full"
          size={10}
          flexShrink={0}
          position="relative"
          bgColor={imageBgColor}
          color="white"
        >
          <Icon as={FolderSimplePlus} boxSize={5} />
        </Circle>
        <VStack alignItems="start" spacing={0}>
          <Text fontWeight="bold">Create page</Text>
          <Text colorScheme="gray" fontSize="sm">
            Group roles on a separate page
          </Text>
        </VStack>
      </HStack>

      <Button leftIcon={<Plus />} variant="outline">
        Create page
      </Button>

      <ColorCardLabel
        fallbackColor="white"
        backgroundColor="gray.500"
        label="New page"
        top="-2px"
        left="-2px"
        borderBottomRightRadius="xl"
        borderTopLeftRadius="2xl"
      />

      <CreateCampaignModal isOpen={isOpen} onClose={onClose} />
    </ColorCard>
  )
}

export { CreatePageCard }
