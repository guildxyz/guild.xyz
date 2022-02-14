import { useWeb3React } from "@web3-react/core"
import { useRouter } from "next/router"
import { useEffect, useMemo } from "react"
import useSWRImmutable from "swr/immutable"

const DEFAULT_URL = "https://roadmap.guild.xyz/?__force"

const useUpvoty = () => {
  const { account } = useWeb3React()
  const router = useRouter()
  const redirectUrl = useMemo(
    () => router.query.redirectUrl ?? DEFAULT_URL,
    [router.query]
  )
  const { data: upvotyJWT, error } = useSWRImmutable(
    account ? `/user/upvotyAuth/${account}` : null
  )

  const urlWithAuth = useMemo(
    () =>
      upvotyJWT
        ? `https://roadmap.guild.xyz/front/handleSSO/${upvotyJWT}/?redirectUrl=${redirectUrl}`
        : null,
    [upvotyJWT, redirectUrl]
  )

  useEffect(() => {
    if (router.query.redirectUrl && urlWithAuth) router.push(urlWithAuth)
  }, [router.query, urlWithAuth])

  return {
    url: urlWithAuth ?? DEFAULT_URL,
    isRedirecting: router.query.redirectUrl,
    upvotyAuthError: error,
  }
}

export default useUpvoty
