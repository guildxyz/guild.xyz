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
import LongText from "./components/Display/LongText"
import MultipleChoice from "./components/Display/MultipleChoice"
import Number from "./components/Display/Number"
import ShortText from "./components/Display/ShortText"
import SingleChoice from "./components/Display/SingleChoice"
import MultipleChoiceSetup from "./components/Setup/MultipleChoiceSetup"
import SingleChoiceSetup from "./components/Setup/SingleChoiceSetup"
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
    SetupComponent: SingleChoiceSetup,
    DisplayComponent: SingleChoice,
  },
  {
    label: "Multiple choice",
    value: "MULTIPLE_CHOICE",
    img: <OptionIcon as={CheckSquare} />,
    SetupComponent: MultipleChoiceSetup,
    DisplayComponent: MultipleChoice,
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
