import useShowErrorToast from "components/create-guild/hooks/useShowErrorToast"
import useSWRSubmit from "components/index/hooks/useSWRSubmit"
import { useGuild } from "components/[guild]/Context"
import usePersonalSign from "hooks/usePersonalSign"
import useToast from "hooks/useToast"
import { useEffect } from "react"
import { useSWRConfig } from "swr"

const fetchEdit = async (
  _,
  addressSignedMessage: string,
  id: number,
  { themeColor, themeMode }
) => {
  console.log("asdd")
  return fetch(`${process.env.NEXT_PUBLIC_API}/community/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ addressSignedMessage, themeColor, themeMode }),
  })
}

const useEdit = (onClose: () => void, watch) => {
  const { mutate } = useSWRConfig()
  const toast = useToast()
  const showErrorToast = useShowErrorToast()
  const { addressSignedMessage } = usePersonalSign()
  const { id } = useGuild()
  const submitData = watch()

  // useEffect(() => {
  //   console.log(submitData)
  // }, [submitData])

  const shouldFetch = !!submitData?.themeColor && !!submitData?.themeMode

  useEffect(() => {
    console.log(shouldFetch)
  }, [shouldFetch])

  const { data, isLoading, onSubmit, error } = useSWRSubmit(
    shouldFetch ? ["edit", addressSignedMessage, id, submitData] : null,
    fetchEdit
  )

  const handleSuccess = () => {
    toast({
      title: `Guild successfully updated!`,
      status: "success",
      duration: 4000,
    })
    onClose()
    // temporary until there's no SWR for single guild data
    mutate("guilds")
  }

  const handleError = () => {
    if (!error) return
    if (error instanceof Error) showErrorToast(error.message)
    else showErrorToast(error.errors)
  }

  return {
    data,
    onSubmit: onSubmit(handleSuccess, handleError),
    isLoading,
  }
}

export default useEdit
