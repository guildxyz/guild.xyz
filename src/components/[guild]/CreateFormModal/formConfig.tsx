import OptionIcon from "components/common/StyledSelect/components/CustomSelectOption/components/OptionIcon"
import {
  CheckSquare,
  NumberCircleFive,
  NumberSquareFive,
  RadioButton,
  Textbox,
} from "phosphor-react"
import { ComponentType, ReactNode } from "react"
import { CreateForm } from "../RolePlatforms/components/AddRoleRewardModal/components/AddFormPanel"
import Choice from "./components/Display/Choice"
import LongText from "./components/Display/LongText"
import Number from "./components/Display/Number"
import Rate from "./components/Display/Rate"
import ShortText from "./components/Display/ShortText"
import ChoiceSetup from "./components/Setup/ChoiceSetup"
import RateSetup from "./components/Setup/RateSetup"
import { Field } from "./schemas"

const fieldTypes: {
  label: string
  value: Field["type"]
  img: ReactNode
  SetupComponent?: ComponentType<{
    index: number
  }>
  DisplayComponent: ComponentType<{
    field: Field | CreateForm["fields"][number]
    isDisabled?: boolean
  }>
}[] = [
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
    SetupComponent: RateSetup,
    DisplayComponent: Rate,
  },
]

export { fieldTypes }
