import OptionIcon from "components/common/StyledSelect/components/CustomSelectOption/components/OptionIcon"
import {
  CheckSquare,
  NumberCircleFive,
  NumberSquareFive,
  RadioButton,
  Textbox,
} from "phosphor-react"
import { ComponentType } from "react"
import { SelectOption } from "types"
import Choice from "./components/Display/Choice"
import LongText from "./components/Display/LongText"
import Number from "./components/Display/Number"
import ShortText from "./components/Display/ShortText"
import ChoiceSetup from "./components/Setup/ChoiceSetup"
import { CreateFieldParams, Field } from "./schemas"

const fieldTypes: (SelectOption<Field["type"]> & {
  SetupComponent?: ComponentType<{
    index: number
  }>
  DisplayComponent: ComponentType<{
    field: CreateFieldParams
    isDisabled?: boolean
  }>
})[] = [
  {
    label: "Short text",
    value: "SHORT_TEXT",
    img: <OptionIcon as={Textbox} />,
    DisplayComponent: ShortText,
  },
  {
    label: "Long text",
    value: "LONG_TEXT",
    img: <OptionIcon as={Textbox} />,
    DisplayComponent: LongText,
  },
  {
    label: "Number",
    value: "NUMBER",
    img: <OptionIcon as={NumberSquareFive} />,
    DisplayComponent: Number,
  },
  {
    label: "Single choice",
    value: "SINGLE_CHOICE",
    img: <OptionIcon as={RadioButton} />,
    SetupComponent: ChoiceSetup,
    DisplayComponent: Choice,
  },
  {
    label: "Multiple choice",
    value: "MULTIPLE_CHOICE",
    img: <OptionIcon as={CheckSquare} />,
    SetupComponent: ChoiceSetup,
    DisplayComponent: Choice,
  },
  {
    label: "Rate",
    value: "RATE",
    img: <OptionIcon as={NumberCircleFive} />,
    EditableComponent: () => <>TODO</>,
    DisplayComponent: () => <>TODO</>,
  },
]

export { fieldTypes }
