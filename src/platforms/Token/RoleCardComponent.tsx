import dynamic from "next/dynamic";

export const RoleCardComponent = dynamic(() => import("platforms/components/TokenReward"), {
  ssr: false,
})
