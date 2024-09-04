import { usePostHogContext } from "@/components/Providers/PostHogProvider"
import { useWeb3ConnectionManager } from "@/components/Web3ConnectionManager/hooks/useWeb3ConnectionManager"
import { useUserPublic } from "@/hooks/useUserPublic"
import { useFetcherWithSign } from "hooks/useFetcherWithSign"
import { useAtomValue, useSetAtom } from "jotai"
import { useEffect } from "react"
import { mutate } from "swr"
import { StoredKeyPair, setKeyPairToIdb } from "utils/keyPair"
import { recaptchaAtom, shouldUseReCAPTCHAAtom } from "utils/recaptcha"
import { checksumAddress } from "viem"
import { useMutateOptionalAuthSWRKey } from "./useSWRWithOptionalAuth"
import useSubmit from "./useSubmit"
import { MessageParams, SignProps, UseSubmitOptions } from "./useSubmit/types"

function getSiweMessage({
  addr,
  method,
  nonce: nonceRandom,
  ts,
  chainId,
  hash,
}: MessageParams) {
  const nonce = `${hash}${nonceRandom}${method ?? 1}`

  // Indentation is important inside the string, extra indentation would be extra whitespace in the string
  return `guild.xyz wants you to sign in with your Ethereum account:
${checksumAddress(addr as `0x${string}`)}

Sign in Guild.xyz

URI: https://guild.xyz
Version: 1
Chain ID: ${chainId ?? 1}
Nonce: ${nonce}
Issued At: ${new Date(+ts).toISOString()}`
}

/**
 * This is a generic RPC internal error code, but we are only using it for testing
 * personal_sign errors, which should mean that the user rejected the request
 */
const RPC_INTERNAL_ERROR_CODE = -32603

type SetKeypairPayload = Omit<StoredKeyPair, "keyPair"> & {
  verificationParams?: {
    reCaptcha: string
  }
}

const generateKeyPair = async () => {
  const keyPair: StoredKeyPair = {
    pubKey: undefined,
    keyPair: undefined,
  }
  try {
    const generatedKeys = await window.crypto.subtle.generateKey(
      {
        name: "ECDSA",
        namedCurve: "P-256",
      },
      false,
      ["sign", "verify"]
    )

    const generatedPubKey = await window.crypto.subtle.exportKey(
      "raw",
      generatedKeys.publicKey
    )

    const generatedPubKeyHex = Buffer.from(generatedPubKey).toString("hex")
    keyPair.pubKey = generatedPubKeyHex
    keyPair.keyPair = generatedKeys
    return keyPair
  } catch {
    throw new Error("Pubkey export error")
  }
}

const useSetKeyPair = (submitOptions?: UseSubmitOptions) => {
  const { identifyUser, captureEvent } = usePostHogContext()

  const { address, type: walletType } = useWeb3ConnectionManager()

  const fetcherWithSign = useFetcherWithSign()

  const { id, captchaVerifiedSince, error: publicUserError } = useUserPublic()
  const setShouldUseReCAPTCHA = useSetAtom(shouldUseReCAPTCHAAtom)

  useEffect(() => {
    if (!!publicUserError || (id && !captchaVerifiedSince)) {
      setShouldUseReCAPTCHA(true)
    }
  }, [id, publicUserError, captchaVerifiedSince, setShouldUseReCAPTCHA])

  const recaptcha = useAtomValue(recaptchaAtom)

  const mutateOptionalAuthSWRKey = useMutateOptionalAuthSWRKey()

  const setSubmitResponse = useSubmit(
    async ({
      signProps,
    }: {
      signProps?: Partial<SignProps>
    } = {}) => {
      const reCaptchaToken =
        !recaptcha.ref || !!captchaVerifiedSince
          ? undefined
          : await recaptcha.ref.executeAsync()

      const generatedKeys = await generateKeyPair().catch((err) => {
        if (err?.code !== 4001) {
          captureEvent(`Keypair generation error`, {
            error: err?.message || err?.toString?.() || err,
          })
        }
        throw err
      })

      const body: SetKeypairPayload = {
        pubKey: generatedKeys.pubKey,
      }

      if (reCaptchaToken) {
        recaptcha.ref.reset()
        body.verificationParams = {
          reCaptcha: reCaptchaToken,
        }
      }

      const userProfile = await fetcherWithSign([
        `/v2/users/${signProps?.address ?? id ?? address}/public-key`,
        {
          method: "POST",
          body,
          signOptions: {
            forcePrompt: true,
            msg: "Sign in Guild.xyz",
            ...signProps,
            getMessageToSign:
              walletType === "EVM" ||
              signProps?.walletClient?.account?.type === "local"
                ? getSiweMessage
                : undefined,
          },
        },
      ])

      /**
       * This rejects, when IndexedDB is not available, like in Firefox private
       * window. Ignoring this error is fine, since we are falling back to just
       * storing it in memory.
       */
      await setKeyPairToIdb(userProfile.id, generatedKeys).catch(() => {})

      await mutateOptionalAuthSWRKey(
        `/v2/users/${userProfile.id}/profile`,
        userProfile,
        {
          revalidate: false,
        }
      )

      await mutate(
        `/v2/users/${(signProps?.address ?? address)?.toLowerCase()}/profile`,
        {
          id: userProfile?.id,
          publicKey: userProfile?.publicKey,
          captchaVerifiedSince: userProfile?.captchaVerifiedSince,
          keyPair: generatedKeys,
        },
        {
          revalidate: false,
        }
      )

      identifyUser(userProfile)

      return { keyPair: generatedKeys, user: userProfile }
    },

    {
      ...submitOptions,
      onError: (error) => {
        console.error("setKeyPair error", error)
        if (
          error?.code !== RPC_INTERNAL_ERROR_CODE &&
          error?.code !== "ACTION_REJECTED"
        ) {
          const trace = error?.stack || new Error().stack
          captureEvent(`Failed to set keypair`, { error, trace })
        }

        submitOptions?.onError?.(error)
      },
      onSuccess: () => {
        submitOptions?.onSuccess?.()
      },
    }
  )

  return setSubmitResponse
}

export default useSetKeyPair
