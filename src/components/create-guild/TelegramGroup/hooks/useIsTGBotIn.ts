import useSWR, { SWRConfiguration } from "swr"

const fallbackData = {
  ok: false,
  message: null,
  groupName: "",
  groupIcon: null,
}

const useIsTGBotIn = (groupId: string, swrConfig?: SWRConfiguration) => {
  const shouldFetch = groupId?.length >= 9

  const { data, isValidating } = useSWR(
    shouldFetch
      ? `/telegram/group/${groupId?.startsWith("-") ? groupId : `-${groupId}`}`
      : null,
    {
      fallbackData,
      revalidateOnFocus: false,
      ...swrConfig,
    }
  )

  return { data, isValidating }
}

export default useIsTGBotIn
