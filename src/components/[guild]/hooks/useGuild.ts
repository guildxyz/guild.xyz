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
  const { data, isValidating } = useSWR<Guild>(
    router.query.guild ? [`/guild/${router.query.guild}`, validation] : null,
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
    () =>
      data?.roles?.some((role) =>
        role?.requirements.some(
          (req) =>
            req.type === "WHITELIST" &&
            req?.data?.hideWhitelist &&
            req?.data?.addresses?.length > 0
        )
      ),
    [data]
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
