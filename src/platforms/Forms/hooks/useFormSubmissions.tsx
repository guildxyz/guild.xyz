import { Schemas } from "@guildxyz/types"
import useGuild from "components/[guild]/hooks/useGuild"
import useUser from "components/[guild]/hooks/useUser"
import useSWRWithOptionalAuth from "hooks/useSWRWithOptionalAuth"
import useSWRImmutable from "swr/immutable"
import { PlatformAccountDetails } from "types"
import { useFetcherWithSign } from "utils/fetcher"

type Response = {
  fieldId: string
  value: string
}

export type FormSubmission = {
  userId: number
  formId: number
  addresses: string[]
  platformUsers: PlatformAccountDetails[]
  createdAt: string
  areSocialsPrivate: boolean
  submissionAnswers: Response[]
}

const useFormSubmissions = (formId) => {
  const { id } = useGuild()

  const shouldFetch = id && formId

  return useSWRWithOptionalAuth<FormSubmission[]>(
    shouldFetch ? `/v2/guilds/${id}/forms/${formId}/user-submissions` : null
  )
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
