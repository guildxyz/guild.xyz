import { ToastId } from "@chakra-ui/react"
import processConnectorError from "components/[guild]/JoinModal/utils/processConnectorError"
import useGuild from "components/[guild]/hooks/useGuild"
import useJsConfetti from "components/create-guild/hooks/useJsConfetti"
import { mutateOptionalAuthSWRKey } from "hooks/useSWRWithOptionalAuth"
import useShowErrorToast from "hooks/useShowErrorToast"
import { SignedValdation, useSubmitWithSign } from "hooks/useSubmit"
import useToast from "hooks/useToast"
import { useRef } from "react"
import { useSWRConfig } from "swr"
import { Role } from "types"
import fetcher from "utils/fetcher"
import replacer from "utils/guildJsonReplacer"
import preprocessRequirements from "utils/preprocessRequirements"
import { useAccount } from "wagmi"

type RoleOrGuild = Role & { guildId: number }

const useCreateHiddenRole = (onSuccess?: () => void) => {
  const toastIdRef = useRef<ToastId>()
  const { address } = useAccount()

  const { mutate } = useSWRConfig()

  const toast = useToast()
  const showErrorToast = useShowErrorToast()
  const triggerConfetti = useJsConfetti()
  const { id, mutateGuild } = useGuild()

  const fetchData = async (
    signedValidation: SignedValdation
  ): Promise<RoleOrGuild> => fetcher("/role", signedValidation)

  const useSubmitResponse = useSubmitWithSign<RoleOrGuild>(fetchData, {
    onError: (error_) => {
      showErrorToast({
        error: processConnectorError(error_.error) ?? error_.error,
        correlationId: error_.correlationId,
      })
    },
    onSuccess: async (response_) => {
      triggerConfetti()

      toastIdRef.current = toast({
        duration: 8000,
        title: "Role successfully created",
        description:
          "It may take some time for all eligible members to get it. See the query status next to it!",
        status: "success",
      })

      mutateOptionalAuthSWRKey(`/guild/access/${id}/${address}`)
      mutate(`/statusUpdate/guild/${id}`)

      await mutateGuild(async (curr) => ({
        ...curr,
        roles: [...curr.roles, response_],
      }))

      onSuccess?.()
    },
  })

  return {
    ...useSubmitResponse,
    onSubmit: (data) => {
      data.requirements = preprocessRequirements(data?.requirements)

      delete data.roleType

      if (data.logic !== "ANY_OF") delete data.anyOfNum

      return useSubmitResponse.onSubmit(JSON.parse(JSON.stringify(data, replacer)))
    },
  }
}

export default useCreateHiddenRole
