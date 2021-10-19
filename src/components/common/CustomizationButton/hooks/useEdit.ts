import replacer from "components/common/utils/guildJsonReplacer"
import { useGroup } from "components/[group]/Context"
import { useGuild } from "components/[guild]/Context"
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
  const group = useGroup()
  const guild = useGuild()
  const { mutate } = useSWRConfig()
  const toast = useToast()
  const showErrorToast = useShowErrorToast()
  const { addressSignedMessage } = usePersonalSign()
  const router = useRouter()

  const submit = (data: Data) =>
    fetch(
      `${process.env.NEXT_PUBLIC_API}/${group ? "group" : "guild"}/${
        group?.id || guild?.id
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
        title: `${group ? "Group" : "Guild"} successfully updated!`,
        status: "success",
      })
      if (onClose) onClose()
      mutate([group ? "group" : "guild", group?.id || guild?.id])
      router.push(`${group ? "/" : "/guild/"}${group?.urlName || guild?.urlName}`)
    },
    onError: (error) => showErrorToast(error),
  })
}

export default useEdit
