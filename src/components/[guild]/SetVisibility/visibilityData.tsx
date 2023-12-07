import { Option } from "components/common/RadioSelect/RadioSelect"
import { Detective, EyeSlash, GlobeHemisphereEast, IconProps } from "phosphor-react"
import { Visibility } from "types"
import PrivateVisibilityOptions from "./components/PrivateVisibilityOptions"
import VisibilityTag from "./components/VisibilityTag"

export const VISIBILITY_DATA: Record<
  Visibility,
  Partial<Option> & {
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

export const VISIBILITY_DATA_BASED_ON_ROLE_VISIBILITY: Record<
  Exclude<Visibility, "HIDDEN">,
  Partial<Record<Exclude<Visibility, "PUBLIC">, Partial<Option>>>
> = {
  [Visibility.PUBLIC]: {
    [Visibility.PRIVATE]: {
      tooltipLabel: (
        <>
          Make the role <VisibilityTag visibility={Visibility.PUBLIC} /> first.{" "}
          Requirements and rewards can't be{" "}
          <VisibilityTag visibility={Visibility.PUBLIC} /> in a{" "}
          <VisibilityTag visibility={Visibility.PRIVATE} /> role
        </>
      ),
      disabled: true,
    },
    [Visibility.HIDDEN]: {
      tooltipLabel: (
        <>
          Make the role <VisibilityTag visibility={Visibility.PUBLIC} /> first.{" "}
          Requirements and rewards can't be{" "}
          <VisibilityTag visibility={Visibility.PUBLIC} /> in a{" "}
          <VisibilityTag visibility={Visibility.HIDDEN} /> role
        </>
      ),
      disabled: true,
    },
  },
  [Visibility.PRIVATE]: {
    [Visibility.HIDDEN]: {
      tooltipLabel: (
        <>
          Make the role <VisibilityTag visibility={Visibility.PRIVATE} /> first.
          Requirements and rewards can't be{" "}
          <VisibilityTag visibility={Visibility.PRIVATE} /> in a{" "}
          <VisibilityTag visibility={Visibility.HIDDEN} /> role
        </>
      ),
      disabled: true,
    },
  },
}
