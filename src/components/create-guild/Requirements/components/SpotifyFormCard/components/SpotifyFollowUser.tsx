import { Text } from "@chakra-ui/react"
import useGateables from "hooks/useGateables"
import { useEffect } from "react"
import { useFormContext } from "react-hook-form"

type Props = {
  index: number
}

const SpotifyFollowUser = ({ index }: Props) => {
  const { setValue } = useFormContext()

  const { gateables } = useGateables("SPOTIFY", undefined, { q: "", type: "user" })

  const user = gateables as any as {
    value: string
    label: string
    img?: string
    details?: string
  }

  useEffect(() => {
    if (user?.value) {
      setValue(`requirements.${index}.data.id`, user.value)
      setValue(`requirements.${index}.data.params.label`, user.value)
      if (user.img) {
        setValue(`requirements.${index}.data.params.img`, user.img)
      }
    }
  }, [user])

  return (
    <>
      <Text>Members need to follow you on Spotify to have access</Text>
    </>
  )
}

export default SpotifyFollowUser
