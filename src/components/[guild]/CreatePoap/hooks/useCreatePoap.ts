import useJsConfetti from "components/create-guild/hooks/useJsConfetti"
import useShowErrorToast from "hooks/useShowErrorToast"
import useSubmit from "hooks/useSubmit"
import useToast from "hooks/useToast"
import { CreatedPoapData, CreatePoapForm } from "types"

const fetchData = async (data: CreatePoapForm) => {
  const formData = new FormData()

  const extendedData = {
    ...data,
    year: new Date().getFullYear(),
  }

  if (!extendedData?.end_date) extendedData.end_date = extendedData.start_date

  for (const key in extendedData) {
    if (key === "image") formData.append("image", extendedData[key])
    else formData.append(key, extendedData[key]?.toString() || "")
  }

  return fetch("/api/create-poap", {
    method: "POST",
    body: formData,
    headers: {
      Accept: "application/json",
    },
  }).then(async (response) => {
    const res = await response.json?.()
    return response.ok ? res : Promise.reject(res)
  })
}

const useCreatePoap = () => {
  const toast = useToast()
  const showErrorToast = useShowErrorToast()
  const triggerConfetti = useJsConfetti()

  return useSubmit<CreatePoapForm, CreatePoapForm & CreatedPoapData>(fetchData, {
    onError: (error) => showErrorToast(error),
    onSuccess: () => {
      triggerConfetti()
      toast({
        title: "Successful POAP creation!",
        status: "success",
      })
    },
  })
}

export default useCreatePoap
