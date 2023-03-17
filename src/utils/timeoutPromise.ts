const timeoutPromise = <T>(promise: Promise<T>, ms = 1500) =>
  Promise.race([
    promise,
    new Promise((_resolve, reject) => {
      setTimeout(() => {
        reject(new Error("Timed out"))
      }, ms)
    }),
  ])

export default timeoutPromise
