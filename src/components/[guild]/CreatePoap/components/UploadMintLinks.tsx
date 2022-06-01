import {
  Divider,
  FormControl,
  FormLabel,
  HStack,
  Stack,
  Text,
  Textarea,
  Tooltip,
  VStack,
} from "@chakra-ui/react"
import Button from "components/common/Button"
import FormErrorMessage from "components/common/FormErrorMessage"
import useDropzone from "hooks/useDropzone"
import { File } from "phosphor-react"
import { useEffect, useState } from "react"
import { FormProvider, useForm, useWatch } from "react-hook-form"
import { useCreatePoapContext } from "../components/CreatePoapContext"
import useUploadMintLinks from "../hooks/useUploadMintLinks"

type Props = {
  nextStep: () => void
}

const UploadMintLinks = ({ nextStep }: Props): JSX.Element => {
  const methods = useForm<{ mintLinks: string }>({ mode: "all" })
  const mintLinksInputValue = useWatch({
    control: methods.control,
    name: "mintLinks",
  })

  const { onSubmit, isLoading, response } = useUploadMintLinks()

  const [mintLinks, setMintLinks] = useState<string[]>(null)

  const { poapData } = useCreatePoapContext()

  const { isDragActive, fileRejections, getRootProps, getInputProps } = useDropzone({
    multiple: false,
    accept: "text/plain",
    onDrop: (accepted) => {
      if (accepted.length > 0) parseTxt(accepted[0])
    },
  })

  const parseTxt = (file: File) => {
    const fileReader = new FileReader()
    fileReader.onload = () => {
      const lines = fileReader.result
        ?.toString()
        ?.split("\n")
        ?.filter((line) => !!line)
      // const regex = new RegExp(/[a-zA-Z0-9]+/g)

      // if (
      //   !lines.every((line) =>
      //     regex.test(line.replace("http://POAP.xyz/claim/", ""))
      //   )
      // ) {
      //   lines.forEach((line) => {
      //     const l = line.replace("http://POAP.xyz/claim/", "")
      //     console.log("Testing", l, regex.test(l))
      //   })
      //   console.log("lines", lines)
      //   console.log("BAD!")
      //   return
      // }

      // console.log("GOOOOD.")
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
      <Text textAlign={{ base: "left", md: "center" }}>
        Please paste your mint links in the textarea below. Once you set up the bot,
        we'll send these links to the users who'd like to claim your POAP
      </Text>

      <Stack w="full" spacing={4}>
        <FormControl isInvalid={!!fileRejections?.[0]}>
          <FormLabel>Upload mint links</FormLabel>
          <Button {...getRootProps()} as="label" leftIcon={<File />} h={10}>
            <input {...getInputProps()} hidden />
            {isDragActive ? "Drop the file here" : "Upload .txt"}
          </Button>
          <FormErrorMessage>
            {fileRejections?.[0]?.errors?.[0]?.message}
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
          <Textarea
            {...methods.register("mintLinks", {
              required: "This field is required.",
            })}
            minH={64}
            placeholder="Paste mint links here"
          ></Textarea>
        </FormProvider>
      </Stack>

      <HStack>
        <Button
          colorScheme="indigo"
          onClick={() => onSubmit({ poapId: poapData?.id, links: mintLinks })}
          isLoading={isLoading}
          isDisabled={isLoading || response}
        >
          Save links
        </Button>
        <Tooltip label="Coming soon!">
          <Button
            colorScheme="indigo"
            onClick={nextStep}
            /*isDisabled={!response}*/ isDisabled
          >
            Set up Discord claiming
          </Button>
        </Tooltip>
      </HStack>
    </VStack>
  )
}

export default UploadMintLinks
