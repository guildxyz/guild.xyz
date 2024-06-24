import usePinata from "hooks/usePinata"
import useSubmitWithUpload from "hooks/useSubmitWithUpload"
import useToast from "hooks/useToast"
import { UseFormReturn } from "react-hook-form"
import handleSubmitDirty from "utils/handleSubmitDirty"
import useEditRole from "./useEditRole"
import { RoleEditFormData } from "./useEditRoleForm"

const useSubmitEditRole = ({
  roleId,
  methods,
  onSuccess,
}: {
  roleId: number
  methods: UseFormReturn<RoleEditFormData, any>
  onSuccess: () => void
}) => {
  const { control, reset } = methods
  const toast = useToast()

  const iconUploader = usePinata({
    fieldToSetOnSuccess: "imageUrl",
    fieldToSetOnError: "imageUrl",
    control,
  })

  const handleSuccess = () => {
    toast({
      title: `Role successfully updated!`,
      status: "success",
    })
    reset(undefined, { keepValues: true })
    onSuccess?.()
  }

  const { onSubmit, isLoading, isSigning, signLoadingText } = useEditRole(
    roleId,
    handleSuccess
  )

  const { handleSubmit, isUploadingShown, uploadLoadingText } = useSubmitWithUpload(
    handleSubmitDirty(methods)(onSubmit),
    iconUploader.isUploading
  )

  const loadingText = signLoadingText || uploadLoadingText || "Saving data"

  return {
    onSubmit: handleSubmit,
    loadingText,
    isLoading: isLoading || isSigning || isUploadingShown,
    iconUploader,
  }
}

export default useSubmitEditRole
