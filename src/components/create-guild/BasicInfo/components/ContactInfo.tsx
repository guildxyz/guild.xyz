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
import { ArrowSquareOut, Plus, TrashSimple } from "@phosphor-icons/react"
import { CreateGuildFormType } from "app/create-guild/types"
import Button from "components/common/Button"
import ClientOnly from "components/common/ClientOnly"
import FormErrorMessage from "components/common/FormErrorMessage"
import StyledSelect from "components/common/StyledSelect"
import { Controller, useFieldArray, useFormContext } from "react-hook-form"
import { SelectOption } from "types"

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
    trigger,
    register,
    getValues,
    resetField,
    formState: { errors },
  } = useFormContext<CreateGuildFormType>()

  const { fields, append, remove } = useFieldArray({
    name: "contacts",
  })

  return (
    <Stack maxW={{ base: "full", sm: "md" }}>
      <ClientOnly>
        {fields.map((contactField, index) => (
          <HStack key={contactField.id} alignItems="start">
            <Box maxW="64">
              <Controller
                control={control}
                name={`contacts.${index}.type`}
                render={({ field: { onChange, onBlur, value, ref } }) => (
                  <StyledSelect
                    isDisabled={index === 0}
                    ref={ref}
                    options={contactTypeOptions}
                    value={contactTypeOptions.find((ct) => ct.value === value)}
                    onBlur={() => {
                      trigger()
                      onBlur()
                    }}
                    onChange={(newValue: SelectOption) => {
                      onChange(newValue.value)
                      resetField(`contacts.${index}.contact`)
                    }}
                    size="lg"
                    chakraStyles={{
                      container: (base) => ({
                        ...base,
                        minWidth: "max-content",
                      }),
                    }}
                  />
                )}
              />
            </Box>

            <FormControl isInvalid={!!errors?.contacts?.[index]?.contact}>
              <Stack spacing={0} w="100%">
                <InputGroup size="lg">
                  <Input
                    isInvalid={!!errors?.contacts?.[index]?.contact}
                    placeholder={
                      getValues(`contacts.${index}.type`) === "EMAIL"
                        ? `E-mail address`
                        : "Phone / Telegram username"
                    }
                    {...register(`contacts.${index}.contact`, {
                      required: "This field is required",
                      pattern:
                        getValues(`contacts.${index}.type`) === "EMAIL"
                          ? {
                              value: /\S+@\S+\.\S+/,
                              message: "Invalid e-mail format",
                            }
                          : undefined,
                    })}
                  />
                  {fields?.length > 1 && index !== 0 && (
                    <InputRightElement>
                      <IconButton
                        variant="ghost"
                        icon={<Icon as={TrashSimple} />}
                        size="xs"
                        rounded="full"
                        aria-label="Remove contact"
                        data-test="remove-contact-btn"
                        onClick={() => remove(index)}
                      />
                    </InputRightElement>
                  )}
                </InputGroup>

                <FormErrorMessage>
                  {errors?.contacts?.[index]?.contact?.message}
                </FormErrorMessage>
              </Stack>
            </FormControl>
          </HStack>
        ))}
      </ClientOnly>

      {showAddButton && (
        <Button
          id="add-contact-btn"
          variant="outline"
          borderStyle="dashed"
          leftIcon={<Icon as={Plus} />}
          onClick={() =>
            append({
              type: "EMAIL",
              contact: "",
            })
          }
        >
          Add contact
        </Button>
      )}

      {!showAddButton && (
        <Text fontSize="sm" colorScheme="gray">
          Or{" "}
          <Link isExternal href="https://discord.gg/KUkghUdk2G">
            <Text as="span">join our Discord</Text>
            <Icon ml={1} as={ArrowSquareOut} />
          </Link>
        </Text>
      )}
    </Stack>
  )
}

export default ContactInfo
