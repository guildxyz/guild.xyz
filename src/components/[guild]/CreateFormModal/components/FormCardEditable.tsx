import {
  Divider,
  FormControl,
  FormLabel,
  Grid,
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Stack,
  Switch,
  Text,
  useColorModeValue,
} from "@chakra-ui/react"
import Button from "components/common/Button"
import Card from "components/common/Card"
import MotionWrapper from "components/common/CardMotionWrapper"
import ControlledSelect from "components/common/ControlledSelect"
import FormErrorMessage from "components/common/FormErrorMessage"
import { Trash } from "phosphor-react"
import { useState } from "react"
import { useController, useFormContext, useWatch } from "react-hook-form"
import { fieldTypes } from "../formConfig"
import { CreateFormParams } from "../schemas"

type Props = {
  index: number
  onRemove: () => void
}

const FormCardEditable = ({ index, onRemove }: Props) => {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext<CreateFormParams>()
  const field = useWatch({ control, name: `fields.${index}` })
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

  const [isEditing, setIsEditing] = useState(true)

  /**
   * Dark color is from blackAlpha.300, but without opacity so it looks great when we
   * reorder the choice inputs
   */
  const inputBgColor = useColorModeValue("white", "#2E2E33")

  return (
    <MotionWrapper>
      <Card
        px={{ base: 5, md: 6 }}
        py={{ base: 6, md: 7 }}
        onClick={isEditing ? undefined : () => setIsEditing(true)}
        sx={{
          "input, textarea": {
            background: inputBgColor,
          },
        }}
      >
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
                <InputGroup
                  sx={{
                    input: {
                      background: "transparent",
                    },
                  }}
                >
                  <InputLeftElement>{selectedFieldType?.img}</InputLeftElement>
                  <ControlledSelect
                    name={`fields.${index}.type`}
                    options={fieldTypes}
                  />
                </InputGroup>
              </FormControl>
            </Grid>
          ) : (
            <Text as="span" fontWeight="semibold">
              {field?.question}
              {isRequiredValue && (
                <Text as="sup" color="red.400" ml={1}>
                  *
                </Text>
              )}
            </Text>
          )}

          {selectedFieldType?.SetupComponent && isEditing ? (
            <selectedFieldType.SetupComponent index={index} />
          ) : (
            <selectedFieldType.DisplayComponent field={field} isDisabled />
          )}

          {isEditing && (
            <HStack ml="auto" mt={2}>
              <FormControl display="flex" alignItems="center">
                <FormLabel
                  mb="0"
                  color="GrayText"
                  fontSize="sm"
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
                icon={<Trash />}
                rounded="full"
                boxSize={6}
                minW={6}
                minH={6}
                variant="unstyled"
                onClick={onRemove}
              />

              <Divider orientation="vertical" h={8} />
              <Button
                size="sm"
                colorScheme="green"
                minW="max-content"
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
    </MotionWrapper>
  )
}

export default FormCardEditable
