import {
  FormControl,
  FormHelperText,
  FormLabel,
  Stack,
  Textarea,
} from "@chakra-ui/react"
import Button from "components/common/Button"
import FormErrorMessage from "components/common/FormErrorMessage"
import useDropzone from "hooks/useDropzone"
import { File } from "phosphor-react"
import PublicRewardDataForm from "platforms/SecretText/SecretTextDataForm/components/PublicRewardDataForm"
import { PropsWithChildren, useState } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import Key from "static/icons/key.svg"

export type UniqueTextRewardForm = {
  name: string
  imageUrl?: string
  texts: string[]
}

type Props = {
  isEditForm?: boolean
}

const UniqueTextDataForm = ({ isEditForm, children }: PropsWithChildren<Props>) => {
  const {
    setValue,
    formState: { errors },
  } = useFormContext<UniqueTextRewardForm>()

  const texts = useWatch({ name: "texts" })

  const parseTxt = (file: File) => {
    const fileReader = new FileReader()
    fileReader.onload = () => {
      setRegexError(null)
      const lines = fileReader.result?.toString()?.split("\n")?.filter(Boolean)

      setValue("texts", lines)
    }

    fileReader.readAsText(file)
  }

  const { isDragActive, fileRejections, getRootProps, getInputProps } = useDropzone({
    multiple: false,
    accept: { "text/plain": [".txt"] },
    onDrop: (accepted) => {
      if (accepted.length > 0) parseTxt(accepted[0])
    },
  })

  const [regexError, setRegexError] = useState("")

  return (
    <Stack spacing={8}>
      <PublicRewardDataForm defaultIcon={Key} />

      <Stack>
        <FormLabel>
          {isEditForm ? "Upload additional unique texts" : "Unique texts"}
        </FormLabel>

        <FormControl isInvalid={!!fileRejections?.[0] || !!regexError}>
          <Button {...getRootProps()} as="label" leftIcon={<File />}>
            <input {...getInputProps()} hidden />
            {isDragActive ? "Drop the file here" : "Upload list"}
          </Button>

          <FormHelperText>In .txt format, each text in a new line</FormHelperText>

          <FormErrorMessage>
            {fileRejections?.[0]?.errors?.[0]?.message || regexError}
          </FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors?.texts}>
          <Textarea
            minH={52}
            placeholder="...or paste links, each one in a new line"
            value={texts?.join("\n")}
            onChange={(e) => {
              if (!e.target.value) {
                setValue("texts", [])
                return
              }

              setValue("texts", e.target.value.split("\n"))
            }}
          />
          <FormErrorMessage>{errors?.texts?.message}</FormErrorMessage>
        </FormControl>
      </Stack>

      {children}
    </Stack>
  )
}
export default UniqueTextDataForm
