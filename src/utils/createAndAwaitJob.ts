export default async function createAndAwaitJob<
  Job extends { done?: boolean; error?: any; errorMsg?: any }
>(
  fetcherWithSign: ([string, any]) => Promise<any>,
  url: string,
  body: any,
  queryParams: Record<string, any>
) {
  await fetcherWithSign([url, { method: "POST", body }])

  let interval: ReturnType<typeof setInterval>

  return new Promise<Job | null>((resolve, reject) => {
    interval = setInterval(() => {
      fetcherWithSign([
        `${url}?${new URLSearchParams(queryParams).toString()}`,
        { method: "GET" },
      ]).then(([job = null]) => {
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
