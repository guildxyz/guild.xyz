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
import FormErrorMessage from "components/common/FormErrorMessage"
import useDropzone from "hooks/useDropzone"
import { File } from "phosphor-react"
import { useRef } from "react"
import { Controller, useFormContext, useWatch } from "react-hook-form"
import { RequirementFormProps } from "requirements"
import parseFromObject from "utils/parseFromObject"

function snapshotToRaw(snapshot: Array<{ key: string; value: number }>) {
  return snapshot.map(({ key, value }) => `${key};${value}`).join("\n")
}

function rawToSnapshot(rawData = "") {
  const lines = rawData.split("\n") ?? []
  return lines
    .filter((line) => line.length > 0)
    .map((line) => {
      const [key, value] = line.trim().split(/[,;\t]/g)
      return { key, value: +value }
    })
}

const AllowlistForm = ({
  baseFieldPath,
  field,
}: RequirementFormProps): JSX.Element => {
  const {
    setValue,
    formState: { errors },
    control,
    register,
  } = useFormContext()

  const textareaRef = useRef<HTMLTextAreaElement>()

  const isHidden = useWatch({ name: `${baseFieldPath}.data.isHidden` })

  const { isDragActive, fileRejections, getRootProps, getInputProps } = useDropzone({
    multiple: false,
    accept: { "text/*": [".csv"] },
    onDrop: (accepted) => {
      if (accepted.length > 0) parseFile(accepted[0])
    },
  })

  const parseFile = (file: File) => {
    const fileReader = new FileReader()

    fileReader.onload = () => {
      const snapshot = rawToSnapshot(fileReader.result?.toString())

      textareaRef.current.value = snapshotToRaw(snapshot)
      setValue(`${baseFieldPath}.data.snapshot`, snapshot, {
        shouldValidate: true,
        shouldDirty: true,
      })
    }

    fileReader.readAsText(file)
  }

  return (
    <Stack spacing={4} alignItems="start" {...getRootProps()}>
      <FormControl isInvalid={!!fileRejections?.[0]} textAlign="left">
        <FormLabel>Upload from file</FormLabel>

        <Button as="label" leftIcon={<File />} h={10} maxW={56} cursor="pointer">
          <input {...getInputProps()} hidden />
          <Text as="span" display="block" maxW={44} noOfLines={1}>
            {isDragActive ? "Drop the file here" : "Choose .csv"}
          </Text>
        </Button>

        <FormErrorMessage>
          {fileRejections?.[0]?.errors?.[0]?.message}
        </FormErrorMessage>
      </FormControl>

      <FormControl
        isInvalid={!!parseFromObject(errors, baseFieldPath)?.data?.snapshot}
      >
        <Controller
          control={control}
          name={`${baseFieldPath}.data.snapshot` as const}
          rules={{
            validate: (value_) => {
              if (!value_) return

              const isValid = value_.every(
                ({ key, value }) =>
                  key !== "" &&
                  isValidAddress(key) &&
                  typeof value === "number" &&
                  !Number.isNaN(value)
              )

              if (!isValid) return "Field contains invalid addresses, or amounts"
            },
          }}
          render={({ field: { onChange } }) => (
            <Textarea
              defaultValue={
                field?.data?.snapshot ? snapshotToRaw(field?.data?.snapshot) : ""
              }
              ref={textareaRef}
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
              onChange={(e) => {
                // const lines = e.target.value?.split("\n") ?? []
                // const shouldUpdate = lines.every(
                //   (line) => line.includes(";") || line === ""
                // )

                // if (shouldUpdate) {
                onChange(rawToSnapshot(e.target.value))
                // }
              }}
              placeholder="...or paste addresses, each one in a new line"
            />
          )}
        />
        <FormErrorMessage>
          {(parseFromObject(errors, baseFieldPath)?.data?.snapshot as any)?.message}
        </FormErrorMessage>
      </FormControl>
      <FormControl pb={3}>
        <Checkbox
          fontWeight="medium"
          {...register(`${baseFieldPath}.data.isHidden`)}
          checked={isHidden}
        >
          Make addresses private
        </Checkbox>
      </FormControl>
    </Stack>
  )
}

export default AllowlistForm
