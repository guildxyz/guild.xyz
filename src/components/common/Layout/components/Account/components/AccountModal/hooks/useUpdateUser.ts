import { useWeb3React } from "@web3-react/core"
import usePersonalSign from "hooks/usePersonalSign"
import useShowErrorToast from "hooks/useShowErrorToast"
import useSubmit from "hooks/useSubmit"
import useToast from "hooks/useToast"
import { useSWRConfig } from "swr"

type Data = { addresses: Array<string> }

const useUpdateUser = () => {
  const { account } = useWeb3React()
  const { mutate } = useSWRConfig()
  const toast = useToast()
  const showErrorToast = useShowErrorToast()
  const { addressSignedMessage } = usePersonalSign()

  const submit = async (data: Data) =>
    fetch(`${process.env.NEXT_PUBLIC_API}/user/${account?.toLowerCase()}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        addressSignedMessage,
        ...data,
      }),
    })

  return useSubmit<Data, any>(submit, {
    onSuccess: () => {
      toast({
        title: `Address removed!`,
        status: "success",
      })
      mutate(["user", account])
    },
    onError: (error) => showErrorToast(error),
  })
}

export default useUpdateUser
