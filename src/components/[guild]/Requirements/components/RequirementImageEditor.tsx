import {
  Box,
  Button,
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

type Props = {
  id: number
}

const errorMessages = {
  "file-too-large": "This image is too large, maximum allowed file size is 5MB",
}

const RequirementImageEditor = ({ id }: Props) => {
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
          <Box position={"relative"}>
            <Circle
              position="absolute"
              onClick={() => {
                setValue(`requirements.${index}.data.customImage`, undefined, {
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
              <Icon as={X} boxSize={4} />
            </Circle>
            <Img
              src={customImage}
              maxWidth={"var(--chakra-space-11)"}
              maxHeight={"var(--chakra-space-11)"}
            />
          </Box>
        ) : uploader.isUploading ? (
          <Text fontSize={13} textAlign={"center"} w={"full"}>
            {progress * 100}%
          </Text>
        ) : (
          <Button
            {...getRootProps()}
            as="label"
            variant="outline"
            rounded={"full"}
            p={3}
            onClick={(e) => e.stopPropagation()}
          >
            <input {...getInputProps()} hidden />
            <Upload />
          </Button>
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
