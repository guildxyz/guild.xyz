import { getRandomInt } from "components/create-guild/IconSelector/IconSelector"
import { Dispatch, SetStateAction, useEffect } from "react"
import { useFormContext, useFormState, useWatch } from "react-hook-form"
import pinataUpload from "utils/pinataUpload"

const GUILD_LOGO_REGEX = /^\/guildLogos\/[0-9]+\.svg$/

const useSetImageAndNameFromPlatformData = (
  platformImage: string,
  platformName: string,
  setUploadPromise: Dispatch<SetStateAction<Promise<void>>>
) => {
  const { setValue } = useFormContext()
  const { touchedFields } = useFormState()
  const imageUrl = useWatch({ name: "imageUrl" })

  useEffect(() => {
    if (!!touchedFields.name || !platformName || platformName.length <= 0) return
    setValue("name", platformName, { shouldValidate: true })
  }, [platformName])

  useEffect(() => {
    if (touchedFields.imageUrl) return
    if (!platformImage || platformImage.length <= 0) {
      if (!GUILD_LOGO_REGEX.test(imageUrl)) {
        // The image has been set by us (by invite or group id paste)
        setValue("imageUrl", `/guildLogos/${getRandomInt(286)}.svg`)
      }
      return
    }
    setValue("imageUrl", platformImage)
    setUploadPromise(
      fetch(platformImage)
        .then((response) => response.blob())
        .then((blob) =>
          pinataUpload({
            data: [new File([blob], `${platformName}.png`, { type: "image/png" })],
          })
            .then(({ IpfsHash }) => {
              setValue(
                "imageUrl",
                `${process.env.NEXT_PUBLIC_IPFS_GATEWAY}${IpfsHash}`
              )
            })
            .catch(() => {
              setValue("imageUrl", `/guildLogos/${getRandomInt(286)}.svg`)
            })
        )
    )
  }, [platformImage])
}

export default useSetImageAndNameFromPlatformData
