import { FormControl, HStack, Input, Stack, Text } from "@chakra-ui/react"
import Button from "components/common/Button"
import MotionWrapper from "components/common/CardMotionWrapper"
import FormErrorMessage from "components/common/FormErrorMessage"
import { AnimatePresence, AnimateSharedLayout, Reorder } from "framer-motion"
import { useEffect, useRef } from "react"
import { useFieldArray, useFormContext, useWatch } from "react-hook-form"
import getFieldIndexesToSwap from "utils/getFieldsToSwap"
import { CreateFormParams } from "../../schemas"
import OptionLayout from "./OptionLayout"
import RemoveButton from "./RemoveButton"

type Props = {
  index: number
}

const ChoiceSetup = ({ index }: Props) => {
  const {
    control,
    register,
    setValue,
    formState: { errors },
  } = useFormContext<CreateFormParams>()
  const type = useWatch({ name: `fields.${index}.type` })
  const { fields, append, remove, swap } = useFieldArray({
    control,
    name: `fields.${index}.options`,
  })

  // TODO: try to find a better solution for default value
  useEffect(() => {
    if (fields.length > 0) return
    append({
      value: "Option 1",
    })
  }, [])

  const addOptionRef = useRef<HTMLInputElement>(null)

  const allowOther = useWatch({
    name: `fields.${index}.allowOther`,
  })

  const onReorder = (newOrder: string[]) => {
    const originalOrder = fields.map((field) => field.id)
    const [indexA, indexB] = getFieldIndexesToSwap(originalOrder, newOrder)
    swap(indexA, indexB)
  }

  return (
    <AnimateSharedLayout>
      <Reorder.Group
        axis="y"
        values={fields.map((field) => field.id)}
        onReorder={onReorder}
      >
        <AnimatePresence>
          {fields.map((field, optionIndex) => (
            <OptionLayout
              key={field.id}
              fieldId={field.id}
              type={type}
              action={
                fields.length > 0 && (
                  <RemoveButton onClick={() => remove(optionIndex)} />
                )
              }
              draggable
            >
              <FormControl>
                <Input
                  {...register(`fields.${index}.options.${optionIndex}.value`)}
                  placeholder={"Add option" + field.id}
                />
                <FormErrorMessage>
                  {/* TODO: proper types */}
                  {
                    (errors.fields?.[index] as any)?.options?.[optionIndex]?.value
                      ?.message
                  }
                </FormErrorMessage>
              </FormControl>
            </OptionLayout>
          ))}
        </AnimatePresence>
      </Reorder.Group>

      <MotionWrapper>
        <Stack mt={-2}>
          <AnimatePresence>
            <OptionLayout
              key="addOption"
              type={type}
              action={
                !allowOther && (
                  <HStack spacing={1} pl={1}>
                    <Text
                      as="span"
                      fontWeight="bold"
                      fontSize="xs"
                      textTransform="uppercase"
                      colorScheme="gray"
                    >
                      OR
                    </Text>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setValue(`fields.${index}.allowOther`, true)}
                    >
                      Add "Other"...
                    </Button>
                  </HStack>
                )
              }
            >
              <Input
                ref={addOptionRef}
                placeholder="Add option"
                onChange={(e) => {
                  if (!fields.every((field) => !!field.value)) return
                  append({
                    value: e.target.value,
                  })
                  addOptionRef.current.value = ""
                }}
              />
            </OptionLayout>

            {allowOther && (
              <OptionLayout
                key="addOther"
                type={type}
                action={
                  <RemoveButton
                    onClick={() => setValue(`fields.${index}.allowOther`, false)}
                  />
                }
                mt={-2}
              >
                <Input placeholder="Other..." isDisabled />
              </OptionLayout>
            )}
          </AnimatePresence>
        </Stack>
      </MotionWrapper>
    </AnimateSharedLayout>
  )
}

export default ChoiceSetup
