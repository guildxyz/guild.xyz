import { useToast } from "@/components/ui/hooks/useToast"
import useUser from "components/[guild]/hooks/useUser"
import { SignedValidation, useSubmitWithSign } from "hooks/useSubmit"
import fetcher from "utils/fetcher"

const useLinkVaults = () => {
  const { id, mutate } = useUser()
  const { toast } = useToast()

  return useSubmitWithSign(
    (signedPayload: SignedValidation) =>
      fetcher(`/v2/users/${id}/addresses/delegations`, signedPayload),
    {
      onSuccess: (newAddresses) => {
        toast({
          variant: "success",
          description: "Successfully linked Delegate.cash vaults!",
        })
        mutate(
          (prev) => ({ ...prev, addresses: [...prev.addresses, ...newAddresses] }),
          { revalidate: false }
        )
      },
    }
  )
}

export default useLinkVaults
