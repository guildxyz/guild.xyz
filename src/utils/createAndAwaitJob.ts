export default async function createAndAwaitJob<
  Job extends { done?: boolean; error?: any; errorMsg?: any }
>(
  fetcherWithSign: ([string, any]) => Promise<any>,
  url: string,
  body: any,
  queryParams: Record<string, any>
) {
  const poll = (): Promise<Job[]> =>
    fetcherWithSign([
      `${url}?${new URLSearchParams(queryParams).toString()}`,
      { method: "GET" },
    ])

  const initialPollResult = await poll().catch(() => null as Job[])

  const jobAlreadyInProgress = initialPollResult?.find((job) => !job.done)

  if (!jobAlreadyInProgress) {
    await fetcherWithSign([url, { method: "POST", body }])
  }

  let interval: ReturnType<typeof setInterval>

  return new Promise<Job | null>((resolve, reject) => {
    interval = setInterval(() => {
      poll().then(([job = null]) => {
        if (!job) {
          reject(job)
          return // Return is needed, so TS knows, that after this point job is not null
        }
        if (!job.done) return

        if (job.error ?? job.errorMsg) reject(job)
        else resolve(job)
      })
    }, 3000)
  }).finally(() => {
    clearInterval(interval)
  })
}
