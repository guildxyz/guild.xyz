import useUser from "components/[guild]/hooks/useUser"
import useShowErrorToast from "hooks/useShowErrorToast"
import useSubmit from "hooks/useSubmit/useSubmit"
import useToast from "hooks/useToast"
import { useFetcherWithSign } from "utils/fetcher"

const useEditSharedSocials = (guildId) => {
  const { id, mutate } = useUser()
  const showErrorToast = useShowErrorToast()
  const toast = useToast()
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
        status: "success",
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
