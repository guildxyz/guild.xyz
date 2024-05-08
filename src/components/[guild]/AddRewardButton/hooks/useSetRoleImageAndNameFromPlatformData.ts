import {
  RoleTypeToAddTo,
  useAddRewardContext,
} from "components/[guild]/AddRewardContext"
import usePinata from "hooks/usePinata/usePinata"
import { useEffect } from "react"
import { useFormContext } from "react-hook-form"

const useSetRoleImageAndNameFromPlatformData = (
  platformImage: string,
  platformName: string
) => {
  const { activeTab } = useAddRewardContext()

  const { setValue } = useFormContext()

  const { onUpload } = usePinata({
    fieldToSetOnSuccess: "imageUrl",
  })

  useEffect(() => {
    if (activeTab !== RoleTypeToAddTo.NEW_ROLE || !(platformName?.length > 0)) return

    setValue("name", platformName)
  }, [activeTab, platformName, setValue])

  useEffect(() => {
    if (activeTab !== RoleTypeToAddTo.NEW_ROLE || !(platformImage?.length > 0))
      return

    fetch(platformImage)
      .then((response) => response.blob())
      .then((blob) =>
        onUpload({
          data: [new File([blob], `${platformName}.png`, { type: "image/png" })],
        })
      )
  }, [activeTab, platformImage, platformName, onUpload])
}

export default useSetRoleImageAndNameFromPlatformData
