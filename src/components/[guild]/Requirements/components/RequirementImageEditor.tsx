import {
  Button,
  Center,
  Circle,
  FormControl,
  FormErrorMessage,
  Icon,
  Img,
  Text,
  Wrap,
} from "@chakra-ui/react"
import usePinata from "hooks/usePinata"
import { Upload, X } from "phosphor-react"
import { useState } from "react"
import { useDropzone } from "react-dropzone"
import { useFormContext, useWatch } from "react-hook-form"
import { useRequirementContext } from "./RequirementContext"
import RequirementImage from "./RequirementImage"

const errorMessages = {
  "file-too-large": "This image is too large, maximum allowed file size is 5MB",
}

type Props = {
  orignalImage: string | JSX.Element
}

const RequirementImageEditor = ({ orignalImage }: Props) => {
  const { id } = useRequirementContext()

  const { control, setValue } = useFormContext()
  const requirements = useWatch({ name: "requirements", control })
  const index = requirements.findIndex((requirement) => requirement.id === id)
  const customImage = useWatch({
    name: `requirements.${index}.data.customImage`,
    control,
  })

  const [progress, setProgress] = useState<number>(0)

  const uploader = usePinata({
    onSuccess: ({ IpfsHash }) => {
      setValue(
        `requirements.${index}.data.customImage`,
        `${process.env.NEXT_PUBLIC_IPFS_GATEWAY}${IpfsHash}`,
        { shouldDirty: true }
      )
    },
    onError: () => {
      setValue(`requirements.${index}.data.customImage`, undefined)
    },
  })

  const { fileRejections, getRootProps, getInputProps } = useDropzone({
    multiple: false,
    onDrop: (accepted) => {
      if (accepted.length > 0) {
        uploader.onUpload({ data: [accepted[0]], onProgress: setProgress })
      }
    },
  })

  return (
    <FormControl isInvalid={!!fileRejections?.[0]}>
      <Wrap>
        {customImage ? (
          <Center position={"relative"} minH={"var(--chakra-space-11)"}>
            <Circle
              position="absolute"
              onClick={() => {
                setValue(`requirements.${index}.data.customImage`, "", {
                  shouldDirty: true,
                })
              }}
              opacity={0}
              _hover={{
                opacity: 1,
              }}
              background={"blackAlpha.400"}
              p={3.5}
              cursor={"pointer"}
            >
              <Icon as={X} boxSize={4} color={"white"} />
            </Circle>
            <Img
              src={customImage}
              maxWidth={"var(--chakra-space-11)"}
              maxHeight={"var(--chakra-space-11)"}
            />
          </Center>
        ) : uploader.isUploading ? (
          <Text fontSize={13} textAlign={"center"} w={"full"}>
            {progress * 100}%
          </Text>
        ) : (
          <Center position={"relative"} minH={"var(--chakra-space-11)"}>
            <Circle
              position="absolute"
              opacity={0}
              left={0}
              _hover={{
                opacity: 1,
              }}
              background={"blackAlpha.800"}
              cursor={"pointer"}
            >
              <Button
                {...getRootProps()}
                as="label"
                variant="ghost"
                rounded={"full"}
                width={"var(--chakra-space-11)"}
                maxWidth={"var(--chakra-space-11)"}
                onClick={(e) => e.stopPropagation()}
              >
                <input {...getInputProps()} hidden />
                <Upload />
              </Button>
            </Circle>
            <RequirementImage image={orignalImage} />
          </Center>
        )}
      </Wrap>
      <FormErrorMessage>
        {errorMessages[fileRejections?.[0]?.errors?.[0]?.code] ??
          fileRejections?.[0]?.errors?.[0]?.message}
      </FormErrorMessage>
    </FormControl>
  )
}

export default RequirementImageEditor
