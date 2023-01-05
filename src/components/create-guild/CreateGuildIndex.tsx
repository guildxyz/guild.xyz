import PlatformsGrid from "components/create-guild/PlatformsGrid"
import { useRouter } from "next/router"

const CreateGuildIndex = (): JSX.Element => {
  const router = useRouter()

  return (
    <PlatformsGrid
      onSelection={(selectedPlatform) =>
        router.push(`/create-guild/${selectedPlatform.toLowerCase()}`)
      }
    />
  )
}

export default CreateGuildIndex
