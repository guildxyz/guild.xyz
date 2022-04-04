import { FormControl, Input } from "@chakra-ui/react"
import { useRumAction, useRumError } from "@datadog/rum-react-integration"
import FormErrorMessage from "components/common/FormErrorMessage"
import React, { useEffect, useRef } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import { GuildFormType } from "types"
import slugify from "utils/slugify"

const FORBIDDEN_NAMES = [
  "404",
  "index",
  "dcauth",
  "create-guild",
  "guild",
  "hall",
  "halls",
  "role",
  "roles",
  "guide",
]

const CreateGuildName = (): JSX.Element => {
  const addDatadogAction = useRumAction("trackingAppAction")
  const addDatadogError = useRumError()

  const inputRef = useRef<HTMLInputElement | null>()
  const {
    control,
    register,
    setValue,
    formState: { errors },
  } = useFormContext<GuildFormType>()

  const name = useWatch({ control: control, name: "name" })

  useEffect(() => {
    if (name) setValue("urlName", slugify(name.toString()))
  }, [name])

  const urlName = useWatch({ name: "urlName" })

  const {
    ref,
    onBlur: defaultOnBlur,
    ...rest
  } = register("name", {
    required: "This field is required.",
    maxLength: {
      value: 50,
      message: "The maximum possible name length is 50 characters",
    },
    validate: () =>
      !FORBIDDEN_NAMES.includes(urlName) || "Please pick a different name",
  })

  const onBlur = (e) => {
    defaultOnBlur(e)
    if (e.target.value) addDatadogAction("Typed in guild name")
  }

  useEffect(() => {
    if (!errors.name) return
    addDatadogError("Guild name error", { error: errors.name }, "custom")
  }, [errors.name])

  return (
    <FormControl isRequired isInvalid={!!errors?.name}>
      <Input
        size="lg"
        maxWidth="sm"
        {...rest}
        ref={(e) => {
          inputRef.current = e
          ref(e)
        }}
        onBlur={onBlur}
      />
      <FormErrorMessage>{errors?.name?.message}</FormErrorMessage>
    </FormControl>
  )
}

export default CreateGuildName
