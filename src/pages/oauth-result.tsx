/* eslint-disable @typescript-eslint/naming-convention */

import { Center, Heading, Text } from "@chakra-ui/react"
import { PlatformName } from "@guildxyz/types"
import { GetServerSideProps, NextPage } from "next"
import { useRouter } from "next/router"
import rewards from "platforms/rewards"
import { useEffect, useState } from "react"

export type OAuthResultParams =
  | {
      status: "success"
      platform: PlatformName
      path: string
    }
  | {
      status: "error"
      message: string
      platform?: PlatformName
      path?: string
    }

const OAuth: NextPage<OAuthResultParams> = (query) => {
  const { push } = useRouter()
  const [hasReceivedConfirmation, setHasReceivedConfirmation] = useState(false)

  useEffect(() => {
    let timeout: NodeJS.Timeout
    if (query.platform) {
      const channel = new BroadcastChannel(`guild-${query.platform}`)
      channel.onmessage = (event) => {
        if (
          event.isTrusted &&
          event.origin === window.origin &&
          event.data?.type === "oauth-confirmation"
        ) {
          setHasReceivedConfirmation(true)
          window.close()
          if (timeout) {
            clearTimeout(timeout)
          }
        }
      }

      channel.postMessage(query)
    }

    if ("path" in query) {
      timeout = setTimeout(() => {
        const params = new URLSearchParams({
          "oauth-platform": query.platform as string,
          "oauth-status": query.status as string,
          ...("message" in query ? { "oauth-message": query.message } : {}),
        }).toString()

        push(`${query.path}?${params}`)
      }, 1000)
    }
  }, [query, push])

  return (
    <Center flexDir={"column"} p="10" textAlign={"center"} h="90vh">
      <Heading size="md" mb="3">
        {query.status === "success"
          ? `${rewards[query.platform]?.name} successfully conneted!`
          : query.platform
          ? `${rewards[query.platform]?.name} connection failed`
          : "Connection unsuccessful"}
      </Heading>
      <Text>
        {query.status === "success"
          ? hasReceivedConfirmation
            ? "You may now close this window"
            : "Taking you back to Guild"
          : query.message}
      </Text>
    </Center>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => ({
  props: ctx.query,
})

export default OAuth
