import useJsConfetti from "components/create-guild/hooks/useJsConfetti"
import processConnectorError from "components/[guild]/JoinModal/utils/processConnectorError"
import useDatadog from "components/_app/Datadog/useDatadog"
import useMatchMutate from "hooks/useMatchMutate"
import useShowErrorToast from "hooks/useShowErrorToast"
import { SignedValdation, useSubmitWithSign } from "hooks/useSubmit"
import useToast from "hooks/useToast"
import { useRouter } from "next/router"
import { Guild, PlatformType } from "types"
import fetcher, { useFetcherWithSign } from "utils/fetcher"
import replacer from "utils/guildJsonReplacer"

const useCreateGuild = () => {
  const { addDatadogAction, addDatadogError } = useDatadog()
  const matchMutate = useMatchMutate()

  const toast = useToast()
  const showErrorToast = useShowErrorToast()
  const triggerConfetti = useJsConfetti()
  const router = useRouter()

  const fetcherWithSign = useFetcherWithSign()

  const fetchData = async (signedValidation: SignedValdation): Promise<Guild> =>
    fetcher("/guild", signedValidation)

  const useSubmitResponse = useSubmitWithSign<Guild>(fetchData, {
    onError: (error_) => {
      addDatadogError(`Guild creation error`, { error: error_ })

      const processedError = processConnectorError(error_)
      showErrorToast(processedError || error_)
    },
    onSuccess: (response_) => {
      addDatadogAction(`Successful guild creation`)
      triggerConfetti()

      toast({
        title: `Guild successfully created!`,
        description: "You're being redirected to its page",
        status: "success",
      })
      router.push(`/${response_.urlName}`)

      if (response_.guildPlatforms[0]?.platformId === PlatformType.DISCORD)
        fetcherWithSign(`/statusUpdate/guildify/${response_.id}?force=true`, {
          body: {
            notifyUsers: false,
          },
        })

      matchMutate(/^\/guild\/address\//)
      matchMutate(/^\/guild\?order/)
    },
  })

  return {
    ...useSubmitResponse,
    onSubmit: (data) =>
      useSubmitResponse.onSubmit(JSON.parse(JSON.stringify(data, replacer))),
  }
}

export default useCreateGuild
