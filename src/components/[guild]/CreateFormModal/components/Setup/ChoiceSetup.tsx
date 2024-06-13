import { FormControl, HStack, Input, Stack, Text } from "@chakra-ui/react"
import { CreateForm } from "components/[guild]/RolePlatforms/components/AddRoleRewardModal/components/AddFormPanel"
import Button from "components/common/Button"
import FormErrorMessage from "components/common/FormErrorMessage"
import { AnimatePresence, LayoutGroup, Reorder } from "framer-motion"
import { useRef } from "react"
import { useFieldArray, useFormContext, useWatch } from "react-hook-form"
import getFieldIndexesToSwap from "utils/getFieldsToSwap"
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
  } = useFormContext<CreateForm>()
  const type = useWatch({ name: `fields.${index}.type` })
  const { fields, append, remove, swap } = useFieldArray({
    control,
    name: `fields.${index}.options`,
  })

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
    <LayoutGroup>
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
                  {...register(
                    `fields.${index}.options.${optionIndex}.value` as const
                  )}
                  placeholder="Add option"
                />
                <FormErrorMessage>
                  {/* Unfortunately react-hook-form couldn't detect types properly here, so we needed an any cast */}
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

      <Stack as="ul" mt={-2}>
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
              className="addOption"
              onChange={(e) => {
                if (!fields.every((field) => !!field.value)) return
                append({
                  value: e.target.value,
                })
                // @ts-expect-error TODO: fix this error originating from strictNullChecks
                addOptionRef.current.value = ""
              }}
              bg="transparent"
              borderStyle="dashed"
              _focus={{ borderStyle: "solid" }}
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
    </LayoutGroup>
  )
}

export default ChoiceSetup
