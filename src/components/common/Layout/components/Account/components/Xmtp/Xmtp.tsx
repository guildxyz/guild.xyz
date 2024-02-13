import { IconButton } from "@chakra-ui/react"
import { Client, XMTPProvider, useClient } from "@xmtp/react-sdk"
import useUser from "components/[guild]/hooks/useUser"
import { ArrowRight } from "phosphor-react"
import { useCallback } from "react"
import { KeyedMutator } from "swr"
import useSWRImmutable from "swr/immutable"
import { useFetcherWithSign } from "utils/fetcher"
import { useWalletClient } from "wagmi"
import SubscriptionPrompt from "../MessageSkeleton/SubscriptionPromptSkeleton"

/**
 * GET v2/users/:userId/keys a user elmentett keyeit adja vissza. Mármint magát a
 * kulcsot persze nem, csak azt, hogy milyen service-hez van és azt milyen id alatt
 * tároljuk a db-ben. Query paramban megadható a service és akkor csak az adott
 * service kulcsait kéri le (jelenleg csak az XMTP valid value neki)
 */

const SubscribeXMTPButton: React.FC<{ refresh: KeyedMutator<any> }> = ({
  refresh,
}) => {
  const fetcherWithSign = useFetcherWithSign()
  const { error, isLoading, initialize } = useClient()
  const { id } = useUser()

  const { data: signer } = useWalletClient()

  const handleConnect = useCallback(async () => {
    console.log("%c handleConnect", "color: blue; font-size: 70px")
    await initialize({
      options: {
        persistConversations: false,
        env: "production",
      },
      signer,
    }).then(() => {
      Client.getKeys(signer).then((key) => {
        fetcherWithSign([
          `/v2/users/${id}/keys`,
          {
            body: {
              key: Buffer.from(key).toString("binary"),
              service: "XMTP",
            },
          },
        ]).then((res) => {
          refresh()
        })
      })
    })
  }, [initialize, signer, id, refresh])

  if (isLoading) {
    return "get xmtpkey from api..."
  }

  return (
    <IconButton
      variant="solid"
      colorScheme="blue"
      size="sm"
      onClick={handleConnect}
      isLoading={isLoading}
      icon={<ArrowRight />}
      aria-label="Open subscribe modal"
    />
  )
}

const useGetXmtpKeys = () => {
  const { id, error } = useUser()
  const fetcherWithSign = useFetcherWithSign()

  const swrImmutable = useSWRImmutable(
    [
      id ? `/v2/users/${id}/keys` : null,
      {
        method: "GET",
        body: {
          Accept: "application/json",
          query: { service: "XMTP" },
        },
      },
    ],
    fetcherWithSign
  )
  console.log("xmtp data", swrImmutable)
  return {
    ...swrImmutable,
    isLoading: !swrImmutable.data,
    error: swrImmutable.error || error,
  }
}

export const CreateClient = () => {
  const { data, error, mutate, isLoading } = useGetXmtpKeys()

  if (error) {
    return "An error occurred while initializing the client"
  }

  if (isLoading) {
    return <SubscriptionPrompt />
  }

  if (data.keys.length === 0)
    return (
      <>
        infoText="Receive messages from guild admins via XMTP" hasSubscription=
        {0 < data.keys.length}
        SubscribeButton={<SubscribeXMTPButton refresh={mutate} />}
      </>
    )

  return "Connected to XMTP" // todo, messages
}

const WithProvider = () => {
  return (
    <XMTPProvider>
      <CreateClient />
    </XMTPProvider>
  )
}
export default WithProvider
