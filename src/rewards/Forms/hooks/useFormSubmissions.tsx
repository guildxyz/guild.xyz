import { Schemas } from "@guildxyz/types"
import { sortAccounts } from "components/[guild]/crm/Identities"
import useGuild from "components/[guild]/hooks/useGuild"
import useUser from "components/[guild]/hooks/useUser"
import { useFetcherWithSign } from "hooks/useFetcherWithSign"
import { useGetKeyForSWRWithOptionalAuth } from "hooks/useGetKeyForSWRWithOptionalAuth"
import { useCallback, useMemo } from "react"
import useSWRImmutable from "swr/immutable"
import useSWRInfinite from "swr/infinite"
import { PlatformAccountDetails } from "types"

type SubmissionAnswer = {
  fieldId: string
  value: string /*  | number | string[] */ // the BE sends everything as a string now, this might change in the future
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
  const getKeyForSWRWithOptionalAuth = useGetKeyForSWRWithOptionalAuth()

  const getKey = useCallback(
    (pageIndex, previousPageData) => {
      if (!id || !formId) return null

      if (previousPageData && previousPageData.length < LIMIT) return null

      const pagination = `offset=${pageIndex * LIMIT}&limit=${LIMIT}`

      return getKeyForSWRWithOptionalAuth(
        `/v2/guilds/${id}/forms/${formId}/user-submissions?${[
          queryString,
          pagination,
        ].join("&")}`
      )
    },
    [queryString, id, formId]
  )

  const { data, ...rest } = useSWRInfinite<FormSubmission[]>(
    getKey,
    (props) =>
      fetcherWithSign(props).then((res) =>
        res.map((user) => ({
          ...user,
          platformUsers: user.platformUsers.sort(sortAccounts),
          isShared: user.isShared === true || user.isShared === null,
          submissionAnswers: user.submissionAnswers.map((response) => {
            /**
             * Parsing arrays here, but users can start their text responses with "["
             * too, so added a try-catch here
             */
            if (response.value?.startsWith("[")) {
              try {
                return { ...response, value: JSON.parse(response.value) }
              } catch {
                return response
              }
            }

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
  const getKeyForSWRWithOptionalAuth = useGetKeyForSWRWithOptionalAuth()

  const { data, ...rest } = useSWRImmutable<FormSubmission>(
    !!form && !!id
      ? getKeyForSWRWithOptionalAuth(
          `/v2/guilds/${form.guildId}/forms/${form.id}/user-submissions/${id}`
        )
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
