import useUser from "components/[guild]/hooks/useUser"
import useShowErrorToast from "hooks/useShowErrorToast"
import useSubmit from "hooks/useSubmit"
import useToast from "hooks/useToast"
import { UserAddress } from "types"
import { useFetcherWithSign } from "utils/fetcher"

type EditPrimaryAddressData = {
  address: `0x${string}`
  isPrimary: boolean
}

const useEditPrimaryAddress = () => {
  const showErrorToast = useShowErrorToast()
  const toast = useToast()
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
        status: "success",
      })
    },
    onError: (error) => showErrorToast(error),
  })
}

export default useEditPrimaryAddress
