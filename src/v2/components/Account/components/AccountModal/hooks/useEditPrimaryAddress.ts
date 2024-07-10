import { useErrorToast } from "@/components/ui/hooks/useErrorToast"
import { useToast } from "@/components/ui/hooks/useToast"
import useUser from "components/[guild]/hooks/useUser"
import { useFetcherWithSign } from "hooks/useFetcherWithSign"
import useSubmit from "hooks/useSubmit"
import { UserAddress } from "types"

type EditPrimaryAddressData = {
  address: `0x${string}`
  isPrimary: boolean
}

const useEditPrimaryAddress = () => {
  const { toast } = useToast()
  const showErrorToast = useErrorToast()
  const { mutate: mutateUser, id: userId } = useUser()

  const fetcherWithSign = useFetcherWithSign()
  const submit = async (data: EditPrimaryAddressData) =>
    fetcherWithSign([
      `/v2/users/${userId}/addresses/${data.address}`,
      {
        method: "PUT",
        body: {
          isPrimary: data.isPrimary,
        },
      },
    ])

  return useSubmit<EditPrimaryAddressData, UserAddress>(submit, {
    onSuccess: (response) => {
      mutateUser(
        (prevUser) => ({
          ...prevUser,
          addresses: prevUser.addresses.map((address) => {
            if (address.address !== response.address)
              return {
                ...address,
                isPrimary: false,
              }

            return response
          }),
        }),
        { revalidate: false }
      )

      toast({
        title: "Primary address updated!",
        variant: "success",
      })
    },
    onError: (error) => showErrorToast(error),
  })
}

export default useEditPrimaryAddress
