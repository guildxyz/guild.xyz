import { Alert, AlertDescription, AlertIcon, chakra } from "@chakra-ui/react"
import { RequirementFormProps } from "requirements"
import MinMaxAmount from "requirements/common/MinMaxAmount"

const TwitterMinimumCount = ({ baseFieldPath, field }: RequirementFormProps) => (
  <>
    <Alert status="info">
      <AlertIcon />
      <AlertDescription>
        X <chakra.span opacity={0.5}>(formerly Twitter)</chakra.span> authentication
        limits to about 450 requests every 15 minutes. Users may need to wait if this
        threshold is exceeded.
      </AlertDescription>
    </Alert>

    <MinMaxAmount
      field={field}
      baseFieldPath={baseFieldPath}
      format="INT"
      hideSetMaxButton
    />
  </>
)

export default TwitterMinimumCount
