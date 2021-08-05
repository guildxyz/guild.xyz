import { LevelIndicatorState } from "../Level/hooks/useLevelIndicatorState"

type LevelState = {
  isDisabled: boolean
  element: HTMLElement
  state?: LevelIndicatorState
}

export default LevelState
