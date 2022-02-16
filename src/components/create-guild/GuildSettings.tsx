import { Checkbox, FormControl, Text, VStack } from "@chakra-ui/react"
import Card from "components/common/Card"
import { useFormContext } from "react-hook-form"

const GuildSettings = (): JSX.Element => {
  const { register } = useFormContext()

  return (
    <Card px={{ base: 5, sm: 6 }} py={7}>
      <FormControl>
        <Checkbox
          {...register("showMembers")}
          colorScheme="indigo"
          alignItems="start"
        >
          <VStack alignItems="start" spacing={0.5} position="relative" top={-1}>
            <Text as="span" fontWeight="bold">
              Show members
            </Text>
            <Text as="span" fontSize="sm" color="gray">
              Show members list on the guild page
            </Text>
          </VStack>
        </Checkbox>
      </FormControl>
    </Card>
  )
}

export default GuildSettings
