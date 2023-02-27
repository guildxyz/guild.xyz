import useShowErrorToast from "hooks/useShowErrorToast"
import useSubmit from "hooks/useSubmit"
import { UseSubmitOptions } from "hooks/useSubmit/useSubmit"
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

  return fetch("/api/poap", {
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

const useCreatePoap = ({
  onSuccess,
}: UseSubmitOptions<CreatePoapForm & CreatedPoapData> = {}) => {
  const showErrorToast = useShowErrorToast()

  return useSubmit<CreatePoapForm, CreatePoapForm & CreatedPoapData>(fetchData, {
    onError: (error) => showErrorToast(error?.error?.message ?? error?.error),
    onSuccess,
  })
}

export default useCreatePoap
