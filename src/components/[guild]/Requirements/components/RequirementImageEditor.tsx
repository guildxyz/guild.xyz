import { Circle, Icon, Spinner, Text } from "@chakra-ui/react"
import useEditRequirement from "components/create-guild/Requirements/hooks/useEditRequirement"
import usePinata from "hooks/usePinata"
import useShowErrorToast from "hooks/useShowErrorToast"
import useToast from "hooks/useToast"
import { Upload, X } from "phosphor-react"
import { PropsWithChildren, useState } from "react"
import { useDropzone } from "react-dropzone"
import { useRequirementContext } from "./RequirementContext"

export type RequirementImageEditorProps = {
  onSave?: (newName: string) => void
}

const RequirementImageEditor = ({
  onSave,
  children,
}: PropsWithChildren<RequirementImageEditorProps>) => {
  const requirement = useRequirementContext()
  const { id, roleId, data } = requirement

  const [progress, setProgress] = useState<number>(0)

  const { onSubmit: onEditRequirementSubmit, isLoading: isEditRequirementLoading } =
    useEditRequirement(roleId)
  const toast = useToast()
  const showErrorToast = useShowErrorToast()

  const uploader = usePinata({
    onSuccess: ({ IpfsHash }) => {
      const customImage = `${process.env.NEXT_PUBLIC_IPFS_GATEWAY}${IpfsHash}`

      if (id && roleId) {
        onEditRequirementSubmit({
          ...requirement,
          data: {
            ...requirement.data,
            customImage,
          },
        })
        return
      }

      onSave?.(customImage)
    },
    onError: () => showErrorToast("Couldn't upload image"),
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
          onClick={() =>
            onEditRequirementSubmit({
              ...requirement,
              data: {
                ...requirement.data,
                customImage: undefined,
              },
            })
          }
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

  if (isEditRequirementLoading) return <Spinner size="sm" />

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
