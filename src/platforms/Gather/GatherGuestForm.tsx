import {
  FormControl,
  HStack,
  Icon,
  Input,
  Stack,
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
      <FormControl>
        <SectionTitle title={"Guest parameters"} mb={1}></SectionTitle>
        <Text colorScheme="gray" fontWeight="semibold" mb="8">
          Customize the parameters for guests who gained access to your space via
          this reward.
        </Text>
        <Stack gap={6}>
          <Stack>
            <HStack>
              <Text as="span">Affiliation:</Text>
              <Tooltip
                label="Displays information below the person's name in the user info card available from the Participants list"
                placement="top"
                hasArrow
              >
                <Icon as={Question} color="GrayText" />
              </Tooltip>
            </HStack>
            <Input {...register("gatherAffiliation")} placeholder="Optional" />
          </Stack>

          <Stack>
            <HStack>
              <Text as="span">Role:</Text>
              <Tooltip
                label="Describes the person's role in your space. This field is for your internal use only and does not actually assign a user role"
                placement="top"
                hasArrow
              >
                <Icon as={Question} color="GrayText" />
              </Tooltip>
            </HStack>
            <Input {...register("gatherRole")} placeholder="Optional" />
          </Stack>
        </Stack>
      </FormControl>
    </>
  )
}

export default GatherGuestForm
