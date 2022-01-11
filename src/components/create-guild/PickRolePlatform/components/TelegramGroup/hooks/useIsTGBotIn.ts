import useSWR from "swr"

const fallbackData = {
  ok: false,
  message: "",
}

const useIsTGBotIn = (groupId: string) => {
  const shouldFetch = groupId?.length >= 9

  const { data, isValidating } = useSWR(
    shouldFetch ? `/telegram/isIn/${groupId}` : null,
    {
      fallbackData,
    }
  )

  return { data, isLoading: isValidating }
}

export default useIsTGBotIn
