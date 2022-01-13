import useSWR from "swr"

const fallbackData = {
  ok: false,
  message: null,
}

const useIsTGBotIn = (groupId: string) => {
  const shouldFetch = groupId?.length >= 9

  const { data, isValidating } = useSWR(
    shouldFetch
      ? `/role/telegram/isIn/${groupId?.startsWith("-") ? groupId : `-${groupId}`}`
      : null,
    {
      fallbackData,
      refreshInterval: 5000,
    }
  )

  return { data, isLoading: isValidating }
}

export default useIsTGBotIn
