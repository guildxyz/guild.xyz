import {
  FormControl,
  FormLabel,
  HStack,
  Icon,
  Input,
  Text,
  Tooltip,
} from "@chakra-ui/react"
import { AddGatherFormType } from "components/[guild]/RolePlatforms/components/AddRoleRewardModal/components/AddGatherPanel"
import { SectionTitle } from "components/common/Section"
import { Question } from "phosphor-react"
import { useFormContext } from "react-hook-form"

const GatherGuestForm = () => {
  const { register } = useFormContext<AddGatherFormType>()

  return (
    <>
      <SectionTitle title={"Guest parameters"} mb={1}></SectionTitle>
      <Text colorScheme="gray" fontWeight="semibold" mb="8">
        Customize the parameters for guests who gained access to your space via this
        reward.
      </Text>
      <FormControl>
        <HStack mb={2} spacing={0}>
          <FormLabel mb={0}>Affiliation:</FormLabel>
          <Tooltip
            label="Displays information below the person's name in the user info card available from the Participants list"
            placement="top"
            hasArrow
          >
            <Icon as={Question} color="GrayText" />
          </Tooltip>
        </HStack>
        <Input {...register("gatherAffiliation")} placeholder="Optional" />
      </FormControl>

      <FormControl>
        <HStack mt={6} mb={2} spacing={0}>
          <FormLabel mb={0}>Role:</FormLabel>
          <Tooltip
            label="Describes the person's role in your space. This field is for your internal use only and does not actually assign a user role"
            placement="top"
            hasArrow
          >
            <Icon as={Question} color="GrayText" />
          </Tooltip>
        </HStack>
        <Input {...register("gatherRole")} placeholder="Optional" />
      </FormControl>
    </>
  )
}

export default GatherGuestForm
