import useUser from "components/[guild]/hooks/useUser"
import { publicClient } from "connectors"
import useSubmit from "hooks/useSubmit"
import useToast from "hooks/useToast"
import {
  fetcherWithSign as rawFetcherWithSign,
  useFetcherWithSign,
} from "utils/fetcher"
import { Connector } from "wagmi"

const useVerificationRequest = (
  {
    onSuccess,
    onError,
  }: {
    onSuccess?: (response: {
      remainingAttempts: number
      success: boolean
      userId?: number
    }) => void
    onError?: (error: any) => void
  } = {},
  connector?: Connector
) => {
  const { id: userId } = useUser()
  const fetcherWithSign = useFetcherWithSign()
  const toast = useToast()

  const submitVerificationRequest = async (body: {
    emailAddress: string
  }): Promise<{
    remainingAttempts: number
    success: boolean
    userId?: number
  }> => {
    const resource = `/v2/users/${userId ?? 0}/emails`
    const requestConfig = { method: "POST", body }
    if (connector) {
      const walletClient = await connector.getWalletClient()

      return rawFetcherWithSign(
        {
          publicClient: publicClient({}),
          ts: Date.now(),
          walletClient,
          address: walletClient.account.address,
        },
        resource,
        requestConfig
      )
    }

    return fetcherWithSign([resource, requestConfig])
  }

  return useSubmit(submitVerificationRequest, {
    onSuccess: (resp) => {
      toast({
        status: "info",
        title: "Email sent",
        description:
          "Check your inbox (and spam folder) to find the verification code!",
      })

      onSuccess?.(resp)
    },
    onError,
  })
}

export default useVerificationRequest
