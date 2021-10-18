export const fetchGroup = (urlName: string) =>
  fetch(`${process.env.NEXT_PUBLIC_API}/group/urlName/${urlName}`).then(
    (response: Response) => (response.ok ? response.json() : undefined)
  )
