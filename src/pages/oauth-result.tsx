/* eslint-disable @typescript-eslint/naming-convention */

import { Center, Heading, Text } from "@chakra-ui/react"
import { PlatformName } from "@guildxyz/types"
import { GetServerSideProps, NextPage } from "next"
import { useRouter } from "next/router"
import platforms from "platforms/platforms"
import { useEffect } from "react"

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
    }

const OAuth: NextPage<OAuthResultParams> = (query) => {
  const router = useRouter()

  useEffect(() => {
    if (query.platform && !!window.opener) {
      const channel = new BroadcastChannel(`guild-${query.platform}`)
      channel.postMessage(query)
      window.close()
      return
    } else if (query.status === "success") {
      router.push(query.path)
      return
    }
  }, [])

  return (
    <Center flexDir={"column"} p="10" textAlign={"center"} h="90vh">
      <Heading size="md" mb="3">
        {query.status === "success"
          ? `${platforms[query.platform]?.name} successfully conneted!`
          : query.platform
          ? `${platforms[query.platform]?.name} connection failed`
          : "Connection unsuccessful"}
      </Heading>
      <Text>
        {query.status === "success" ? "Taking you back to Guild" : query.message}
      </Text>
    </Center>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => ({
  props: ctx.query,
})

export default OAuth
