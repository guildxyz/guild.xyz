import {
  Flex,
  FormControl,
  FormLabel,
  Icon,
  Stack,
  Textarea,
  VStack,
} from "@chakra-ui/react"
import Button from "components/common/Button"
import FormErrorMessage from "components/common/FormErrorMessage"
import useDropzone from "hooks/useDropzone"
import { UseSubmitOptions } from "hooks/useSubmit/useSubmit"
import { File, Upload } from "phosphor-react"
import { useEffect, useState } from "react"
import { useForm, useWatch } from "react-hook-form"
import useUploadMintLinks from "../hooks/useUploadMintLinks"

type Props = {
  poapId: number
} & UseSubmitOptions

const UploadMintLinks = ({ poapId, onSuccess = null }: Props): JSX.Element => {
  const methods = useForm<{ mintLinks: string }>({ mode: "all" })
  const mintLinksInputValue = useWatch({
    control: methods.control,
    name: "mintLinks",
  })

  const { onSubmit, isLoading, loadingText, response } = useUploadMintLinks(poapId, {
    onSuccess,
  })

  const [mintLinks, setMintLinks] = useState<string[]>(null)

  const { isDragActive, fileRejections, getRootProps, getInputProps } = useDropzone({
    multiple: false,
    accept: { "text/plain": [".txt"] },
    onDrop: (accepted) => {
      if (accepted.length > 0) parseTxt(accepted[0])
    },
  })

  const [regexError, setRegexError] = useState(null)

  const parseTxt = (file: File) => {
    const fileReader = new FileReader()
    fileReader.onload = () => {
      setRegexError(null)
      const lines = fileReader.result
        ?.toString()
        ?.split("\n")
        ?.filter((line) => !!line)

      if (
        !lines.every(
          (line) =>
            line.toLowerCase().startsWith("http://poap.xyz/claim/") &&
            /^[A-Za-z0-9]*$/i.test(
              line.toLowerCase().replace("http://poap.xyz/claim/", "")
            )
        )
      ) {
        setRegexError("Your file includes invalid mint links!")
        return
      }

      methods.setValue("mintLinks", lines.join("\n"))
    }

    fileReader.readAsText(file)
  }

  useEffect(() => {
    if (!mintLinksInputValue?.length) return
    setMintLinks(mintLinksInputValue?.split("\n"))
  }, [mintLinksInputValue])

  return (
    <VStack spacing={6} alignItems={{ base: "start", md: "center" }}>
      <Stack w="full" spacing={4}>
        <FormControl
          isInvalid={!!fileRejections?.[0] || !!regexError}
          textAlign="left"
        >
          <FormLabel>Minting links</FormLabel>
          <Button {...getRootProps()} as="label" leftIcon={<File />} h={10}>
            <input {...getInputProps()} hidden />
            {isDragActive ? "Drop the file here" : "Upload .txt"}
          </Button>
          <FormErrorMessage>
            {fileRejections?.[0]?.errors?.[0]?.message || regexError}
          </FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={!!methods?.formState?.errors?.mintLinks}>
          <Textarea
            {...methods.register("mintLinks", {
              required: "This field is required.",
              validate: (value) => {
                if (!value) return false
                const linksArray = value.split("\n")

                if (
                  !linksArray.every(
                    (line) =>
                      line.toLowerCase().startsWith("http://poap.xyz/claim/") &&
                      /^[A-Za-z0-9]*$/i.test(
                        line.toLowerCase().replace("http://poap.xyz/claim/", "")
                      )
                  )
                )
                  return "Your list includes invalid mint links or empty lines!"
              },
            })}
            minH={64}
            placeholder="... or paste links here, each one in a new line"
          />
          <FormErrorMessage>
            {methods?.formState?.errors?.mintLinks?.message}
          </FormErrorMessage>
        </FormControl>
      </Stack>

      <Flex w="full" justifyContent="end">
        <Button
          colorScheme="green"
          onClick={() => onSubmit(mintLinks)}
          isLoading={isLoading}
          loadingText={loadingText}
          isDisabled={!mintLinks?.length || isLoading || response}
          leftIcon={<Icon as={Upload} />}
        >
          Upload links
        </Button>
      </Flex>
    </VStack>
  )
}

export default UploadMintLinks
