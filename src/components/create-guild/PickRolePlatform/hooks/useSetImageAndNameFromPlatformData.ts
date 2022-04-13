import { useBlockedSubmit } from "components/_app/BlockedSubmit"
import { useRouter } from "next/router"
import { useEffect, useMemo } from "react"
import { useFormContext, useFormState } from "react-hook-form"
import getRandomInt from "utils/getRandomInt"
import pinataUpload from "utils/pinataUpload"

const useSetImageAndNameFromPlatformData = (
  platformImage: string,
  platformName: string
) => {
  const { setValue } = useFormContext()
  const { touchedFields } = useFormState()

  const router = useRouter()

  const blockerKey = useMemo(
    () => (router.asPath.includes("guard") ? "guardSetup" : "createGuild"),
    [router]
  )

  const { setPromise } = useBlockedSubmit(blockerKey)

  useEffect(() => {
    if (!(platformName?.length > 0) || !!touchedFields.name) return

    setValue("name", platformName)
  }, [platformName])

  useEffect(() => {
    if (!(platformImage?.length > 0) || !!touchedFields.imageUrl) {
      setValue("imageUrl", `/guildLogos/${getRandomInt(286)}.svg`)
      return
    }

    setValue("imageUrl", platformImage)
    setPromise(
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
