import { Divider, Text } from "@chakra-ui/react"
import GatherConnectionForm from "./GatherConnectionForm"
import GatherGuestForm from "./GatherGuestForm"

const GatherForm = () => {
  return (
    <>
      <Text colorScheme="gray" fontWeight="semibold" mb="8">
        The email addresses of eligible users will be added to the guest list for the
        Gather space, which you can specify below.
      </Text>

      <GatherConnectionForm />
      <Divider my={6}></Divider>
      <GatherGuestForm />
    </>
  )
}

export default GatherForm
