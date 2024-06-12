export default async function createAndAwaitJob<
  Job extends { done?: boolean; failed?: any; failedErrorMsg?: any }
>(
  fetcherWithSign: ([string, any]) => Promise<any>,
  url: string,
  body: any,
  queryParams: Record<string, any>
): Promise<Job> {
  const poll = (): Promise<Job[]> =>
    fetcherWithSign([
      `${url}?${new URLSearchParams(queryParams).toString()}`,
      { method: "GET" },
    ])

  const initialPollResult = await poll().catch(() => null as unknown as Job[])

  const jobAlreadyInProgress = initialPollResult?.find((job) => !job.done)

  if (!jobAlreadyInProgress) {
    await fetcherWithSign([url, { method: "POST", body }])
  }

  while (true) {
    const [job] = await poll()

    if (!job) {
      throw new Error("Job not found")
    }

    if (job.failed) {
      throw new Error(job.failedErrorMsg)
    }

    if (job.done) {
      return job
    }

    await new Promise((res) => setTimeout(res, 3000))
  }
}
