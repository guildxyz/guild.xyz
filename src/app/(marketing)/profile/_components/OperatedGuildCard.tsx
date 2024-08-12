import { CheckMark } from "@/components/CheckMark"
import { FeaturedIcon } from "@/components/FeaturedIcon"
import { Avatar, AvatarFallback } from "@/components/ui/Avatar"
import { Card } from "@/components/ui/Card"
import { Skeleton } from "@/components/ui/Skeleton"
import { Icon } from "@phosphor-icons/react"
import {
  ArrowFatUp,
  Calendar,
  FolderSimpleUser,
  ShootingStar,
  Star,
  User,
} from "@phosphor-icons/react/dist/ssr"
import { AvatarImage } from "@radix-ui/react-avatar"
import Image from "next/image"
import { PropsWithChildren } from "react"

export const OperatedGuildCard = () => {
  return (
    <Card className="flex flex-col bg-gray-50 md:flex-row dark:bg-card">
      <div className="relative w-full border-border-muted p-6 max-md:border-b md:w-1/3 md:border-r">
        <div className="absolute inset-0 bg-black" />
        <Image
          className="absolute inset-0 size-full object-cover opacity-30"
          src="https://guild.xyz/_next/image?url=https%3A%2F%2Fguild-xyz.mypinata.cloud%2Fipfs%2FQmUo1uEc76KTmg1wJ52MJZNazcudPPY5HFMpLzTKLw9rL9&w=1080&q=75"
          alt="guild banner"
          width={419}
          height={233}
        />
        <div className="relative flex h-full flex-col items-center justify-center gap-3">
          <Avatar className="size-20 lg:size-24">
            <AvatarImage
              src="https://guild.xyz/_next/image?url=https%3A%2F%2Fguild-xyz.mypinata.cloud%2Fipfs%2FQmQXeY1ZEtnLGqFPuJ4RZthYz8nKdTLhLVxBRfHGXweamx&w=256&q=70"
              width={118}
              height={118}
              alt="guild image"
            />
            <AvatarFallback>
              <Skeleton className="size-full" />
            </AvatarFallback>
          </Avatar>
          <h3 className="text-center font-bold font-display text-lg text-white lg:text-xl">
            The Guilded Age Guild
            <CheckMark className="ml-2 inline-block size-6" />
            <FeaturedIcon className="ml-1 " />
          </h3>
        </div>
      </div>
      <div className="grid grow justify-stretch gap-2 p-5 sm:grid-cols-2">
        <OperatedGuildDetailCard Icon={User}>
          <EmphasizedData>123k</EmphasizedData>
          members
        </OperatedGuildDetailCard>
        <OperatedGuildDetailCard Icon={ArrowFatUp}>
          Avg level of members:
          <EmphasizedData>3.6</EmphasizedData>
        </OperatedGuildDetailCard>
        <OperatedGuildDetailCard Icon={FolderSimpleUser}>
          <EmphasizedData>13</EmphasizedData>
          roles
        </OperatedGuildDetailCard>
        <OperatedGuildDetailCard Icon={Star}>
          <EmphasizedData>20</EmphasizedData>
          rewards in total
        </OperatedGuildDetailCard>
        <OperatedGuildDetailCard Icon={ShootingStar}>
          In the top
          <EmphasizedData>5%</EmphasizedData>
          of guilds
        </OperatedGuildDetailCard>
        <OperatedGuildDetailCard Icon={Calendar}>
          Created
          <EmphasizedData>a year</EmphasizedData>
          ago
        </OperatedGuildDetailCard>
      </div>
    </Card>
  )
}

const OperatedGuildDetailCard = ({
  Icon,
  children,
}: PropsWithChildren<{ Icon: Icon }>) => (
  <Card className="flex items-center gap-2 rounded-xl p-4 font-bold shadow md:p-5 dark:bg-secondary">
    <Icon weight="bold" className="min-w-min" />
    <span className="text-muted-foreground">{children}</span>
  </Card>
)

const EmphasizedData = ({ children }: PropsWithChildren) => (
  <span className="font-black text-foreground"> {children} </span>
)
