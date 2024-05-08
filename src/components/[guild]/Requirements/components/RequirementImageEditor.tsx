import { Circle, Icon, Spinner, Text } from "@chakra-ui/react"
import usePinata from "hooks/usePinata"
import useShowErrorToast from "hooks/useShowErrorToast"
import useToast from "hooks/useToast"
import { Upload, X } from "phosphor-react"
import { PropsWithChildren, useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"
import { useRequirementContext } from "./RequirementContext"

type RequirementImageEditorProps = {
  onSave: (newName: string) => void
  isLoading?: boolean
}

const RequirementImageEditor = ({
  onSave,
  isLoading,
  children,
}: PropsWithChildren<RequirementImageEditorProps>) => {
  const requirement = useRequirementContext()
  const { data } = requirement

  const [progress, setProgress] = useState<number>(0)

  const toast = useToast()
  const showErrorToast = useShowErrorToast()

  const onSuccess = useCallback(
    ({ IpfsHash }) => onSave(`${process.env.NEXT_PUBLIC_IPFS_GATEWAY}${IpfsHash}`),
    [onSave]
  )

  const onError = useCallback(
    () => showErrorToast("Couldn't upload image"),
    [showErrorToast]
  )

  const uploader = usePinata({ onSuccess, onError })

  const { getRootProps, getInputProps } = useDropzone({
    multiple: false,
    onDrop: (accepted) => {
      if (accepted.length > 0) {
        uploader.onUpload({ data: [accepted[0]], onProgress: setProgress })
      }
    },
    onError: (error) => toast({ status: "error", title: error.message }),
  })

  if (data?.customImage)
    return (
      <>
        <Circle
          data-req-image-editor
          position="absolute"
          opacity={0}
          _hover={{
            opacity: 1,
          }}
          background="blackAlpha.600"
          p={3.5}
          cursor="pointer"
          onClick={() => onSave("")}
        >
          <Icon as={X} boxSize={4} color="white" />
        </Circle>
        {children}
      </>
    )

  if (uploader.isUploading)
    return (
      <Text fontSize={13} textAlign="center" w="full">
        {(progress * 100).toFixed()}%
      </Text>
    )

  if (isLoading) return <Spinner size="sm" />

  return (
    <>
      <Circle
        data-req-image-editor
        position="absolute"
        opacity={0}
        _hover={{
          opacity: 1,
        }}
        p={3.5}
        background="blackAlpha.700"
        cursor="pointer"
        {...getRootProps()}
      >
        <input {...getInputProps()} hidden />
        <Icon as={Upload} boxSize={4} color="white" />
      </Circle>
      {children}
    </>
  )
}

export default RequirementImageEditor
