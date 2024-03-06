import {
  Alert,
  AlertDescription,
  AlertIcon,
  FormControl,
  FormLabel,
  chakra,
} from "@chakra-ui/react"
import FormErrorMessage from "components/common/FormErrorMessage"
import { ControlledRelativeTimeInput } from "components/common/RelativeTimeInput"
import { useFormState } from "react-hook-form"
import parseFromObject from "utils/parseFromObject"
import { RequirementFormProps } from "../../index"

const TwitterAccountAgeRelative = ({
  baseFieldPath,
}: RequirementFormProps): JSX.Element => {
  const { errors } = useFormState()

  return (
    <>
      <Alert status="info">
        <AlertIcon />
        <AlertDescription>
          X <chakra.span opacity={0.5}>(formerly Twitter)</chakra.span>{" "}
          authentication limits to about 450 requests every 15 minutes. Users may
          need to wait if this threshold is exceeded.
        </AlertDescription>
      </Alert>
      <FormControl
        isRequired
        isInvalid={!!parseFromObject(errors, baseFieldPath)?.data?.minAmount}
      >
        <FormLabel>Minimum account age</FormLabel>

        <ControlledRelativeTimeInput
          fieldName={`${baseFieldPath}.data.minAmount`}
          isRequired
        />

        <FormErrorMessage>
          {parseFromObject(errors, baseFieldPath).data?.minAmount?.message}
        </FormErrorMessage>
      </FormControl>
    </>
  )
}

export default TwitterAccountAgeRelative
