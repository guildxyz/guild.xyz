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
import { LayoutGroup, Reorder, motion } from "framer-motion"
import { useFieldArray, useFormContext } from "react-hook-form"
import getFieldIndexesToSwap from "utils/getFieldsToSwap"
import { CreateFormParams } from "../schemas"
import FormCardEditable from "./FormCardEditable"

const MotionText = motion(Text)
const MotionAddCard = motion(AddCard)

const CreateFormForm = () => {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext<CreateFormParams>()

  const { fields, append, remove, swap } = useFieldArray({
    control,
    name: "fields",
  })

  const onReorder = (newOrder: string[]) => {
    const originalOrder = fields.map((field) => field.id)
    const [indexA, indexB] = getFieldIndexesToSwap(originalOrder, newOrder)
    swap(indexA, indexB)
  }

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
        <LayoutGroup>
          <MotionText layout as="span">
            Add questions
          </MotionText>

          <Reorder.Group
            axis="y"
            values={fields.map((field) => field.id)}
            onReorder={onReorder}
          >
            {fields.map((field, index) => (
              <FormCardEditable
                key={field.id}
                fieldId={field.id}
                index={index}
                onRemove={() => remove(index)}
              />
            ))}
          </Reorder.Group>

          <MotionAddCard
            layout
            title="Add question"
            onClick={() =>
              append({
                type: "SHORT_TEXT",
              })
            }
          />
        </LayoutGroup>
        <FormErrorMessage>{errors.fields?.message}</FormErrorMessage>
      </Stack>
    </Stack>
  )
}
export default CreateFormForm
