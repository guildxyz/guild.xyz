import type { ActivityLogAction } from "components/[guild]/activity/constants"
import useSWRImmutable from "swr/immutable"
import { useProfile } from "./useProfile"

// interface Activity {
//     "id": "284498239",
//     "action": "update profile",
//     "correlationId": "dd06e144-9526-4394-8179-c5e80f61fd0e",
//     "service": "backend",
//     "timestamp": "1723184457982",
//     "before": {
//         "username": "iambatman",
//         "name": "super_shady_shadow_programm",
//         "bio": "and soono"
//     },
//     "data": {
//         "username": "iambatman",
//         "name": "super_shady_shadow_programm",
//         "bio": "and soono"
//     },
//     "ids": {
//         "user": 5935934
//         "guild": 72877
//     }
// }

export const useActivity = () => {
  const { data: profile } = useProfile()
  return useSWRImmutable<ActivityLogAction[]>(
    profile?.username ? `/v2/profiles/${profile.username}/activity` : null
  )
}
