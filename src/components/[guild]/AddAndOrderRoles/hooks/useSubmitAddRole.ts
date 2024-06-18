import useGuild from "components/[guild]/hooks/useGuild"
import useCreateRole, {
  mutateGuildsCache,
} from "components/create-guild/hooks/useCreateRole"
import { useYourGuilds } from "components/explorer/YourGuilds"
import useMatchMutate from "hooks/useMatchMutate"
import usePinata from "hooks/usePinata"
import useShowErrorToast from "hooks/useShowErrorToast"
import useSubmit from "hooks/useSubmit"
import useSubmitWithUpload from "hooks/useSubmitWithUpload"
import useToast from "hooks/useToast"
import { MutableRefObject } from "react"
import { GuildBase, Requirement, Role, RolePlatform } from "types"
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
  const { id: guildId, mutateGuild } = useGuild()
  const showErrorToast = useShowErrorToast()
  const { mutate: mutateYourGuilds } = useYourGuilds()
  const matchMutate = useMatchMutate()

  const { onSubmit, isSigning, signLoadingText } = useCreateRole({
    skipMutate: true,
  })

  const iconUploader = usePinata({
    fieldToSetOnSuccess: "imageUrl",
    fieldToSetOnError: "imageUrl",
    control: methods.control,
  })

  const createRole = async (role: Role & { guildId: number }) => {
    try {
      return await onSubmit({ ...role, requirements: [{ type: "FREE" }] })
    } catch (error) {
      showErrorToast("Failed to create role")
      return null
    }
  }

  const createRequirements = async (
    requirements: Partial<Requirement>[],
    roleId: number
  ) => {
    const requirementIdMap = {}

    const promises = requirements.map((req) =>
      fetcherWithSign([
        `/v2/guilds/${guildId}/roles/${roleId}/requirements`,
        {
          method: "POST",
          body: preprocessRequirement(req),
        },
      ])
        .then((res) => {
          requirementIdMap[req.id] = res.id
          return { status: "fulfilled", result: res }
        })
        .catch((error) => {
          showErrorToast("Failed to create a requirement")
          console.error(error)
          return { status: "rejected", result: error }
        })
    )

    const results = await Promise.all(promises)
    const createdRequirements = results
      .filter((res) => res.status === "fulfilled")
      .map((res) => res.result)

    return { createdRequirements, requirementIdMap }
  }

  const transformRolePlatform = (
    rp: RolePlatform,
    requirementIdMap: Record<number, number>,
    roleId: number
  ) => {
    if (!rp.dynamicAmount) return rp

    const input: any = rp.dynamicAmount.operation.input
    const requirementId = requirementIdMap[input.requirementId]

    if (!requirementId) {
      showErrorToast(
        `Skipping a reward creation, as its referenced requirement was not successfully created`
      )
      return null
    }

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
  }

  const createRolePlatforms = async (
    rolePlatforms: RolePlatform[],
    roleId: number
  ) => {
    const promises = rolePlatforms.map((rolePlatform) =>
      fetcherWithSign([
        `/v2/guilds/${guildId}/roles/${roleId}/role-platforms`,
        { method: "POST", body: rolePlatform },
      ])
        .then((res) => ({ status: "fulfilled", result: res }))
        .catch((error) => {
          showErrorToast("Failed to create a reward")
          console.error(error)
          return { status: "rejected", result: error }
        })
    )

    const results = await Promise.all(promises)
    return results
      .filter((res) => res.status === "fulfilled")
      .map((res) => res.result)
  }

  const submit = async (data) => {
    const { requirements, rolePlatforms, ...role } = data

    const createdRole = await createRole(role)
    if (!createdRole) return
    const roleId = createdRole.id

    const { createdRequirements, requirementIdMap } = await createRequirements(
      requirements,
      roleId
    )
    const transformedRolePlatforms = rolePlatforms
      .map((rp) => transformRolePlatform(rp, requirementIdMap, roleId))
      .filter((rp) => rp !== null)

    const createdRolePlatforms = await createRolePlatforms(
      transformedRolePlatforms,
      roleId
    )

    return { createdRole, createdRequirements, createdRolePlatforms }
  }

  const mutateAll = (
    createdRole: Role,
    createdRequirements: Requirement[],
    createdRolePlatforms: RolePlatform[]
  ) => {
    const completeRole = {
      ...createdRole,
      requirements: createdRequirements,
      rolePlatforms: createdRolePlatforms,
    }

    mutateYourGuilds((prev) => mutateGuildsCache(prev, guildId), {
      revalidate: false,
    })
    matchMutate<GuildBase[]>(
      /\/guilds\?order/,
      (prev) => mutateGuildsCache(prev, guildId),
      { revalidate: false }
    )
    mutateGuild((prev) => ({
      ...prev,
      roles: prev.roles.some((role) => role.id === createdRole.id)
        ? prev.roles.map((role) =>
            role.id === createdRole.id ? completeRole : role
          )
        : [...prev.roles, completeRole],
    }))
  }

  const { onSubmit: submitWrapper, isLoading } = useSubmit(submit, {
    onSuccess: (res) => {
      const { createdRole, createdRequirements, createdRolePlatforms } = res

      toast({
        title: "Role successfully created",
        status: "success",
      })

      mutateAll(createdRole, createdRequirements, createdRolePlatforms)

      methods.reset(methods.defaultValues)
      window.location.hash = `role-${createdRole.id}`
      onSuccess?.()
    },
    onError: (error) => {
      showErrorToast("Failed to create role due to an unexpected error")
      console.error(error)
    },
  })

  const { handleSubmit, isUploadingShown, uploadLoadingText } = useSubmitWithUpload(
    methods.handleSubmit(submitWrapper, (formErrors) => {
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
