import { CheckMark } from "@/components/CheckMark"
import { Avatar, AvatarFallback } from "@/components/ui/Avatar"
import { Card } from "@/components/ui/Card"
import { Skeleton } from "@/components/ui/Skeleton"
import { User } from "@phosphor-icons/react/dist/ssr"
import { AvatarImage } from "@radix-ui/react-avatar"
import Image from "next/image"

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
      <div className="grid grow justify-stretch gap-2 px-6 py-5 md:grid-cols-2">
        {Array.from({ length: 6 }, (_, i) => (
          <Card
            className="flex items-center gap-2 bg-secondary p-5 font-extrabold text-lg"
            key={i}
          >
            <User weight="bold" className="min-w-min" />
            123k
            <span className="text-muted-foreground">members</span>
          </Card>
        ))}
      </div>
    </Card>
  )
}
