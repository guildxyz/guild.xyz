import {
  Divider,
  FormControl,
  FormLabel,
  Grid,
  HStack,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Stack,
  Switch,
} from "@chakra-ui/react"
import { CreateForm } from "components/[guild]/RolePlatforms/components/AddRoleRewardModal/components/AddFormPanel"
import Button from "components/common/Button"
import Card from "components/common/Card"
import CardMotionWrapper from "components/common/CardMotionWrapper"
import ControlledSelect from "components/common/ControlledSelect"
import FormErrorMessage from "components/common/FormErrorMessage"
import { Reorder, useDragControls } from "framer-motion"
import { DotsSixVertical, PencilSimple, Trash } from "phosphor-react"
import { useState } from "react"
import { useController, useFormContext, useWatch } from "react-hook-form"
import { fieldTypes } from "../../formConfig"
import FormFieldTitle from "./components/FormFieldTitle"

type Props = {
  index: number
  fieldId: string
  onRemove: () => void
}

const FormCardEditable = ({ index, fieldId, onRemove }: Props) => {
  const {
    control,
    register,
    resetField,
    formState: { errors },
  } = useFormContext<CreateForm>()
  const field = useWatch({ control, name: `fields.${index}` })
  const isEditForm = !!field?.id
  const selectedFieldType = fieldTypes.find((ft) => ft.value === field?.type)

  const {
    field: {
      value: isRequiredValue,
      onChange: onIsRequiredChange,
      ...isRequiredControl
    },
  } = useController({
    control,
    name: `fields.${index}.isRequired`,
  })

  const [isEditing, setIsEditing] = useState(!isEditForm)

  const dragControls = useDragControls()

  return (
    <Reorder.Item
      dragListener={false}
      dragControls={dragControls}
      value={fieldId}
      style={{
        position: "relative",
        marginBottom: "var(--chakra-sizes-2)",
      }}
    >
      <CardMotionWrapper>
        <Card p={{ base: 5, md: 6 }} userSelect="none">
          <Stack spacing={2}>
            {isEditing ? (
              <Grid templateColumns={{ base: "1fr", md: "2fr 1fr" }} gap={2}>
                <FormControl isInvalid={!!errors.fields?.[index]?.question}>
                  <Input
                    {...register(`fields.${index}.question`)}
                    placeholder="Question"
                  />
                  <FormErrorMessage>
                    {errors.fields?.[index]?.question?.message}
                  </FormErrorMessage>
                </FormControl>
                <FormControl>
                  <InputGroup>
                    <InputLeftElement>{selectedFieldType.img}</InputLeftElement>
                    <ControlledSelect
                      isDisabled={isEditForm}
                      name={`fields.${index}.type`}
                      options={fieldTypes}
                      beforeOnChange={() => {
                        resetField(`fields.${index}`, {
                          defaultValue: {
                            type: field.type,
                            question: field.question,
                            allowOther: false,
                            bestLabel: "",
                            worstLabel: "",
                            isRequired: false,
                            options: [],
                          },
                        })
                      }}
                    />
                  </InputGroup>
                </FormControl>
              </Grid>
            ) : (
              <HStack justifyContent="space-between" mt="-0.5">
                <HStack>
                  <FormFieldTitle field={field} />
                  <IconButton
                    aria-label="Edit field"
                    size="sm"
                    my="-2"
                    variant="unstyled"
                    color="GrayText"
                    _hover={{
                      color: "var(--chakra-colors-chakra-body-text)",
                    }}
                    _focusVisible={{
                      color: "var(--chakra-colors-chakra-body-text)",
                    }}
                    icon={<PencilSimple />}
                    onClick={() => setIsEditing(true)}
                  />
                </HStack>
                <Icon
                  as={DotsSixVertical}
                  boxSize={"18px"}
                  cursor="grab"
                  onPointerDown={(e) => dragControls.start(e)}
                />
              </HStack>
            )}
            {selectedFieldType.SetupComponent && isEditing ? (
              <selectedFieldType.SetupComponent index={index} />
            ) : (
              <selectedFieldType.DisplayComponent field={field} isDisabled />
            )}
            {isEditing && (
              <HStack ml="auto" mt={4} spacing={3}>
                <FormControl display="flex" alignItems="center">
                  <FormLabel
                    mb="0"
                    mr="2"
                    color="GrayText"
                    fontSize="xs"
                    fontWeight="bold"
                    textTransform="uppercase"
                  >
                    Required
                  </FormLabel>
                  <Switch
                    colorScheme="indigo"
                    {...isRequiredControl}
                    isChecked={isRequiredValue}
                    onChange={(e) => onIsRequiredChange(e.target.checked)}
                  />
                </FormControl>
                <IconButton
                  aria-label="Remove"
                  icon={<Icon as={Trash} boxSize="4" />}
                  rounded="full"
                  size="sm"
                  variant="ghost"
                  onClick={onRemove}
                />
                <Divider orientation="vertical" h={8} />
                <Button
                  size="sm"
                  colorScheme="green"
                  flexShrink={0}
                  rounded="lg"
                  isDisabled={!!errors.fields?.[index] || !field?.question}
                  onClick={() => setIsEditing(false)}
                >
                  Done
                </Button>
              </HStack>
            )}
          </Stack>
        </Card>
      </CardMotionWrapper>
    </Reorder.Item>
  )
}

export default FormCardEditable
