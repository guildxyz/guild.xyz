import { Divider, FormControl, FormLabel, Input } from "@chakra-ui/react"
import FormErrorMessage from "components/common/FormErrorMessage"
import ReconnectAlert from "components/common/ReconnectAlert"
import useGateables from "hooks/useGateables"
import { Controller, useFormContext, useFormState } from "react-hook-form"
import parseFromObject from "utils/parseFromObject"
import ServerPicker from "./ServerPicker"

type Props = {
  baseFieldPath: string
}

const DiscordMemberSince = ({ baseFieldPath }: Props): JSX.Element => {
  const { errors } = useFormState()
  const { control } = useFormContext()
  const { error } = useGateables("DISCORD")

  return (
    <>
      <ServerPicker baseFieldPath={baseFieldPath} />

      <FormControl
        isRequired
        isInvalid={!!parseFromObject(errors, baseFieldPath)?.data?.memberSince}
      >
        <FormLabel>Joined server before</FormLabel>

        <Controller
          control={control}
          name={`${baseFieldPath}.data.memberSince`}
          defaultValue={null}
          rules={{
            required: "This field is required.",
          }}
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <Input
              type="date"
              ref={ref}
              onBlur={onBlur}
              onChange={(e) => {
                const valueAsTimestamp = new Date(e.target.value).getTime()
                onChange(valueAsTimestamp)
              }}
              value={
                value && !isNaN(value)
                  ? new Date(value).toISOString().split("T")[0]
                  : ""
              }
              max={new Date().toISOString().split("T")[0]}
            />
          )}
        />

        <FormErrorMessage>
          {parseFromObject(errors, baseFieldPath).data?.memberSince?.message}
        </FormErrorMessage>
      </FormControl>

      {error && (
        <>
          <Divider />
          <ReconnectAlert platformName="DISCORD" />
        </>
      )}
    </>
  )
}

export default DiscordMemberSince
