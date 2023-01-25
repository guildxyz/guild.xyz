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

const ContactInfo = (): JSX.Element => {
  const { control, register, getValues } = useFormContext<GuildFormType>()

  const { fields, append, remove } = useFieldArray({
    control,
    name: "contacts",
    keyName: "formId",
  })

  return (
    <>
      <Text fontSize="sm" colorScheme="gray">
        This contact information is only visible for the Guild Team to reach you with
        support and partnership initiatives if needed.{" "}
      </Text>
      <Stack maxW={{ base: "full", sm: "md" }}>
        {fields.map((contactField, index) => (
          <FormControl key={contactField.formId}>
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
                    />
                  )}
                />
              </Box>
              <InputGroup>
                <Input
                  placeholder={
                    getValues(`contacts.${index}.type`) === "EMAIL"
                      ? `E-mail address`
                      : "Phone / Telegram username"
                  }
                  {...register(`contacts.${index}.contact`)}
                />
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
              </InputGroup>
            </HStack>
          </FormControl>
        ))}

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

        <Text fontSize="sm" colorScheme="gray">
          Or{" "}
          <Link isExternal href="https://discord.gg/guildxyz">
            <Text as="span">join our Discord</Text>
            <Icon ml={1} as={ArrowSquareOut} />
          </Link>
        </Text>
      </Stack>
    </>
  )
}

export default ContactInfo
