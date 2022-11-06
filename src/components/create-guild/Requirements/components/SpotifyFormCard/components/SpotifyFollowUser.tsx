import { FormControl, FormLabel, Input } from "@chakra-ui/react"
import useDebouncedState from "hooks/useDebouncedState"
import useGateables from "hooks/useGateables"
import { useEffect } from "react"
import { useController, useForm, useFormContext } from "react-hook-form"

type Props = {
  index: number
}

const LINK_REGEX =
  /^(?:https\:\/\/)?(?:www\.)?open\.spotify\.com\/user\/(.*?)(?:\?.*)?$/

const SpotifyFollowUser = ({ index }: Props) => {
  const { setValue } = useFormContext()

  const usernameForm = useForm({ mode: "all", defaultValues: { usernameInput: "" } })
  const { field } = useController({
    name: "usernameInput",
    control: usernameForm.control,
    rules: {
      required: "This field is required",
    },
  })

  const debouncedInputUsername = useDebouncedState(field.value)

  const { gateables, error } = useGateables("SPOTIFY", undefined, {
    id: debouncedInputUsername,
    type: "user",
  })

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

  useEffect(() => {
    if (error) {
      usernameForm.setError("usernameInput", { message: "Invalid username" })
    }
  }, [error])

  return (
    <>
      <FormControl>
        <FormLabel>Username or profile link</FormLabel>

        <Input
          value={field.value}
          onChange={(event) => {
            const usernameOrLink = event.target.value

            if (LINK_REGEX.test(usernameOrLink)) {
              field.onChange(usernameOrLink?.match?.(LINK_REGEX)?.[1] ?? "")
            } else {
              field.onChange(usernameOrLink)
            }
          }}
        />
      </FormControl>
    </>
  )
}

export default SpotifyFollowUser
