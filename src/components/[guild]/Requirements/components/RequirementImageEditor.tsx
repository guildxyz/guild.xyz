import { Circle, Icon, Text } from "@chakra-ui/react"
import usePinata from "hooks/usePinata"
import useToast from "hooks/useToast"
import { atom, useAtom } from "jotai"
import { Upload, X } from "phosphor-react"
import { PropsWithChildren, useState } from "react"
import { useDropzone } from "react-dropzone"
import { useFormContext, useWatch } from "react-hook-form"

export const showEditableImageAtom = atom("")

type Props = {
  baseFieldPath: string
}

const RequirementImageEditor = ({
  baseFieldPath,
  children,
}: PropsWithChildren<Props>) => {
  const { control, setValue } = useFormContext()
  const toast = useToast()

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

  const { getRootProps, getInputProps } = useDropzone({
    multiple: false,
    onDrop: (accepted) => {
      if (accepted.length > 0) {
        uploader.onUpload({ data: [accepted[0]], onProgress: setProgress })
      }
    },
    onError: (error) => toast({ status: "error", title: error.message }),
  })

  const [reqId] = useAtom(showEditableImageAtom)

  if (customImage)
    return (
      <>
        <Circle
          position="absolute"
          onClick={() => {
            setValue(`${baseFieldPath}.data.customImage`, "", {
              shouldDirty: true,
            })
          }}
          opacity={reqId === baseFieldPath ? 1 : 0}
          _hover={{
            opacity: 1,
          }}
          background={"blackAlpha.600"}
          p={3.5}
          cursor={"pointer"}
        >
          <Icon as={X} boxSize={4} color={"white"} />
        </Circle>
        {children}
      </>
    )

  if (uploader.isUploading)
    return (
      <Text fontSize={13} textAlign={"center"} w={"full"}>
        {(progress * 100).toFixed()}%
      </Text>
    )

  return (
    <>
      <Circle
        id="role-image-edit-circle"
        position="absolute"
        opacity={reqId === baseFieldPath ? 1 : 0}
        _hover={{
          opacity: 1,
        }}
        p={3.5}
        background={"blackAlpha.700"}
        cursor={"pointer"}
        onMouseOver={() => console.log(baseFieldPath)}
        {...getRootProps()}
      >
        <input {...getInputProps()} hidden />
        <Icon as={Upload} boxSize={4} color={"white"} />
      </Circle>
      {children}
    </>
  )
}

export default RequirementImageEditor
