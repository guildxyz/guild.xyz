import { RequirementType } from "requirements/types"
import { PlatformName } from "types"

export type JoinForm = { shareSocials?: boolean }

type ExtractPrefix<T> = T extends `${infer Prefix}_${string}` ? Prefix : T
export type Joinable = PlatformName | ExtractPrefix<RequirementType>
