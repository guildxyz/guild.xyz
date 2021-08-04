import useKeepSWRDataLiveAsBlocksArrive from "hooks/useKeepSWRDataLiveAsBlocksArrive"
import { useMemo } from "react"
import useSWR from "swr"

type MemberCountResponse = {
  id: number
  membersCount: number
}

type MemberCount = {
  sum?: number
  [levelId: string]: number
}

const getMemberCount = (_: string, id: number): Promise<MemberCountResponse[]> =>
  fetch(`https://api.agora.space/community/getMemberCount/${id}`).then((response) =>
    response.ok
      ? response.json()
      : Promise.reject(new Error(`Unable to fetch member count of community ${id}`))
  )

const useMemberCount = (communityId: number) => {
  const { data, mutate } = useSWR(["membercount", communityId], getMemberCount, {
    initialData: [],
  })

  const memberCountData = useMemo(() => {
    const levelsData: MemberCount = {}
    data.forEach(({ id, membersCount }) => {
      levelsData[id] = membersCount
      levelsData.sum = (levelsData.sum ?? 0) + membersCount
    })
    return levelsData
  }, [data])

  useKeepSWRDataLiveAsBlocksArrive(mutate)

  return memberCountData
}

export default useMemberCount
