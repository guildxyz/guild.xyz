import useGuild from "components/[guild]/hooks/useGuild"
import { useFetcherWithSign } from "hooks/useFetcherWithSign"
import useSubmit from "hooks/useSubmit"
import { useRouter } from "next/router"
import useContestEntries from "./useContestEntries"

type UseCreateEntryProps = {
  img: string
}

export default function useCreateEntry() {
  const router = useRouter()
  const { id } = useGuild()
  const fetcherWithSign = useFetcherWithSign()
  const { mutate } = useContestEntries()

  return useSubmit<UseCreateEntryProps, unknown>(
    async (props) => {
      if (!props || !router.query.contestId) {
        return
      }

      await fetcherWithSign([
        `/v2/guilds/${id}/contests/${router.query.contestId}/entry`,
        {
          method: "POST",
          body: {
            imageUrl: props.img,
          },
        },
      ])
    },
    { onSuccess: () => mutate() }
  )
}
