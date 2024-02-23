import { Schemas } from "@guildxyz/types"
import { sortAccounts } from "components/[guild]/crm/Identities"
import useGuild from "components/[guild]/hooks/useGuild"
import useUser from "components/[guild]/hooks/useUser"
import { useCallback, useMemo } from "react"
import useSWRImmutable from "swr/immutable"
import useSWRInfinite from "swr/infinite"
import { PlatformAccountDetails } from "types"
import { useFetcherWithSign } from "utils/fetcher"

type SubmissionAnswer = {
  fieldId: string
  value: string | number | string[]
}

export type FormSubmission = {
  userId: number
  formId: number
  addresses: string[]
  platformUsers: PlatformAccountDetails[]
  isShared: boolean
  submittedAt: string
  submissionAnswers: SubmissionAnswer[]
}

const LIMIT = 50

const useFormSubmissions = (formId, queryString) => {
  const { id } = useGuild()
  const fetcherWithSign = useFetcherWithSign()

  const getKey = useCallback(
    (pageIndex, previousPageData) => {
      if (!id || !formId) return null

      if (previousPageData && previousPageData.length < LIMIT) return null

      const pagination = `offset=${pageIndex * LIMIT}&limit=${LIMIT}`

      return `/v2/guilds/${id}/forms/${formId}/user-submissions?${[
        queryString,
        pagination,
      ].join("&")}`
    },
    [queryString, id, formId]
  )

  const { data, ...rest } = useSWRInfinite<FormSubmission[]>(
    getKey,
    (url: string) =>
      fetcherWithSign([
        url,
        {
          method: "GET",
          body: {},
        },
      ]).then((res) =>
        res.map((user) => ({
          ...user,
          platformUsers: user.platformUsers.sort(sortAccounts),
          isShared: user.isShared === true || user.isShared === null,
          submissionAnswers: user.submissionAnswers.map((response) => {
            if (response.value.startsWith("["))
              return { ...response, value: JSON.parse(response.value) }

            return response
          }),
        }))
      ),
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateFirstPage: false,
      revalidateOnMount: true,
      keepPreviousData: true,
    }
  )

  const flattenedData = useMemo(() => data?.flat(), [data])

  return { data: flattenedData, ...rest }
}

const useUserFormSubmission = (form: Schemas["Form"]) => {
  const { id } = useUser()
  const fetcherWithSign = useFetcherWithSign()

  const { data, ...rest } = useSWRImmutable<FormSubmission>(
    !!form && !!id
      ? [
          `/v2/guilds/${form.guildId}/forms/${form.id}/user-submissions/${id}`,
          { method: "GET", body: {} },
        ]
      : null,
    fetcherWithSign,
    {
      shouldRetryOnError: false,
    }
  )

  return {
    userSubmission: data,
    ...rest,
  }
}

export default useFormSubmissions
export { useUserFormSubmission }
