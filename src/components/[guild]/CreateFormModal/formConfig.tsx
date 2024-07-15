import { Schemas } from "@guildxyz/types"
import OptionIcon from "components/common/StyledSelect/components/CustomSelectOption/components/OptionIcon"
import { ComponentType, ReactNode } from "react"
import { PiCheckSquare } from "react-icons/pi"
import { PiNumberCircleFive } from "react-icons/pi"
import { PiNumberSquareFive } from "react-icons/pi"
import { PiRadioButton } from "react-icons/pi"
import { PiTextbox } from "react-icons/pi"
import {
  ExpectedFieldDataProps,
  ExpectedMultipleChoiceDisplay,
  ExpectedRateDisplay,
  ExpectedStringDisplay,
} from "requirements/Form/components/ExpectedAnswerCard"
import { ExpectedMultipleChoice } from "requirements/Form/components/ExpectedAnswerRequirements/ExpectedMultipleChoice"
import ExpectedNumber from "requirements/Form/components/ExpectedAnswerRequirements/ExpectedNumber"
import ExpectedRate from "requirements/Form/components/ExpectedAnswerRequirements/ExpectedRate"
import ExpectedSingleChoice from "requirements/Form/components/ExpectedAnswerRequirements/ExpectedSingleChoice"
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
    img: <OptionIcon as={PiTextbox} />,
    DisplayComponent: ShortText,
    ExpectedAnswerComponent: ExpectedString,
    ExpectedAnswerDisplayComponent: ExpectedStringDisplay,
  },
  {
    label: "Long text",
    value: "LONG_TEXT",
    img: <OptionIcon as={PiTextbox} />,
    DisplayComponent: LongText,
    ExpectedAnswerComponent: ExpectedString,
    ExpectedAnswerDisplayComponent: ExpectedStringDisplay,
  },
  {
    label: "Number",
    value: "NUMBER",
    img: <OptionIcon as={PiNumberSquareFive} />,
    DisplayComponent: Number,
    ExpectedAnswerComponent: ExpectedNumber,
    ExpectedAnswerDisplayComponent: ExpectedStringDisplay,
  },
  {
    label: "Single choice",
    value: "SINGLE_CHOICE",
    img: <OptionIcon as={PiRadioButton} />,
    SetupComponent: ChoiceSetup,
    DisplayComponent: SingleChoice,
    ExpectedAnswerComponent: ExpectedSingleChoice,
    ExpectedAnswerDisplayComponent: ExpectedStringDisplay,
  },
  {
    label: "Multiple choice",
    value: "MULTIPLE_CHOICE",
    img: <OptionIcon as={PiCheckSquare} />,
    SetupComponent: ChoiceSetup,
    DisplayComponent: MultipleChoice,
    ExpectedAnswerComponent: ExpectedMultipleChoice,
    ExpectedAnswerDisplayComponent: ExpectedMultipleChoiceDisplay,
  },
  {
    label: "Rate",
    value: "RATE",
    img: <OptionIcon as={PiNumberCircleFive} />,
    SetupComponent: RateSetup,
    DisplayComponent: Rate,
    ExpectedAnswerComponent: ExpectedRate,
    ExpectedAnswerDisplayComponent: ExpectedRateDisplay,
  },
]

export { fieldTypes }
