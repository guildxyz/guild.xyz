import {
  Center,
  Circle,
  FormControl,
  FormErrorMessage,
  Icon,
  Img,
  Text,
} from "@chakra-ui/react"
import { ERROR_MESSAGES } from "hooks/useDropzone"
import usePinata from "hooks/usePinata"
import { Upload, X } from "phosphor-react"
import { useState } from "react"
import { useDropzone } from "react-dropzone"
import { useFormContext, useWatch } from "react-hook-form"
import RequirementImage from "./RequirementImage"

type Props = {
  baseFieldPath: string
  orignalImage: string | JSX.Element
}

const RequirementImageEditor = ({ baseFieldPath, orignalImage }: Props) => {
  const { control, setValue } = useFormContext()

  const customImage = useWatch({
    name: `${baseFieldPath}.data.customImage`,
    control,
  })

  const [progress, setProgress] = useState<number>(0)

  const uploader = usePinata({
    onSuccess: ({ IpfsHash }) => {
      setValue(
        `${baseFieldPath}.data.customImage`,
        `${process.env.NEXT_PUBLIC_IPFS_GATEWAY}${IpfsHash}`,
        { shouldDirty: true }
      )
    },
    onError: () => {
      setValue(`${baseFieldPath}.data.customImage`, undefined)
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
      {customImage ? (
        <Center position={"relative"} height={"var(--chakra-space-11)"}>
          <Circle
            position="absolute"
            onClick={() => {
              setValue(`${baseFieldPath}.data.customImage`, "", {
                shouldDirty: true,
              })
            }}
            opacity={0}
            _hover={{
              opacity: 1,
            }}
            background={"blackAlpha.600"}
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
          {(progress * 100).toFixed()}%
        </Text>
      ) : (
        <Center position={"relative"} minH={"var(--chakra-space-11)"}>
          <Circle
            position="absolute"
            opacity={0}
            _hover={{
              opacity: 1,
            }}
            p={3.5}
            background={"blackAlpha.700"}
            cursor={"pointer"}
            {...getRootProps()}
          >
            <input {...getInputProps()} hidden />
            <Icon as={Upload} boxSize={4} color={"white"} />
          </Circle>
          <RequirementImage image={orignalImage} />
        </Center>
      )}
      <FormErrorMessage>
        {ERROR_MESSAGES[fileRejections?.[0]?.errors?.[0]?.code] ??
          fileRejections?.[0]?.errors?.[0]?.message}
      </FormErrorMessage>
    </FormControl>
  )
}

export default RequirementImageEditor
