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
} & WrapProps

export const UserPlatformTags = ({
  platformUsers,
  isShared,
  children,
  ...rest
}: PropsWithChildren<Props>) => {
  const filteredPlatformUsers = deduplicateXPlatformUsers(platformUsers)

  return (
    <Wrap {...rest}>
      {!isShared ? (
        <PrivateSocialsTag isOpen />
      ) : platformUsers.length ? (
        filteredPlatformUsers.map((platformAccount, i) => {
          const platformUrl = getPlatformUrl(platformAccount)

          return (
            <LinkWrappedTag url={platformUrl} key={platformAccount.platformId}>
              <IdentityTag
                platformAccount={platformAccount}
                fontWeight="semibold"
                isOpen
              />
            </LinkWrappedTag>
          )
        })
      ) : (
        <Tag>No connected socials</Tag>
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

const LinkWrappedTag = ({ url, children }) =>
  !!url ? (
    <Link variant="unstyled" isExternal href={url} _hover={{ opacity: 0.8 }}>
      {children}
    </Link>
  ) : (
    <>{children}</>
  )

export default UserPlatformTags
