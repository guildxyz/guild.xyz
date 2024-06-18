import dynamic from "next/dynamic"

export const RoleCardComponent = dynamic(
  () => import("platforms/components/GatherReward"),
  {
    ssr: false,
  }
)
