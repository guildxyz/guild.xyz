import GoogleGuildSetup from "components/common/GoogleGuildSetup"
import { defaultValues } from "components/create-guild/CreateGuildContext"
import Pagination from "components/create-guild/Pagination"
import useIsConnected from "hooks/useIsConnected"
import { useRouter } from "next/router"
import { useEffect } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import { GuildFormType } from "types"

const CreateGuildGoogle = (): JSX.Element => {
  const router = useRouter()
  const isConnected = useIsConnected("GOOGLE")

  useEffect(() => {
    if (!isConnected) {
      router.replace("/create-guild")
    }
  }, [isConnected])

  const { control } = useFormContext<GuildFormType>()

  const selectedDocument = useWatch({
    control,
    name: "guildPlatforms.0.platformGuildId",
  })

  return (
    <>
      <GoogleGuildSetup
        defaultValues={defaultValues.GOOGLE}
        fieldNameBase="guildPlatforms.0."
        shouldSetName
        permissionField="roles.0.rolePlatforms.0.platformRoleData.role"
      />

      <Pagination nextButtonDisabled={!selectedDocument} />
    </>
  )
}

export default CreateGuildGoogle
