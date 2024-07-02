import {
  FormControl,
  FormHelperText,
  FormLabel,
  HStack,
  Input,
  SimpleGrid,
  Spacer,
  Tag,
} from "@chakra-ui/react"
import { AddGatherFormType } from "components/[guild]/RolePlatforms/components/AddRoleRewardModal/components/AddGatherPanel"
import Card from "components/common/Card"
import { useFormContext } from "react-hook-form"

const GatherGuestForm = () => {
  const { register } = useFormContext<AddGatherFormType>()

  return (
    <SimpleGrid gap="4" columns={{ md: 2 }}>
      <Card pt="4 !important" p="5" w="full">
        <FormControl h="full" display="flex" flexDir={"column"}>
          <HStack justifyContent={"space-between"}>
            <FormLabel mb="0">Affiliation</FormLabel>
            <Tag size="sm">Optional</Tag>
          </HStack>
          <FormHelperText mt="1.5" mb="5">
            Displays information below the person's name in the user info card
            available from the Participants list
          </FormHelperText>
          <Spacer />
          <Input {...register("gatherAffiliation")} />
        </FormControl>
      </Card>
      <Card pt="4 !important" p="5" w="full">
        <FormControl>
          <HStack justifyContent={"space-between"}>
            <FormLabel mb="0">Role</FormLabel>
            <Tag size="sm">Optional</Tag>
          </HStack>
          <FormHelperText mt="1.5" mb="5">
            Describes the person's role in your space. This field is for your
            internal use only and does not actually assign a user role
          </FormHelperText>
          <Input {...register("gatherRole")} />
        </FormControl>
      </Card>
    </SimpleGrid>
  )
}

export default GatherGuestForm
