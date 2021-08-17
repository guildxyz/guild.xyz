import useKeepSWRDataLiveAsBlocksArrive from "hooks/useKeepSWRDataLiveAsBlocksArrive"
import useSWR from "swr"
import { Level } from "temporaryData/types"

type MemberCount = {
  sum?: number
  [levelId: string]: number
}

const getMemberCount = (_: string, id: number): Promise<MemberCount> =>
  fetch(`https://api.agora.space/community/getMemberCount/${id}`)
    .then((response) =>
      response.ok
        ? response.json()
        : Promise.reject(
            new Error(`Unable to fetch member count of community ${id}`)
          )
    )
    .then((data) => {
      const levelsData: MemberCount = { sum: 0 }
      data.forEach(({ id: levelId, membersCount }) => {
        levelsData[levelId] = membersCount
        levelsData.sum += membersCount
      })
      return levelsData
    })

const useMemberCount = (communityId: number, initialLevels: Level[]) => {
  // the mocked communities from tokens.json have negative ids
  const shouldFetch = communityId >= 0

  const { data, mutate } = useSWR(
    shouldFetch ? ["membercount", communityId] : null,
    getMemberCount,
    {
      initialData: {
        sum: initialLevels.reduce((acc, curr) => acc + curr.membersCount, 0),
        ...Object.fromEntries(
          initialLevels.map(({ id, membersCount }) => [id, membersCount])
        ),
      },
    }
  )

  useKeepSWRDataLiveAsBlocksArrive(mutate)

  return data
}

export default useMemberCount
