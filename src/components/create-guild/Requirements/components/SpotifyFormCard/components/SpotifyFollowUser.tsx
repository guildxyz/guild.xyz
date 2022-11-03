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

  useEffect(() => {
    setValue(`requirements.${index}.data.type`, "user")
  }, [])

  useEffect(() => {
    if (gateables?.[0]) {
      setValue(`requirements.${index}.data.id`, gateables[0].value)
      setValue(`requirements.${index}.data.params.label`, gateables[0].value)
      if (gateables[0].img) {
        setValue(`requirements.${index}.data.params.img`, gateables[0].img)
      }
    }
  }, [gateables])

  return (
    <>
      <Text>Members need to follow you on Spotify to have access</Text>
    </>
  )
}

export default SpotifyFollowUser
