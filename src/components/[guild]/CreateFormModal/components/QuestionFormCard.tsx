import {
  FormControl,
  FormLabel,
  GridItem,
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  SimpleGrid,
  Stack,
  Switch,
} from "@chakra-ui/react"
import Card from "components/common/Card"
import ControlledSelect from "components/common/ControlledSelect"
import FormErrorMessage from "components/common/FormErrorMessage"
import OptionIcon from "components/common/StyledSelect/components/CustomSelectOption/components/OptionIcon"
import {
  CheckSquare,
  NumberCircleFive,
  NumberSquareFive,
  RadioButton,
  Textbox,
  Trash,
} from "phosphor-react"
import { useController, useFormContext, useWatch } from "react-hook-form"
import { SelectOption } from "types"
import { CreateFormParams, Field } from "../schemas"

type Props = {
  index: number
  onRemove: () => void
}

const fieldTypes: SelectOption<Field["type"]>[] = [
  {
    label: "Short text",
    value: "SHORT_TEXT",
    img: <OptionIcon as={Textbox} />,
  },
  {
    label: "Long text",
    value: "LONG_TEXT",
    img: <OptionIcon as={Textbox} />,
  },
  {
    label: "Number",
    value: "NUMBER",
    img: <OptionIcon as={NumberSquareFive} />,
  },
  {
    label: "Single choice",
    value: "SINGLE_CHOICE",
    img: <OptionIcon as={RadioButton} />,
  },
  {
    label: "Multiple choice",
    value: "MULTIPLE_CHOICE",
    img: <OptionIcon as={CheckSquare} />,
  },
  {
    label: "Rate",
    value: "RATE",
    img: <OptionIcon as={NumberCircleFive} />,
  },
]

/** TODO: a Record which contains a "subform" for each field type */

const QuestionFormCard = ({ index, onRemove }: Props) => {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext<CreateFormParams>()
  const type = useWatch({ control, name: `fields.${index}.type` })
  const selectedFieldType = fieldTypes.find((ft) => ft.value === type)

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

  return (
    <Card px={{ base: 5, md: 6 }} py={{ base: 6, md: 7 }}>
      <Stack spacing={4}>
        <SimpleGrid columns={3} gap={2}>
          <GridItem colSpan={{ base: 3, md: 2 }}>
            <FormControl isInvalid={!!errors.fields?.[index]?.question}>
              <Input
                {...register(`fields.${index}.question`)}
                placeholder="Question"
              />
              <FormErrorMessage>
                {errors.fields?.[index]?.question?.message}
              </FormErrorMessage>
            </FormControl>
          </GridItem>
          <GridItem colSpan={{ base: 3, md: 1 }}>
            <FormControl>
              <InputGroup>
                <InputLeftElement>{selectedFieldType?.img}</InputLeftElement>
                <ControlledSelect
                  name={`fields.${index}.type`}
                  options={fieldTypes}
                />
              </InputGroup>
            </FormControl>
          </GridItem>

          <GridItem colSpan={3}>
            <Input isDisabled placeholder={selectedFieldType?.label} />
          </GridItem>
        </SimpleGrid>

        <HStack ml="auto">
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
        </HStack>
      </Stack>
    </Card>
  )
}

export default QuestionFormCard
