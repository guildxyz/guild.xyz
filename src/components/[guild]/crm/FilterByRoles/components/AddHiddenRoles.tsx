import { Box, Button, Checkbox, HStack, Text } from "@chakra-ui/react"
import { Plus } from "phosphor-react"

const AddHiddenRoles = () => (
  <HStack alignItems={"start"}>
    <Checkbox isDisabled mt="0.5" />
    <Box>
      <Text fontSize="sm" fontWeight={"semibold"} mb="1">
        Private roles
      </Text>
      <Text colorScheme="gray" fontSize="sm" mb="2.5">
        Get to know your community by segmenting members with private roles
      </Text>
      <Button leftIcon={<Plus />} size="sm" w="full">
        Create new
      </Button>
    </Box>
  </HStack>
)

export default AddHiddenRoles
