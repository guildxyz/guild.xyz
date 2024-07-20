import { Schemas } from "@guildxyz/types"
import {
  CheckSquare,
  NumberCircleFive,
  NumberSquareFive,
  RadioButton,
  Textbox,
} from "@phosphor-icons/react"
import OptionIcon from "components/common/StyledSelect/components/CustomSelectOption/components/OptionIcon"
import { ComponentType, ReactNode } from "react"
import {
  ExpectedMultipleChoiceDisplay,
  ExpectedRateDisplay,
  ExpectedStringDisplay,
} from "requirements/Form/components/ExpectedAnswerCardDisplay"
import { ExpectedMultipleChoice } from "requirements/Form/components/ExpectedAnswerRequirements/ExpectedMultipleChoice"
import ExpectedNumber from "requirements/Form/components/ExpectedAnswerRequirements/ExpectedNumber"
import ExpectedRate from "requirements/Form/components/ExpectedAnswerRequirements/ExpectedRate"
import ExpectedSingleChoice from "requirements/Form/components/ExpectedAnswerRequirements/ExpectedSingleChoice"
import { ExpectedFieldDataProps } from "requirements/Form/components/types"
import ExpectedString from "../../../requirements/Form/components/ExpectedAnswerRequirements/ExpectedString"
import { CreateForm } from "../RolePlatforms/components/AddRoleRewardModal/components/AddFormPanel"
import { MultipleChoice, SingleChoice } from "./components/Display/Choice"
import LongText from "./components/Display/LongText"
import Number from "./components/Display/Number"
import Rate from "./components/Display/Rate"
import ShortText from "./components/Display/ShortText"
import ChoiceSetup from "./components/Setup/ChoiceSetup"
import RateSetup from "./components/Setup/RateSetup"

// TODO: use dynamic imports so end users don't have to download the setup components
const fieldTypes: {
  label: string
  value: Schemas["Field"]["type"]
  img: ReactNode
  SetupComponent?: ComponentType<{
    index: number
  }>
  DisplayComponent: ComponentType<{
    field: Schemas["Field"] | CreateForm["fields"][number]
    isDisabled?: boolean
    value?: any
  }>
  ExpectedAnswerComponent?: ComponentType<{ field: Schemas["Field"] }>
  ExpectedAnswerDisplayComponent?: ComponentType<ExpectedFieldDataProps>
}[] = [
  {
    label: "Short text",
    value: "SHORT_TEXT",
    img: <OptionIcon as={Textbox} />,
    DisplayComponent: ShortText,
    ExpectedAnswerComponent: ExpectedString,
    ExpectedAnswerDisplayComponent: ExpectedStringDisplay,
  },
  {
    label: "Long text",
    value: "LONG_TEXT",
    img: <OptionIcon as={Textbox} />,
    DisplayComponent: LongText,
    ExpectedAnswerComponent: ExpectedString,
    ExpectedAnswerDisplayComponent: ExpectedStringDisplay,
  },
  {
    label: "Number",
    value: "NUMBER",
    img: <OptionIcon as={NumberSquareFive} />,
    DisplayComponent: Number,
    ExpectedAnswerComponent: ExpectedNumber,
    ExpectedAnswerDisplayComponent: ExpectedStringDisplay,
  },
  {
    label: "Single choice",
    value: "SINGLE_CHOICE",
    img: <OptionIcon as={RadioButton} />,
    SetupComponent: ChoiceSetup,
    DisplayComponent: SingleChoice,
    ExpectedAnswerComponent: ExpectedSingleChoice,
    ExpectedAnswerDisplayComponent: ExpectedStringDisplay,
  },
  {
    label: "Multiple choice",
    value: "MULTIPLE_CHOICE",
    img: <OptionIcon as={CheckSquare} />,
    SetupComponent: ChoiceSetup,
    DisplayComponent: MultipleChoice,
    ExpectedAnswerComponent: ExpectedMultipleChoice,
    ExpectedAnswerDisplayComponent: ExpectedMultipleChoiceDisplay,
  },
  {
    label: "Rate",
    value: "RATE",
    img: <OptionIcon as={NumberCircleFive} />,
    SetupComponent: RateSetup,
    DisplayComponent: Rate,
    ExpectedAnswerComponent: ExpectedRate,
    ExpectedAnswerDisplayComponent: ExpectedRateDisplay,
  },
]

export { fieldTypes }
