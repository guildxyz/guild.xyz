import { FormControl, FormLabel, Stack, Text, Textarea } from "@chakra-ui/react"
import { File } from "@phosphor-icons/react"
import Button from "components/common/Button"
import FormErrorMessage from "components/common/FormErrorMessage"
import useDropzone from "hooks/useDropzone"
import { useFormContext, useWatch } from "react-hook-form"
import { ImportPoapForm } from "../AddPoapPanel"

const LEGACY_POAP_MINT_LINK_BASE = "http://poap.xyz/claim/"
const POAP_MINT_LINK_BASE = "http://poap.xyz/mint/"

export const validatePoapLinks = (links: string[]) =>
  links
    .filter(Boolean)
    .map((link) => link.toLowerCase())
    .every(
      (link) =>
        (link.startsWith(LEGACY_POAP_MINT_LINK_BASE) ||
          link.startsWith(POAP_MINT_LINK_BASE)) &&
        /^[A-Za-z0-9]*$/i.test(
          link
            .replace(LEGACY_POAP_MINT_LINK_BASE, "")
            .replace(POAP_MINT_LINK_BASE, "")
        )
    )

const INVALID_LINKS_ERROR = {
  type: "validate",
  message: "Your list includes invalid mint links!",
}

type Props = {
  isOptional?: boolean
}

const UploadMintLinks = ({ isOptional }: Props) => {
  const {
    setValue,
    formState: { errors },
    setError,
    clearErrors,
  } = useFormContext<ImportPoapForm>()

  const texts = useWatch({ name: "texts" })

  return (
    <FormControl isInvalid={!!errors?.texts}>
      <FormLabel>
        <Text as="span">{"Mint links "}</Text>
        {isOptional && (
          <Text as="span" colorScheme="gray">
            (optional - you can upload them later)
          </Text>
        )}
      </FormLabel>

      <Stack>
        <UploadTxt />

        <Textarea
          value={texts?.join("\n")}
          onChange={(e) => {
            clearErrors()

            if (!e.target.value) {
              setValue("texts", [])
              return
            }

            const linksArray = e.target.value.split("\n")
            setValue("texts", linksArray)

            if (!validatePoapLinks(linksArray)) {
              setError("texts", INVALID_LINKS_ERROR)
            }
          }}
          minH={48}
          placeholder="... or paste links here, each one in a new line"
        />
        <FormErrorMessage>{errors?.texts?.message}</FormErrorMessage>
      </Stack>
    </FormControl>
  )
}

const UploadTxt = () => {
  const { setValue, setError, clearErrors } = useFormContext<ImportPoapForm>()

  const { isDragActive, getRootProps, getInputProps } = useDropzone({
    multiple: false,
    accept: { "text/plain": [".txt"] },
    onDrop: (accepted, fileRejections) => {
      clearErrors("texts")

      if (fileRejections?.length > 0) {
        setError("texts", {
          type: "validate",
          message: fileRejections[0].errors[0].message,
        })
        return
      }

      if (accepted.length > 0) parseTxt(accepted[0])
    },
  })

  const parseTxt = (file: File) => {
    const fileReader = new FileReader()
    fileReader.onload = () => {
      clearErrors("texts")
      const lines = fileReader.result?.toString()?.split("\n")

      if (!validatePoapLinks(lines)) {
        setError("texts", INVALID_LINKS_ERROR)
        return
      }

      setValue("texts", lines)
    }

    fileReader.readAsText(file)
  }

  return (
    <Button
      {...getRootProps()}
      as="label"
      leftIcon={<File />}
      h={10}
      maxW="max-content"
    >
      <input {...getInputProps()} hidden />
      {isDragActive ? "Drop the file here" : "Upload .txt"}
    </Button>
  )
}

export default UploadMintLinks
