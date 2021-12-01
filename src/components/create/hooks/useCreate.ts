import replacer from "components/common/utils/guildJsonReplacer"
import useJsConfetti from "hooks/useJsConfetti"
import useShowErrorToast from "hooks/useShowErrorToast"
import { useSubmitWithSign } from "hooks/useSubmit"
import useToast from "hooks/useToast"
import useUploadImage from "hooks/useUploadImage"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { useSWRConfig } from "swr"
import { Guild, Requirement } from "temporaryData/types"

const useCreate = () => {
  const { mutate } = useSWRConfig()
  const toast = useToast()
  const showErrorToast = useShowErrorToast()
  const triggerConfetti = useJsConfetti()
  const router = useRouter()
  const [data, setData] = useState<Guild>()

  const preprocessRequirements = (requirements: Array<Requirement>) => {
    if (!requirements || !Array.isArray(requirements)) return []

    return requirements.map((requirement) => {
      const mappedRequirement = {} as Requirement

      for (const [key, value] of Object.entries(requirement)) {
        // Mapping "interval" field to "value" prop
        if (
          requirement.type === "ERC721" &&
          key === "interval" &&
          Array.isArray(value)
        ) {
          mappedRequirement.value = value
        }

        // Mapping "strategyParams" field to "value" prop
        if (requirement.type === "SNAPSHOT" && key === "strategyParams" && value) {
          mappedRequirement.value = value
        }

        if (!["interval", "strategyParams"].includes(key))
          mappedRequirement[key] = value
      }

      return mappedRequirement
    })
  }

  const fetchData = (data_: Guild): Promise<Guild> =>
    fetch(`${process.env.NEXT_PUBLIC_API}/guild`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(
        {
          ...data_,
          requirements: preprocessRequirements(data_?.requirements),
        },
        replacer
      ),
    }).then(async (response) =>
      response.ok ? response.json() : Promise.reject(await response.json?.())
    )

  const { onSubmit, response, error, isLoading } = useSubmitWithSign<Guild, Guild>(
    fetchData,
    {
      onError: (error_) => showErrorToast(error_),
      onSuccess: (response_) => {
        triggerConfetti()
        toast({
          title: `Guild successfully created!`,
          description: "You're being redirected to it's page",
          status: "success",
        })
        // refetch halls to include the new one on the home page
        mutate("/group")
        router.push(`/${response_.urlName}`)
      },
    }
  )

  const {
    onSubmit: onSubmitImage,
    response: imageResponse,
    error: imageError,
    isLoading: isImageLoading,
  } = useUploadImage()

  useEffect(() => {
    if (imageResponse?.publicUrl)
      onSubmit({
        ...data,
        imageUrl: imageResponse.publicUrl,
      })
  }, [imageResponse])

  return {
    onSubmit: (_data) => {
      if (_data.customImage?.length) {
        setData(_data)
        onSubmitImage(_data.customImage)
      } else onSubmit(_data)
    },
    error: error || imageError,
    isImageLoading,
    isLoading,
    response,
  }
}

export default useCreate
