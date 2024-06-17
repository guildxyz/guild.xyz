import useCreateRole from "components/create-guild/hooks/useCreateRole"
import usePinata from "hooks/usePinata"
import useSubmitWithUpload from "hooks/useSubmitWithUpload"
import useToast from "hooks/useToast"
import { MutableRefObject } from "react"

const useSubmitAddRole = ({
  drawerBodyRef,
  methods,
  onSuccess,
}: {
  drawerBodyRef: MutableRefObject<HTMLDivElement>
  methods: any
  onSuccess: () => void
}) => {
  const toast = useToast()

  const { onSubmit, isLoading, isSigning, signLoadingText } = useCreateRole({
    onSuccess: () => {
      toast({
        title: "Role successfully created",
        status: "success",
      })
      methods.reset(methods.defaultValues)
      onSuccess?.()
    },
  })

  const iconUploader = usePinata({
    fieldToSetOnSuccess: "imageUrl",
    fieldToSetOnError: "imageUrl",
    control: methods.control,
  })

  const { handleSubmit, isUploadingShown, uploadLoadingText } = useSubmitWithUpload(
    methods.handleSubmit(onSubmit, (formErrors) => {
      if (formErrors.requirements && drawerBodyRef.current) {
        drawerBodyRef.current.scrollBy({
          top: drawerBodyRef.current.scrollHeight,
          behavior: "smooth",
        })
      }
    }),
    iconUploader.isUploading
  )

  const loadingText = signLoadingText || uploadLoadingText || "Saving data"

  return {
    onSubmit: handleSubmit,
    loadingText,
    isLoading: isUploadingShown || isLoading || isSigning,
    iconUploader,
  }
}

export default useSubmitAddRole
