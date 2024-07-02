import { Divider, Text } from "@chakra-ui/react"
import GatherConnectionForm from "./GatherConnectionForm"
import GatherGuestForm from "./GatherGuestForm"

const GatherForm = () => (
  <>
    <Text colorScheme="gray" fontWeight="semibold" mb="8">
      The email addresses of eligible users will be added to the guest list for the
      Gather space, which you can specify below.
    </Text>

    <Text fontWeight={"bold"} mb="4">
      Setup space
    </Text>
    <GatherConnectionForm />

    <Divider mt={8} mb={6} />

    <Text fontWeight={"bold"}>Guest parameters</Text>
    <Text colorScheme="gray" mb="6">
      Customize the parameters for guests who gained access to your space via this
      reward
    </Text>
    <GatherGuestForm />
  </>
)

export default GatherForm
