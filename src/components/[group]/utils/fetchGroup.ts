import { Group } from "temporaryData/types"

export const fetchGroup = (urlName: string): Promise<Group> =>
  fetch(`${process.env.NEXT_PUBLIC_API}/group/urlName/${urlName}`).then(
    (response: Response) => (response.ok ? response.json() : undefined)
  )
