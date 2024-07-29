import dynamic from "next/dynamic"
import { RewardComponentMap, RoleCard } from "./types"

export const RoleCards = {
  GATHER_TOWN: dynamic(() => import("rewards/components/GatherReward"), {
    ssr: false,
  }),
  POLYGON_ID: dynamic(() => import("rewards/components/PolygonIDReward"), {
    ssr: false,
  }),
  ERC20: dynamic(() => import("rewards/components/TokenReward"), {
    ssr: false,
  }),
  POAP: dynamic(() => import("rewards/components/PoapReward"), {
    ssr: false,
  }),
  POINTS: dynamic(() => import("rewards/components/PointsReward"), {
    ssr: false,
  }),
  UNIQUE_TEXT: dynamic(() => import("rewards/components/TextReward"), {
    ssr: false,
  }),
  TEXT: dynamic(() => import("rewards/components/TextReward"), {
    ssr: false,
  }),
  FORM: dynamic(() => import("rewards/components/FormReward"), {
    ssr: false,
  }),
  CONTRACT_CALL: dynamic(() => import("rewards/ContractCall/ContractCallReward"), {
    ssr: false,
  }),
} as const satisfies RewardComponentMap<RoleCard>
