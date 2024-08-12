import { Avatar, AvatarImage } from "@/components/ui/Avatar"
import { Card } from "@/components/ui/Card"
import { useColorModeValue } from "@chakra-ui/react"
import { useMintGuildPinContext } from "components/[guild]/Requirements/components/GuildCheckout/MintGuildPinContext"
import useGuild from "components/[guild]/hooks/useGuild"
import useGuildPermission from "components/[guild]/hooks/useGuildPermission"
import dynamic from "next/dynamic"

const DynamicMintGuildPin = dynamic(
  () =>
    import("components/[guild]/Requirements/components/GuildCheckout/MintGuildPin")
)
const DynamicMintFuelGuildPin = dynamic(
  () =>
    import(
      "components/[guild]/Requirements/components/GuildCheckout/MintGuildPin/Fuel/MintFuelGuildPin"
    )
)

const GuildPinRewardCard = () => {
  const bgFile = useColorModeValue("bg_light.svg", "bg.svg")

  const { isAdmin } = useGuildPermission()
  const { guildPin } = useGuild()

  const { isInvalidImage, isTooSmallImage } = useMintGuildPinContext()

  return (
    <Card className="relative flex flex-col justify-between bg-card-secondary p-5 sm:p-6">
      <div className="absolute inset-0 bg-[length:140%] bg-[top_7px_right_7px] bg-[url('/landing/bg_light.svg')] bg-no-repeat opacity-[0.07] dark:bg-[url('/landing/bg.svg')]" />
      <div className="absolute inset-0 bg-gradient-to-tr from-70% from-card-secondary to-transparent" />
      <div className="relative mb-5 flex items-center gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-image">
          <Avatar>
            <AvatarImage
              src="/img/guild-pin-key-3d.svg"
              alt="Guild pin"
              width={40}
              height={40}
            />
          </Avatar>
        </div>

        <div className="flex flex-col">
          <span className="font-bold">Guild Pin</span>
          <span className="text-muted-foreground text-sm">
            {!guildPin?.isActive
              ? "Mintable badge of membership"
              : "Onchain badge that shows your support and belonging to this community."}
          </span>
        </div>
      </div>
      {(!(isInvalidImage || isTooSmallImage) || isAdmin) &&
        (guildPin?.chain !== "FUEL" ? (
          <DynamicMintGuildPin />
        ) : (
          <DynamicMintFuelGuildPin />
        ))}
    </Card>
  )
}

export default GuildPinRewardCard
