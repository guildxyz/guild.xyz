import { Divider, FormControl, FormLabel } from "@chakra-ui/react"
import FormErrorMessage from "components/common/FormErrorMessage"
import ReconnectAlert from "components/common/ReconnectAlert"
import ControlledTimestampInput from "components/common/TimestampInput"
import useGateables from "hooks/useGateables"
import { useFormState } from "react-hook-form"
import { PlatformType } from "types"
import parseFromObject from "utils/parseFromObject"
import ServerPicker from "./ServerPicker"

type Props = {
  baseFieldPath: string
}

const DiscordMemberSince = ({ baseFieldPath }: Props): JSX.Element => {
  const { errors } = useFormState()
  const { error } = useGateables(PlatformType.DISCORD)

  return (
    <>
      <ServerPicker baseFieldPath={baseFieldPath} />

      <FormControl
        isRequired
        isInvalid={!!parseFromObject(errors, baseFieldPath)?.data?.memberSince}
      >
        <FormLabel>Joined server before</FormLabel>

        <ControlledTimestampInput
          fieldName={`${baseFieldPath}.data.memberSince`}
          isRequired
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
