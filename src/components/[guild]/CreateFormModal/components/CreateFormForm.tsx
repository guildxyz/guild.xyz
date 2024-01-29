import {
  FormControl,
  FormLabel,
  Input,
  Stack,
  Text,
  Textarea,
} from "@chakra-ui/react"
import AddCard from "components/common/AddCard"
import FormErrorMessage from "components/common/FormErrorMessage"
import { AnimateSharedLayout } from "framer-motion"
import { useFieldArray, useFormContext } from "react-hook-form"
import { CreateFormParams } from "../schemas"
import FormCardEditable from "./FormCardEditable"

const CreateFormForm = () => {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext<CreateFormParams>()

  const { fields, append, remove } = useFieldArray({
    control,
    name: "fields",
  })

  return (
    <Stack spacing={6}>
      <FormControl isInvalid={!!errors.name}>
        <FormLabel>Title</FormLabel>
        <Input
          {...register("name")}
          placeholder="What's the form about?"
          maxW="50%"
        />
        <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
      </FormControl>

      <FormControl>
        <FormLabel>Description</FormLabel>
        <Textarea {...register("description")} placeholder="Optional" />
      </FormControl>

      <Stack spacing={2}>
        <Text as="span">Add questions</Text>

        <AnimateSharedLayout>
          {fields.map((field, index) => (
            <FormCardEditable
              key={field.id}
              index={index}
              onRemove={() => remove(index)}
            />
          ))}
          <AddCard
            title="Add question"
            onClick={() =>
              append({
                type: "SHORT_TEXT",
              })
            }
          />
        </AnimateSharedLayout>
        <FormErrorMessage>{errors.fields?.message}</FormErrorMessage>
      </Stack>
    </Stack>
  )
}
export default CreateFormForm
