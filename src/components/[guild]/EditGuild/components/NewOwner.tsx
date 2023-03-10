import {
  Button,
  FormControl,
  FormLabel,
  HStack,
  Icon,
  Input,
  Stack,
  Text,
} from "@chakra-ui/react"
import { Warning } from "phosphor-react"

const NewOwner = () => (
  <>
    <FormControl w="full">
      <HStack>
        <FormLabel mb="0">Hand over owner role</FormLabel>
      </HStack>
      <Text colorScheme="gray" mb={2}>
        You will lose your ownership and become an admin{" "}
      </Text>
      <Stack direction={["column", "row"]} spacing={4} alignItems="center">
        <Input type="url" placeholder="new owner" />
        <Button
          // isDisabled="true"
          px="64px"
          as="label"
          variant="outline"
          leftIcon={<Icon as={Warning} color="red" />}
          fontWeight="medium"
        >
          Hand over ownership
        </Button>
      </Stack>
    </FormControl>
  </>
)

export default NewOwner
