import { FormControl, FormLabel } from "@chakra-ui/react"
import FormErrorMessage from "components/common/FormErrorMessage"
import { ControlledTimestampInput } from "components/common/TimestampInput"
import { useFormState } from "react-hook-form"
import { RequirementFormProps } from "requirements"
import parseFromObject from "utils/parseFromObject"
import SpaceSelect from "./SpaceSelect"

const FollowSince = ({ baseFieldPath }: RequirementFormProps): JSX.Element => {
  const { errors } = useFormState()

  return (
    <>
      <SpaceSelect baseFieldPath={baseFieldPath} />

      <FormControl
        isRequired
        isInvalid={!!parseFromObject(errors, baseFieldPath)?.data?.since}
      >
        <FormLabel>Follow since</FormLabel>

        <ControlledTimestampInput
          fieldName={`${baseFieldPath}.data.since`}
          isRequired
        />

        <FormErrorMessage>
          {parseFromObject(errors, baseFieldPath).data?.since?.message}
        </FormErrorMessage>
      </FormControl>
    </>
  )
}

export default FollowSince
