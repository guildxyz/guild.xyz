import { useSubmitWithSign } from "hooks/useSubmit"
import { useRouter } from "next/router"
import { useEffect, useMemo, useState } from "react"
import useSWR from "swr"
import { Guild } from "types"

const useGuild = () => {
  const router = useRouter()

  const { isSigning, onSubmit, response } = useSubmitWithSign(
    async ({ validation }) => ({
      method: "POST",
      validation,
      timestamp: Date.now(),
      body: {},
    })
  )

  const { data: validation, mutate: mutateValidation } = useSWR(
    "guildValidation",
    () => undefined,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      refreshInterval: 0,
      revalidateOnMount: false,
      revalidateOnReconnect: false,
    }
  )

  useEffect(() => {
    if (response) mutateValidation(response, { revalidate: false })
  }, [response, mutateValidation])

  const [prevGuild, setPrevGuild] = useState<Guild>(undefined)

  const endpoint = validation
    ? `/guild/details/${router.query.guild}`
    : `/guild/${router.query.guild}`

  const { data, isValidating, error } = useSWR<Guild>(
    router.query.guild ? [endpoint, validation] : null,
    null,
    validation
      ? {
          refreshInterval: 0,
          revalidateOnFocus: false,
          revalidateOnReconnect: false,
          revalidateIfStale: false,
          revalidateOnMount: true,
          fallbackData: prevGuild,
        }
      : {
          revalidateOnMount: true,
          fallbackData: prevGuild,
        }
  )

  useEffect(() => {
    if (data) setPrevGuild(data)
  }, [data])

  const fetchedAsOwner = useMemo(
    () => !!data && data !== prevGuild && !error && !!validation,
    [data, error, validation] // Do not include prevGuild, as it would "cancel" the true value when it gets the "admin guild"
  )

  return {
    ...(data ?? prevGuild),
    isSigning,
    isLoading: isValidating,
    fetchAsOwner: () => onSubmit(),
    fetchedAsOwner,
  }
}

export default useGuild
