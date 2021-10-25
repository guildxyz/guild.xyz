import replacer from "components/common/utils/guildJsonReplacer"
import { useGuild } from "components/[guild]/Context"
import { useHall } from "components/[hall]/Context"
import usePersonalSign from "hooks/usePersonalSign"
import useShowErrorToast from "hooks/useShowErrorToast"
import useSubmit from "hooks/useSubmit"
import useToast from "hooks/useToast"
import { useRouter } from "next/router"
import { useSWRConfig } from "swr"

type Data = {
  themeMode: string
  themeColor: string
}

const useEdit = (onClose?: () => void) => {
  const hall = useHall()
  const guild = useGuild()
  const { mutate } = useSWRConfig()
  const toast = useToast()
  const showErrorToast = useShowErrorToast()
  const { addressSignedMessage } = usePersonalSign()
  const router = useRouter()

  const submit = (data: Data) =>
    fetch(
      `${process.env.NEXT_PUBLIC_API}/${hall ? "group" : "guild"}/${
        hall?.id || guild?.id
      }`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          { addressSignedMessage, ...data },
          guild ? replacer : undefined
        ),
      }
    )

  return useSubmit<Data, any>(submit, {
    onSuccess: () => {
      toast({
        title: `${hall ? "Hall" : "Guild"} successfully updated!`,
        status: "success",
      })
      if (onClose) onClose()
      mutate([hall ? "hall" : "guild", hall?.urlName || guild?.urlName])
      router.push(`${hall ? "/" : "/guild/"}${hall?.urlName || guild?.urlName}`)
    },
    onError: (error) => showErrorToast(error),
  })
}

export default useEdit
