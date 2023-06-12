import { MutableRefObject } from "react"
import RoleCard from "./RoleCard"

export type RoleCardCollapseProps = {
  descriptionRef: MutableRefObject<HTMLDivElement>
  initialRequirementsRef: MutableRefObject<HTMLDivElement>
  isExpanded: boolean
  onToggleExpanded: () => void
}

export default RoleCard
