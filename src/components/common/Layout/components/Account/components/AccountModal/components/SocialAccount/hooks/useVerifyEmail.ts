import { publicClient } from "connectors"
import useSubmit from "hooks/useSubmit"
import useToast from "hooks/useToast"
import {
  fetcherWithSign as rawFetcherWithSign,
  useFetcherWithSign,
} from "utils/fetcher"
import { Connector, useAccount } from "wagmi"

const getUrl = (addr: string, emailAddress: string) =>
  `/v2/users/${addr.toLowerCase()}/emails/${emailAddress}/verification`

const useVerifyEmail = (
  {
    onError,
    onSuccess,
  }: {
    onSuccess?: () => void
    onError?: (error: any) => void
  } = {},
  connector?: Connector
) => {
  const { address } = useAccount()
  const fetcherWithSign = useFetcherWithSign()
  const toast = useToast()

  return useSubmit(
    async ({ code, emailAddress }: { emailAddress: string; code: string }) => {
      const requestConfig = { body: { authData: { code } }, method: "POST" }

      if (connector) {
        const walletClient = await connector.getWalletClient()

        return rawFetcherWithSign(
          {
            publicClient: publicClient({}),
            walletClient,
            address: walletClient.account.address,
          },
          getUrl(walletClient.account.address, emailAddress),
          requestConfig
        )
      }

      return fetcherWithSign([getUrl(address, emailAddress), requestConfig])
    },
    {
      onSuccess: () => {
        toast({
          status: "success",
          title: "Email verified",
          description: "Successfully verified your email address!",
        })

        onSuccess?.()
      },
      onError,
    }
  )
}

export default useVerifyEmail
