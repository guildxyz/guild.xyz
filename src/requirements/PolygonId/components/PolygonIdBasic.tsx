import { RequirementFormProps } from "requirements"
import PolygonIdProofAge from "./PolygonIdProofAge"

const PolygonIdBasic = ({ baseFieldPath }: RequirementFormProps) => (
  <PolygonIdProofAge baseFieldPath={baseFieldPath} />
)

export default PolygonIdBasic
