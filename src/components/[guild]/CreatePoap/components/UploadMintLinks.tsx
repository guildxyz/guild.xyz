import {
  Divider,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  Icon,
  Stack,
  Text,
  Textarea,
  VStack,
} from "@chakra-ui/react"
import Button from "components/common/Button"
import FormErrorMessage from "components/common/FormErrorMessage"
import useDropzone from "hooks/useDropzone"
import { File, Upload } from "phosphor-react"
import { useEffect, useState } from "react"
import { FormProvider, useForm, useWatch } from "react-hook-form"
import { useCreatePoapContext } from "../components/CreatePoapContext"
import usePoapLinks from "../hooks/usePoapLinks"
import useUploadMintLinks from "../hooks/useUploadMintLinks"

const UploadMintLinks = (): JSX.Element => {
  const { poapData, nextStep, onCloseHandler } = useCreatePoapContext()

  const methods = useForm<{ mintLinks: string }>({ mode: "all" })
  const mintLinksInputValue = useWatch({
    control: methods.control,
    name: "mintLinks",
  })

  const { poapLinks } = usePoapLinks(poapData?.id)
  const [initialTotalLinks, setInitialTotalLinks] = useState<number>(undefined)

  useEffect(() => {
    if (!poapLinks || typeof initialTotalLinks !== "undefined") return
    setInitialTotalLinks(poapLinks.total)
  }, [poapLinks])

  const { onSubmit, isLoading, loadingText, response } = useUploadMintLinks()

  useEffect(() => {
    if (!response) return
    if (initialTotalLinks === 0) nextStep()
    else onCloseHandler()
  }, [response])

  const [mintLinks, setMintLinks] = useState<string[]>(null)

  const { isDragActive, fileRejections, getRootProps, getInputProps } = useDropzone({
    multiple: false,
    accept: "text/plain",
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
      <Text w="full">
        {initialTotalLinks > 0
          ? `You've uploaded ${initialTotalLinks} mint links so far.`
          : "The POAP Curation Body will review your petition according to the POAP drop policies and you'll receive a confirmation email after it is reviewed. Then, you'll be able to upload the received mint links in the form below."}
      </Text>

      <Stack w="full" spacing={4}>
        <FormControl
          isInvalid={!!fileRejections?.[0] || !!regexError}
          textAlign="left"
        >
          <FormLabel>{`Upload ${
            initialTotalLinks > 0 ? "more " : ""
          } mint links`}</FormLabel>
          <Button {...getRootProps()} as="label" leftIcon={<File />} h={10}>
            <input {...getInputProps()} hidden />
            {isDragActive ? "Drop the file here" : "Upload .txt"}
          </Button>
          <FormErrorMessage>
            {fileRejections?.[0]?.errors?.[0]?.message || regexError}
          </FormErrorMessage>
        </FormControl>

        <HStack>
          <Divider />
          <Text as="span" px={4} color="gray" fontWeight="bold" fontSize="sm">
            OR
          </Text>
          <Divider />
        </HStack>

        <FormProvider {...methods}>
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
              placeholder="Paste mint links here"
            />
            <FormErrorMessage>
              {methods?.formState?.errors?.mintLinks?.message}
            </FormErrorMessage>
          </FormControl>
        </FormProvider>
      </Stack>

      <Flex w="full" justifyContent="end">
        <Button
          colorScheme="indigo"
          onClick={() => onSubmit({ poapId: poapData?.id, links: mintLinks })}
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
