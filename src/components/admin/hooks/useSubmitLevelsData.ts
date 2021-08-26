import { useRouter } from "next/router"
import type { FormData, Level } from "pages/[community]/admin/community"
import convertMonthsToMs from "../utils/convertMonthsToMs"
import { ContextType, SignEvent } from "../utils/submitMachine"
import useCommunityData from "./useCommunityData"
import useSubmitMachine from "./useSubmitMachine"

// Replacing specific values in the JSON with undefined, so we won't send them to the API
const replacer = (key, value) => {
  if (
    key === "isDCEnabled" ||
    key === "isTGEnabled" ||
    value === null ||
    Number.isNaN(value)
  )
    return undefined
  return value
}

const useSubmitLevelsData = (
  method: "POST" | "PATCH" // | "DELETE",
) => {
  const router = useRouter()
  const { communityData } = useCommunityData()

  const fetchService = (
    _context: ContextType,
    { data }: SignEvent<FormData & { levels: Level[] }>
  ) => {
    if (method === "POST" && communityData?.id)
      return fetch(
        `${process.env.NEXT_PUBLIC_API}/community/levels/${communityData?.id}`,
        {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...data }, replacer),
        }
      )
    const { addressSignedMessage } = data
    const { levelUpdatePromises, levelsToCreate } = data.levels.reduce(
      (
        acc: {
          levelUpdatePromises: Promise<Response>[]
          levelsToCreate: Partial<Level>[]
        },
        level
      ) => {
        if (level.id) {
          // Already existing levels need to be updated
          const { id } = level
          const payload = level
          // Don't need IDs for PATCH
          delete payload.id
          delete payload.tokenSymbol

          acc.levelUpdatePromises.push(
            fetch(`${process.env.NEXT_PUBLIC_API}/community/level/${id}`, {
              method,
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                ...payload,
                addressSignedMessage,
              }),
            })
          )
          return acc
        }
        // New levels should be created
        acc.levelsToCreate.push(level)
        return acc
      },
      {
        levelUpdatePromises: [],
        levelsToCreate: [],
      }
    )

    const promises = levelUpdatePromises
    if (levelsToCreate.length > 0)
      promises.push(
        fetch(
          `${process.env.NEXT_PUBLIC_API}/community/levels/${communityData?.id}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              levels: levelsToCreate,
              addressSignedMessage,
            }),
          }
        )
      )

    return Promise.all(promises)
  }

  const redirectAction = () =>
    fetch(`/api/preview?urlName=${communityData?.urlName}`)
      .then((res) => res.json())
      .then((cookies: string[]) => {
        cookies.forEach((cookie: string) => {
          document.cookie = cookie
        })

        router.push(`/${communityData?.urlName}/community`)
      })

  const preprocess = (_data: FormData) => {
    const data = _data
    data.levels?.forEach((level, i) => {
      if (!level.stakeTimelockMs) return
      const timeLock = level.stakeTimelockMs as number
      data[i].stakeTimelockMs = convertMonthsToMs(timeLock).toString()
    })
    return data
  }

  return useSubmitMachine<FormData>(
    "Level(s) added! It might take up to 10 sec for the page to update. If it's showing old data, try to refresh it in a few seconds.",
    fetchService,
    redirectAction,
    preprocess
  )
}

export default useSubmitLevelsData
