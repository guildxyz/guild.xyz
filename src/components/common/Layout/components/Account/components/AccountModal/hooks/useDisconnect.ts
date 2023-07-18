import { useWeb3React } from "@web3-react/core"
import useGuild from "components/[guild]/hooks/useGuild"
import useUser from "components/[guild]/hooks/useUser"
import useShowErrorToast from "hooks/useShowErrorToast"
import { SignedValdation, useSubmitWithSign } from "hooks/useSubmit"
import { mutateOptionalAuthSWRKey } from "hooks/useSWRWithOptionalAuth"
import useToast from "hooks/useToast"
import { PlatformType } from "types"
import fetcher from "utils/fetcher"

const useDisconnect = (onSuccess?: () => void) => {
  const showErrorToast = useShowErrorToast()
  const { account } = useWeb3React()
  const { mutate: mutateUser, id: userId } = useUser()
  const { id } = useGuild()
  const toast = useToast()

  const submit = async (signedValidation: SignedValdation) => {
    const { platformName } = JSON.parse(signedValidation.signedPayload)

    return fetcher(
      `/v2/users/${userId}/platform-users/${PlatformType[platformName]}`,
      {
        method: "DELETE",
        ...signedValidation,
      }
    )
  }

  return useSubmitWithSign<{ platformId: number }>(submit, {
    onSuccess: ({ platformId }) => {
      mutateUser(
        (prev) => ({
          ...prev,
          platformUsers: (prev?.platformUsers ?? []).filter(
            (prevPlatformUser) => prevPlatformUser.platformId !== platformId
          ),
        }),
        { revalidate: false }
      )
      mutateOptionalAuthSWRKey(`/guild/access/${id}/${account}`)

      toast({
        title: `Account disconnected!`,
        status: "success",
      })

      onSuccess?.()
    },
    onError: (error) => showErrorToast(error),
  })
}

const useDisconnectAddress = (onSuccess?: () => void) => {
  const showErrorToast = useShowErrorToast()
  const { mutate: mutateUser, id: userId } = useUser()
  const { account } = useWeb3React()
  const { id } = useGuild()
  const toast = useToast()

  const submit = async (signedValidation: SignedValdation) => {
    const { address } = JSON.parse(signedValidation.signedPayload)
    return fetcher(`/v2/users/${userId}/addresses/${address}`, {
      method: "DELETE",
      ...signedValidation,
    }).then(() => address)
  }

  return useSubmitWithSign(submit, {
    onSuccess: (deletedAddress) => {
      mutateUser(
        (prev) => ({
          ...prev,
          addresses: (prev?.addresses ?? []).filter(
            ({ address }) => address !== deletedAddress
          ),
        }),
        { revalidate: false }
      )
      mutateOptionalAuthSWRKey(`/guild/access/${id}/${account}`)

      toast({
        title: `Account disconnected!`,
        status: "success",
      })

      onSuccess?.()
    },
    onError: (error) => showErrorToast(error),
  })
}

const useDisconnectV1 = (onSuccess?: () => void) => {
  const showErrorToast = useShowErrorToast()
  const { mutate: mutateUser } = useUser()
  const { account } = useWeb3React()
  const { id } = useGuild()
  const toast = useToast()

  const submit = async (signedValidation: SignedValdation) =>
    fetcher("/user/disconnect", {
      method: "POST",
      ...signedValidation,
    })

  return useSubmitWithSign<any>(submit, {
    onSuccess: () => {
      mutateUser()
      mutateOptionalAuthSWRKey(`/guild/access/${id}/${account}`)

      toast({
        title: `Account disconnected!`,
        status: "success",
      })

      onSuccess?.()
    },
    onError: (error) => showErrorToast(error),
  })
}

export { useDisconnectAddress, useDisconnectV1 }
export default useDisconnect
