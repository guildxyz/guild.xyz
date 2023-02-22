import { Collapse } from "@chakra-ui/react"
import ErrorAlert from "components/common/ErrorAlert"

type Props = {
  error: string
}

const ErrorCollapse = ({ error }: Props): JSX.Element => (
  <Collapse
    in={!!error}
    style={{
      width: "100%",
    }}
  >
    <ErrorAlert label={error} />
  </Collapse>
)

export default ErrorCollapse
