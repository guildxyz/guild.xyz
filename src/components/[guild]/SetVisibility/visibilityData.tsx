import { Option } from "components/common/RadioSelect/RadioSelect"
import { Detective, EyeSlash, GlobeHemisphereEast, IconProps } from "phosphor-react"
import { Visibility } from "types"
import PrivateVisibilityOptions from "./components/PrivateVisibilityOptions"

export const VISIBILITY_DATA: Record<
  Visibility,
  Partial<Option> & {
    title: string
    Icon: React.ForwardRefExoticComponent<
      IconProps & React.RefAttributes<SVGSVGElement>
    >
    Child?: typeof PrivateVisibilityOptions
  }
> = {
  [Visibility.PUBLIC]: {
    title: "Public",
    Icon: GlobeHemisphereEast,
    description: "Visible to everyone",
  },
  [Visibility.PRIVATE]: {
    title: "Secret",
    Icon: Detective,
    description: "Only visible to users that satisfy...",
    Child: PrivateVisibilityOptions,
  },
  [Visibility.HIDDEN]: {
    title: "Hidden",
    Icon: EyeSlash,
    description: "Only visible to admins",
  },
}
