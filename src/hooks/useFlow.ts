import useSWRImmutable from "swr/immutable"
import { useFetcherWithSign } from "utils/fetcher"
import useKeyPair from "./useKeyPair"

const JOB_DEFAULT_POLL_MS = 1000

type JobCreationResponse = { jobId: string }

type BaseJob = { id: string; done: boolean }

const useFlow = <
  Job extends BaseJob,
  Params extends Record<string, string> = Record<string, string>
>(
  path: string,
  body?: any,
  params?: Params,
  shouldFetch = true,
  { pollMs = JOB_DEFAULT_POLL_MS, creationPollMs = null as number } = {}
) => {
  const fetcherWithSign = useFetcherWithSign()
  const { isValid: hasValidKeypair } = useKeyPair()

  const { data: jobId, mutate: mutatejobId } = useSWRImmutable<string>(
    ["jobId", path, body, params],
    () => undefined,
    {
      revalidateOnMount: false,
    }
  )

  const setjobId = (data: string) => mutatejobId(data, { revalidate: false })

  const createJob = async () => {
    const { jobId: createdJobId }: JobCreationResponse = await fetcherWithSign([
      path,
      { method: "POST", body },
    ])
    await setjobId(createdJobId)
    console.log("CREATED", createdJobId)
    return createdJobId
  }

  const pollParams = new URLSearchParams(params).toString()

  const poll = useSWRImmutable(
    shouldFetch && hasValidKeypair
      ? [`${path}?${pollParams}`, { method: "GET" }]
      : null,
    (props) =>
      fetcherWithSign(props).then(async (result: Job[]) => {
        if (Array.isArray(result) && result.length > 0) {
          if (jobId?.length > 0) {
            const foundJob = result.find(({ id }) => id === jobId)
            if (foundJob?.done) {
              // TODO: check errors
              await setjobId(undefined) // To stop polling
            }
            if (foundJob) return foundJob
          }
          const nonDoneJob = result.find(({ done }) => !done)
          if (nonDoneJob) {
            await setjobId(nonDoneJob.id)
            return nonDoneJob
          }
        }

        await createJob()
        return null
      }),
    {
      onSuccess: (val) => console.log("POLL", val),
      refreshInterval: !!jobId ? pollMs : undefined,
    }
  )

  // This is also in SWR, to make sure it is only being polled once (if for example there are both captcha and polygonId requirements in a guild)
  useSWRImmutable(
    typeof creationPollMs === "number" ? ["jobId", path, body, params] : null,
    () => {
      if (!poll.data?.id) createJob()
      else console.log("SKIPPING CREATE POLL")
    },
    {
      revalidateOnMount: false,
      refreshInterval: creationPollMs,
    }
  )

  return { ...poll, mutate: () => createJob() }
}

export default useFlow
