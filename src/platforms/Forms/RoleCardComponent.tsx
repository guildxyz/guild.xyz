import dynamic from "next/dynamic"

export const RoleCardComponent = dynamic(
  () => import("platforms/components/FormReward"),
  {
    ssr: false,
  }
)
