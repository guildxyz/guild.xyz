import { FormControl, HStack, Text } from "@chakra-ui/react"
import Switch from "components/common/Switch"
import { useFormContext } from "react-hook-form"

const TagManager = (): JSX.Element => {
  const { register } = useFormContext()

  return (
    <FormControl>
      <Text colorScheme="gray" pb={4}>
        You can manage the guild tags here
      </Text>
      <HStack gap={7}>
        <Switch {...register("featured")} title="Featured" />
        <Switch {...register("verfied")} title="Verified" />
      </HStack>
    </FormControl>
  )
}

export default TagManager
