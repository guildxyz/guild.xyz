import { Link, Tag, Wrap, WrapProps } from "@chakra-ui/react"
import { PropsWithChildren } from "react"
import { PlatformAccountDetails, PlatformType } from "types"
import {
  IdentityTag,
  PrivateSocialsTag,
  deduplicateXPlatformUsers,
} from "./Identities"

type Props = {
  platformUsers: PlatformAccountDetails[]
  isShared: boolean
  isOpen?: boolean
} & WrapProps

export const UserPlatformTags = ({
  platformUsers,
  isShared,
  isOpen = true,
  children,
  ...rest
}: PropsWithChildren<Props>) => {
  const filteredPlatformUsers = deduplicateXPlatformUsers(platformUsers)

  return (
    <Wrap {...rest}>
      {!isShared ? (
        <PrivateSocialsTag isOpen={isOpen} />
      ) : platformUsers.length ? (
        filteredPlatformUsers.map((platformAccount, i) => {
          const platformUrl = getPlatformUrl(platformAccount)

          return (
            <IdentityTag
              key={platformAccount.platformId}
              {...(platformUrl && {
                as: Link,
                textDecoration: "none !important", // variant: "unstyled" doesn't work for some reason
                isExternal: true,
                href: platformUrl,
                _hover: { opacity: 0.8 },
                pointerEvents: !isOpen && "none",
              })}
              platformAccount={platformAccount}
              fontWeight="semibold"
              zIndex={filteredPlatformUsers.length - i}
              isOpen={i === 0 || isOpen}
            />
          )
        })
      ) : (
        isOpen && <Tag>No connected socials</Tag>
      )}
      {children}
    </Wrap>
  )
}

const getPlatformUrl = (platformAccount: PlatformAccountDetails) => {
  const { username, platformUserId: userId, platformId } = platformAccount

  const platformUrls: Partial<Record<PlatformType, string | null>> = {
    [PlatformType.TWITTER]: username ? `https://x.com/${username}` : null,
    [PlatformType.TWITTER_V1]: username ? `https://x.com/${username}` : null,
    [PlatformType.GITHUB]: username ? `https://github.com/${username}` : null,
    [PlatformType.TELEGRAM]: username ? `https://t.me/${username}` : null,
    [PlatformType.DISCORD]: userId ? `https://discord.com/users/${userId}` : null,
    [PlatformType.GOOGLE]: username ? `mailto:${username}` : null,
  }

  return platformUrls[platformId]
}

export default UserPlatformTags
