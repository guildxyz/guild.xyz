import { useErrorToast } from "@/components/ui/hooks/useErrorToast"
import { useToast } from "@/components/ui/hooks/useToast"
import useUser from "components/[guild]/hooks/useUser"
import { useFetcherWithSign } from "hooks/useFetcherWithSign"
import useSubmit from "hooks/useSubmit/useSubmit"

const useEditSharedSocials = (guildId) => {
  const { id, mutate } = useUser()
  const showErrorToast = useErrorToast()
  const { toast } = useToast()
  const fetcherWithSign = useFetcherWithSign()

  const submit = (shareSocials) =>
    fetcherWithSign([
      `/v2/users/${id}/share-socials/${guildId}`,
      {
        method: "PUT",
        body: {
          shareSocials,
        },
      },
    ])

  const useSubmitProps = useSubmit(submit, {
    onSuccess: (response) => {
      toast({
        variant: "success",
        title: "Sharing status successfully updated",
      })
      mutate(
        (prevData) => {
          prevData.sharedSocials.find(
            (sharedSocial) => sharedSocial.guildId === response.guildId
          ).isShared = response.isShared

          return prevData
        },
        { revalidate: false }
      )
    },
    onError: (err) => showErrorToast(err),
  })

  return {
    ...useSubmitProps,
    submit,
  }
}

export default useEditSharedSocials
