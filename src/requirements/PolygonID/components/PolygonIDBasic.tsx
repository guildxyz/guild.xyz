import { RequirementFormProps } from "requirements/types"
import PolygonIDProofAge from "./PolygonIDProofAge"

const PolygonIDBasic = ({ baseFieldPath }: RequirementFormProps) => (
  <PolygonIDProofAge baseFieldPath={baseFieldPath} />
)

export default PolygonIDBasic
