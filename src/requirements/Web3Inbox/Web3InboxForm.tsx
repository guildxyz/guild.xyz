import {
  FormControl,
  FormLabel,
  InputGroup,
  InputLeftElement,
} from "@chakra-ui/react"
import ControlledSelect from "components/common/ControlledSelect"
import FormErrorMessage from "components/common/FormErrorMessage"
import OptionImage from "components/common/StyledSelect/components/CustomSelectOption/components/OptionImage"
import { useFormState, useWatch } from "react-hook-form"
import { RequirementFormProps } from "requirements/types"
import parseFromObject from "utils/parseFromObject"
import { APP_DETAILS, WEB3INBOX_APPS } from "./constants"

const Web3InboxForm = ({ baseFieldPath }: RequirementFormProps) => {
  const { errors } = useFormState()
  const app: (typeof WEB3INBOX_APPS)[number] = useWatch({
    name: `${baseFieldPath}.data.app`,
  })

  return (
    <FormControl
      isRequired
      isInvalid={parseFromObject(errors, baseFieldPath)?.data?.app}
    >
      <FormLabel>Subscribe to app:</FormLabel>
      <InputGroup>
        {app && (
          <InputLeftElement>
            <OptionImage img={APP_DETAILS[app].image} alt={APP_DETAILS[app].name} />
          </InputLeftElement>
        )}
        <ControlledSelect
          name={`${baseFieldPath}.data.app`}
          rules={{
            required: "This field is required.",
          }}
          options={WEB3INBOX_APPS.map((appID) => ({
            value: appID,
            label: APP_DETAILS[appID].name,
            img: APP_DETAILS[appID].image,
          }))}
        />
      </InputGroup>
      <FormErrorMessage>
        {parseFromObject(errors, baseFieldPath)?.data?.app?.message}
      </FormErrorMessage>
    </FormControl>
  )
}

export default Web3InboxForm
