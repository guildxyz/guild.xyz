import useGuild from "components/[guild]/hooks/useGuild"
import useCreateRole from "components/create-guild/hooks/useCreateRole"
import usePinata from "hooks/usePinata"
import useSubmitWithUpload from "hooks/useSubmitWithUpload"
import useToast from "hooks/useToast"
import { MutableRefObject } from "react"
import { useFetcherWithSign } from "utils/fetcher"
import preprocessRequirement from "utils/preprocessRequirement"

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
  const fetcherWithSign = useFetcherWithSign()
  const { id: guildId } = useGuild()

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

  const newSubmit = async (data) => {
    const { requirements, rolePlatforms, ...role } = data

    const createdRole = await onSubmit({ ...role, requirements: [{ type: "FREE" }] })
    const roleId = createdRole.id

    const requirementIdMap = requirements.reduce((acc, req) => {
      acc[req.id] = req
      return acc
    }, {})

    const requirementCreations = Promise.all(
      requirements.map((req) =>
        fetcherWithSign([
          `/v2/guilds/${guildId}/roles/${roleId}/requirements`,
          {
            method: "POST",
            body: preprocessRequirement(req),
          },
        ]).then((res) => {
          requirementIdMap[req.id] = res.id
          return res
        })
      )
    )

    const createdRequirements = await requirementCreations

    let rolePlatformsToCreate = rolePlatforms.map((rp) => {
      if (!rp.dynamicAmount) return rp

      const {
        dynamicAmount: {
          operation: { input },
        },
      } = rp
      const requirementId = requirementIdMap[input.requirementId]

      return {
        ...rp,
        dynamicAmount: {
          ...rp.dynamicAmount,
          operation: {
            ...rp.dynamicAmount.operation,
            input: {
              ...input,
              requirementId,
              roleId,
            },
          },
        },
      }
    })

    const rolePlatformCreations = Promise.all(
      rolePlatformsToCreate.map((rolePlatform) =>
        fetcherWithSign([
          `/v2/guilds/${guildId}/roles/${roleId}/role-platforms`,
          { method: "POST", body: rolePlatform },
        ]).catch((error) => error)
      )
    )

    const createdRolePlatforms = await rolePlatformCreations
  }

  const { handleSubmit, isUploadingShown, uploadLoadingText } = useSubmitWithUpload(
    methods.handleSubmit(newSubmit, (formErrors) => {
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
