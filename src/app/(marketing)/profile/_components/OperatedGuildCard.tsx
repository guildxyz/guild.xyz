import { CheckMark } from "@/components/CheckMark"
import { Avatar, AvatarFallback } from "@/components/ui/Avatar"
import { Card } from "@/components/ui/Card"
import { Skeleton } from "@/components/ui/Skeleton"
import {
  ArrowFatUp,
  Calendar,
  FolderSimpleUser,
  Icon,
  ShootingStar,
  Star,
} from "@phosphor-icons/react"
import { User } from "@phosphor-icons/react/dist/ssr"
import { AvatarImage } from "@radix-ui/react-avatar"
import { Separator } from "@radix-ui/react-separator"
import Image from "next/image"
import { PropsWithChildren } from "react"

export const OperatedGuildCard = () => {
  return (
    <Card className="flex flex-col md:flex-row">
      <div className="relative w-full px-4 py-8 md:w-1/3">
        <div className="absolute inset-0 bg-black" />
        <Image
          className="absolute inset-0 size-full object-cover opacity-30"
          src="https://guild.xyz/_next/image?url=https%3A%2F%2Fguild-xyz.mypinata.cloud%2Fipfs%2FQmUo1uEc76KTmg1wJ52MJZNazcudPPY5HFMpLzTKLw9rL9&w=1080&q=75"
          alt="guild banner"
          width={419}
          height={233}
        />
        <div className="relative flex h-full flex-col items-center justify-center gap-3">
          <Avatar size="3xl">
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
          <h3 className="text-center font-bold font-display text-xl">
            The Guilded Age Guild
            <CheckMark className="ml-2 inline-block size-6" />
          </h3>
        </div>
      </div>
      <Separator orientation="vertical" className="bg-border-muted" />
      <div className="grid grow justify-stretch gap-2 p-5 md:grid-cols-2">
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
  <Card className="flex items-center gap-2 rounded-xl bg-secondary p-5 font-bold">
    <Icon weight="bold" className="min-w-min" />
    <span className="text-muted-foreground">{children}</span>
  </Card>
)

const EmphasizedData = ({ children }: PropsWithChildren) => (
  <span className="font-black text-foreground"> {children} </span>
)
