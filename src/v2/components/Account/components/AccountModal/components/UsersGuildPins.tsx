import { AccountSectionTitle } from "@/components/Account/components/AccountModal/components/AccountSection"
import { accountModalAtom } from "@/components/Providers/atoms"
import { Badge } from "@/components/ui/Badge"
import { Skeleton } from "@/components/ui/Skeleton"
import useUsersGuildPins from "@/hooks/useUsersGuildPins"
import { useAtomValue, useSetAtom } from "jotai"
import Link from "next/link"

const UsersGuildPins = () => {
  const isAccountModalOpen = useAtomValue(accountModalAtom)
  const { data, error, isValidating } = useUsersGuildPins(!isAccountModalOpen)

  return (
    <>
      <AccountSectionTitle title="Guild Pins" />

      {/* TODO: custom Error component */}
      {/* {error && (
        <>
          <Alert status="warning" mb={3}>
            <AlertIcon /> There was an error while fetching your pins, some may not
            be visible.
          </Alert>
        </>
      )} */}

      <div
        className="invisible-scrollbar relative -mx-4 min-w-full overflow-x-auto"
        style={{
          maskImage:
            "linear-gradient(to right, transparent 0px, black 16px, black calc(100% - 16px), transparent)",
        }}
      >
        <div className="flex min-w-full px-4">
          {!isValidating ? (
            [...Array(3)].map((_, i) => <GuildPinSkeleton key={i} />)
          ) : data?.length ? (
            data.map((pin) => (
              <GuildPin
                key={pin.tokenId}
                image={pin.image}
                name={pin.name}
                guild={pin.attributes
                  .find((attribute) => attribute.trait_type === "guildId")
                  .value.toString()}
                rank={pin.attributes
                  .find((attribute) => attribute.trait_type === "rank")
                  .value.toString()}
              />
            ))
          ) : (
            <p className="text-sm">You haven't minted any Guild Pins yet</p>
          )}
        </div>
      </div>
    </>
  )
}

const GuildPin = ({
  name,
  image,
  guild,
  rank,
}: {
  name: string
  image: string
  guild: string
  rank: string
}) => {
  const setIsAccountModalOpen = useSetAtom(accountModalAtom)

  return (
    <Link
      href={`/${guild}`}
      onClick={() => setIsAccountModalOpen(false)}
      className="peer -ml-10 transition-transform first:ml-0 hover:scale-105 peer-hover:translate-x-8"
    >
      <div className="relative size-20 rounded-full border-2 border-card bg-card">
        <img src={image} alt={name} />

        <div className="absolute -bottom-1 left-1/2 flex -translate-x-1/2 rounded-lg border-2 border-card bg-card font-semibold">
          <Badge variant="secondary" size="sm">
            #{rank}
          </Badge>
        </div>
      </div>
    </Link>
  )
}

const GuildPinSkeleton = () => (
  <div className="relative -ml-10 size-20 rounded-full border-2 border-card bg-card first:ml-0">
    <Skeleton className="size-full rounded-full" />
  </div>
)

export { UsersGuildPins }
