import {
  Box,
  FormControl,
  HStack,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Link,
  Stack,
  Text,
} from "@chakra-ui/react"
import Button from "components/common/Button"
import StyledSelect from "components/common/StyledSelect"
import { ArrowSquareOut, Plus, TrashSimple } from "phosphor-react"
import { Controller, useFieldArray, useFormContext } from "react-hook-form"
import { GuildFormType, SelectOption } from "types"

const contactTypeOptions: SelectOption[] = [
  { value: "EMAIL", label: "E-mail" },
  { value: "TELEGRAM", label: "Telegram" },
]

type Props = {
  showAddButton?: boolean
}

const ContactInfo = ({ showAddButton = true }: Props): JSX.Element => {
  const {
    control,
    register,
    getValues,
    formState: { errors },
  } = useFormContext<GuildFormType>()

  const { fields, append, remove } = useFieldArray({
    control,
    name: "contacts",
    keyName: "formId",
  })

  return (
    <>
      <Text colorScheme="gray">
        Only visible to the Guild Team to reach you with support and partnership
        initiatives if needed.{" "}
      </Text>
      <Stack maxW={{ base: "full", sm: "md" }}>
        {fields.map((contactField, index) => (
          <FormControl
            key={contactField.formId}
            isInvalid={!!errors?.contacts?.[index]}
          >
            <HStack>
              <Box maxW="64">
                <Controller
                  control={control}
                  name={`contacts.${index}.type`}
                  render={({ field: { onChange, onBlur, value, ref } }) => (
                    <StyledSelect
                      ref={ref}
                      options={contactTypeOptions}
                      value={contactTypeOptions.find((ct) => ct.value === value)}
                      onBlur={onBlur}
                      onChange={(newValue: SelectOption) => onChange(newValue.value)}
                      size="lg"
                    />
                  )}
                />
              </Box>
              <InputGroup size="lg">
                <Input
                  isInvalid={!!errors?.contacts?.[index]}
                  placeholder={
                    getValues(`contacts.${index}.type`) === "EMAIL"
                      ? `E-mail address`
                      : "Phone / Telegram username"
                  }
                  {...register(`contacts.${index}.contact`, {
                    required:
                      getValues("contacts")?.length > 1 &&
                      index >= getValues("contacts")?.length - 1
                        ? "This field is required"
                        : false,
                  })}
                />
                {fields?.length > 1 && (
                  <InputRightElement>
                    <IconButton
                      variant="ghost"
                      icon={<Icon as={TrashSimple} />}
                      size="xs"
                      rounded="full"
                      aria-label="Remove contact"
                      onClick={() => remove(index)}
                    />
                  </InputRightElement>
                )}
              </InputGroup>
            </HStack>
          </FormControl>
        ))}

        {showAddButton && (
          <Button
            leftIcon={<Icon as={Plus} />}
            onClick={() =>
              append({
                type: "EMAIL",
                contact: "",
              })
            }
            data-dd-action-name="Add contact"
          >
            Add contact
          </Button>
        )}

        {!showAddButton && (
          <Text fontSize="sm" colorScheme="gray">
            Or{" "}
            <Link isExternal href="https://discord.gg/guildxyz">
              <Text as="span">join our Discord</Text>
              <Icon ml={1} as={ArrowSquareOut} />
            </Link>
          </Text>
        )}
      </Stack>
    </>
  )
}

export default ContactInfo
