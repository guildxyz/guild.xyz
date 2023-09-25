import { FormControl, FormLabel, Stack, Textarea } from "@chakra-ui/react"
import Button from "components/common/Button"
import { useFormContext, useWatch } from "react-hook-form"

type Props = {
  onSuccess: () => void
}

const AddTextPanel = ({ onSuccess }: Props) => {
  const { register } = useFormContext()

  const text = useWatch({ name: "rolePlatforms.0.text" })

  return (
    <Stack>
      <FormControl>
        <FormLabel>Text:</FormLabel>

        <Textarea
          {...register("rolePlatforms.0.text", {
            required: "This field is required",
          })}
          minH={64}
          placeholder="Type or paste here the text which you'd like to send as reward to your users..."
        />
      </FormControl>

      <Button
        colorScheme="indigo"
        isDisabled={!text?.length}
        w="max-content"
        ml="auto"
        onClick={onSuccess}
      >
        Continue
      </Button>
    </Stack>
  )
}
export default AddTextPanel
