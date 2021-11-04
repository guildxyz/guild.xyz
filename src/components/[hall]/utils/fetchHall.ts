import { Hall } from "temporaryData/types"

export const fetchHall = (_, urlName: string): Promise<Hall> =>
  fetch(`${process.env.NEXT_PUBLIC_API}/group/urlName/${urlName}`).then(
    (response: Response) => (response.ok ? response.json() : undefined)
  )
