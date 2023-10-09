import {
  FormControl,
  FormLabel,
  HStack,
  Stack,
  Text,
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
      <Text colorScheme="gray" fontWeight="semibold">
        Eligible users will be able to claim one of the uploaded secret values -
        great for distributing single-usable links, promo codes, etc
      </Text>

      <PublicRewardDataForm defaultIcon={Key} />

      <Stack>
        <FormControl isInvalid={!!fileRejections?.[0] || !!regexError}>
          <FormLabel>
            {isEditForm ? "Upload additional secrets " : "Secrets to distribute "}
            <Text display="inline-block" colorScheme="gray">
              (line-by-line)
            </Text>
          </FormLabel>
          <HStack>
            <Button
              {...getRootProps()}
              as="label"
              leftIcon={<File />}
              cursor="pointer"
            >
              <input {...getInputProps()} hidden />
              {isDragActive ? "Drop the file here" : "Upload .txt "}
            </Button>
          </HStack>

          <FormErrorMessage>
            {fileRejections?.[0]?.errors?.[0]?.message || regexError}
          </FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors?.texts}>
          <Textarea
            minH={52}
            placeholder="...or paste secrets, each one in a new line"
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
