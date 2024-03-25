import {
  Checkbox,
  FormControl,
  FormLabel,
  Stack,
  Text,
  Textarea,
} from "@chakra-ui/react"
import { isValidAddress } from "components/[guild]/EditGuild/components/Admins/Admins"
import Button from "components/common/Button"
import ControlledSelect from "components/common/ControlledSelect"
import FormErrorMessage from "components/common/FormErrorMessage"
import { StyledSelectProps } from "components/common/StyledSelect/StyledSelect"
import useDropzone from "hooks/useDropzone"
import { useRouter } from "next/router"
import { File } from "phosphor-react"
import { Controller, useFormContext, useWatch } from "react-hook-form"
import { RequirementFormProps } from "requirements"
import parseFromObject from "utils/parseFromObject"
import { z } from "zod"

function validateEmailAllowlist(toValidate: string[]) {
  if (!toValidate) return

  const containsEmpty = toValidate.some((address) => address === "")

  if (containsEmpty) {
    return "Field contains empty line"
  }

  const invalidEmails = toValidate.filter(
    (address) => !z.string().email().safeParse(address).success
  )

  if (invalidEmails.length > 0) {
    return `Field contains invalid email address: ${invalidEmails[0]}`
  }
}

const allowListTypeOptions = [
  {
    label: "EVM and Fuel addresses",
    value: "ALLOWLIST",
  },
  {
    label: "Email addresses",
    value: "ALLOWLIST_EMAIL",
  },
] satisfies StyledSelectProps["options"]

const AllowlistForm = ({
  baseFieldPath,
  field,
}: RequirementFormProps): JSX.Element => {
  const {
    setValue,
    formState: { errors },
    control,
    register,
    resetField,
  } = useFormContext()
  const router = useRouter()

  const isHidden = useWatch({ name: `${baseFieldPath}.data.hideAllowlist` })
  const isEditMode = !!field?.id

  const { isDragActive, fileRejections, getRootProps, getInputProps } = useDropzone({
    multiple: false,
    accept: { "text/*": [".csv", ".txt"] },
    onDrop: (accepted) => {
      if (accepted.length > 0) parseFile(accepted[0])
    },
  })

  const type = useWatch({ name: `${baseFieldPath}.type` })

  const parseFile = (file: File) => {
    const fileReader = new FileReader()

    fileReader.onload = () => {
      const lines = fileReader.result
        ?.toString()
        ?.split("\n")
        ?.filter((line) => !!line)
        ?.map((line) => line.trim())

      setValue(`${baseFieldPath}.data.addresses`, lines, { shouldValidate: true })
    }

    fileReader.readAsText(file)
  }

  const resetFields = () => {
    resetField(`${baseFieldPath}.data.addresses`, { defaultValue: [] })
  }

  return (
    <Stack spacing={4} alignItems="start" {...getRootProps()}>
      <FormControl
        isInvalid={!!parseFromObject(errors, baseFieldPath)?.type?.message}
      >
        <FormLabel>Type</FormLabel>

        <ControlledSelect
          name={`${baseFieldPath}.type`}
          defaultValue={"ALLOWLIST"}
          options={allowListTypeOptions}
          beforeOnChange={resetFields}
          isDisabled={isEditMode}
        />

        <FormErrorMessage>
          {parseFromObject(errors, baseFieldPath)?.type?.message}
        </FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={!!fileRejections?.[0]} textAlign="left">
        <FormLabel>Upload from file</FormLabel>

        <Button as="label" leftIcon={<File />} h={10} maxW={56} cursor="pointer">
          <input {...getInputProps()} hidden />
          <Text as="span" display="block" maxW={44} noOfLines={1}>
            {isDragActive ? "Drop the file here" : "Choose .txt/.csv"}
          </Text>
        </Button>

        <FormErrorMessage>
          {fileRejections?.[0]?.errors?.[0]?.message}
        </FormErrorMessage>
      </FormControl>

      <FormControl
        isInvalid={!!parseFromObject(errors, baseFieldPath)?.data?.addresses}
      >
        <Controller
          control={control}
          name={`${baseFieldPath}.data.addresses` as const}
          rules={{
            validate:
              type === "ALLOWLIST_EMAIL"
                ? validateEmailAllowlist
                : (value_) => {
                    if (!value_) return

                    const validAddresses = value_.filter(
                      (address) => address !== "" && isValidAddress(address)
                    )
                    // for useBalancy
                    setValue(`${baseFieldPath}.data.validAddresses`, validAddresses)

                    if (validAddresses.length !== value_.length)
                      return "Field contains invalid addresses"

                    if (router.route !== "/balancy" && value_.length > 50000)
                      return `You've added ${value_.length} addresses but the maximum is 50000`
                  },
          }}
          render={({ field: { onChange, onBlur, value: textareaValue, ref } }) => (
            <Textarea
              ref={ref}
              resize="vertical"
              p={2}
              minH={64}
              className="custom-scrollbar"
              cols={42}
              wrap="off"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
              value={textareaValue?.join("\n") || ""}
              onChange={(e) => onChange(e.target.value?.split("\n"))}
              onBlur={onBlur}
              placeholder="...or paste addresses, each one in a new line"
            />
          )}
        />
        <FormErrorMessage>
          {(parseFromObject(errors, baseFieldPath)?.data?.addresses as any)?.message}
        </FormErrorMessage>
      </FormControl>
      {router.asPath !== "/balancy" && (
        <FormControl pb={3}>
          <Checkbox
            fontWeight="medium"
            {...register(`${baseFieldPath}.data.hideAllowlist`)}
            checked={isHidden}
          >
            Make allowlist private
          </Checkbox>
        </FormControl>
      )}
    </Stack>
  )
}

export default AllowlistForm
