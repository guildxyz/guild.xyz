import { Visibility } from "@guildxyz/types"
import { Option } from "components/common/RadioSelect/RadioSelect"
import {
  IconProps,
  PiDetective,
  PiEyeSlash,
  PiGlobeHemisphereEast,
} from "react-icons/pi"
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
  PUBLIC: {
    title: "Public",
    Icon: PiGlobeHemisphereEast,
    description: "Visible to everyone",
  },
  PRIVATE: {
    title: "Secret",
    Icon: Detectiveve,
    description: "Only visible to users that satisfy...",
    Child: PrivateVisibilityOptions,
  },
  HIDDEN: {
    title: "Hidden",
    Icon: PiDetective,
    description: "Only visible to admins",
  },
}
