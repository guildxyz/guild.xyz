import { Link } from "@chakra-ui/next-js"
import {
  Center,
  HStack,
  Img,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  StackProps,
  Text,
  VStack,
  useBreakpointValue,
  useClipboard,
  useDisclosure,
} from "@chakra-ui/react"
// @ts-ignore: fetched from prive sources, prevents successful build
import type { RawPrivateKey, Waas } from "@coinbase/waas-sdk-web"
// eslint-disable-next-line import/no-extraneous-dependencies
import { usePostHogContext } from "components/_app/PostHogProvider"
import Button from "components/common/Button"
import { Modal } from "components/common/Modal"
import ConfirmationAlert from "components/create-guild/Requirements/components/ConfirmationAlert"
import useSubmit from "hooks/useSubmit"
import useToast from "hooks/useToast"
import { Check, Copy, Wallet } from "phosphor-react"
import { useState } from "react"
import fetcher from "utils/fetcher"
import { useConnect } from "wagmi"
import { connectorButtonProps } from "../../ConnectorButton"
import useDriveOAuth from "../hooks/useDriveOAuth"
import { getDriveFileAppProperties, listWalletsOnDrive } from "../utils/googleDrive"

const WAAS_DEPRECATION_ERROR_MESSAGE =
  "Looks like you don't have an existing Google-based Guild account. We recommend signing in with the Smart Wallet option"

// @ts-ignore: fetched from prive sources, prevents successful build
let cwaasModule: typeof import("@coinbase/waas-sdk-web")
const cwaasImport = async () => {
  if (cwaasModule) return cwaasModule
  // eslint-disable-next-line import/no-extraneous-dependencies
  // @ts-ignore: fetched from prive sources, prevents successful build
  const mod = await import("@coinbase/waas-sdk-web")
  cwaasModule = mod
  return mod
}

// eslint-disable-next-line @typescript-eslint/naming-convention
let _waas: Waas
async function getWaas() {
  if (_waas) {
    return _waas
  }
  const { InitializeWaas } = await cwaasImport()
  _waas = await InitializeWaas({
    provideAuthToken: async () => {
      const token = await fetcher("/v2/third-party/coinbase/token")
      return token
    },
    collectAndReportMetrics: true,
    prod:
      (typeof window !== "undefined" && window.origin === "https://guild.xyz") ||
      undefined,
  })
  return _waas
}

async function generatePrivateKey(backupData: string) {
  try {
    const waas = await getWaas()
    const { Logout } = await cwaasImport()
    await Logout().catch(() => {})

    const wallet = await waas.wallets.restoreFromBackup(backupData)
    const pk = (await wallet.exportKeys(backupData)) as RawPrivateKey[]

    return pk?.[0]?.ecKeyPrivate
  } catch (error) {
    console.error(error)
    return null
  }
}

const ExportWaasModal = ({
  onClose,
  isOpen,
}: {
  onClose: () => void
  isOpen: boolean
}) => {
  const alert = useDisclosure()
  const { captureEvent } = usePostHogContext()
  const googleAuth = useDriveOAuth()
  const { connectors, connect } = useConnect()
  const toast = useToast()
  const [hasCopiedAtLeastOnce, setHasCopiedAtLeastOnce] = useState(false)

  const injectedConnector = connectors.find(({ id }) => id === "injected")

  const {
    response: privateKey,
    isLoading,
    onSubmit: onGeneratePrivateKey,
  } = useSubmit(
    async () => {
      captureEvent("[WaaS export] Started")

      // 1) Google OAuth
      const { authData, error } = await googleAuth.onOpen()

      if (!authData || !!error) {
        // Ignore cases, when the user cancels the OAuth
        if (error?.error !== "access_denied") {
          captureEvent("[WaaS export] [error] Google OAuth failed", { error })
          throw new Error(error?.errorDescription ?? "Google authentication failed")
        } else {
          captureEvent("[WaaS export] [error] Google OAuth denied", { error })
          return
        }
      }

      captureEvent("[WaaS export] OAuth completed")

      // 2) Get backup from Drive
      const { files } = await listWalletsOnDrive(authData.access_token)
      if (files.length <= 0) {
        captureEvent("[WaaS export] [error] Has no wallet file")
        throw new Error(WAAS_DEPRECATION_ERROR_MESSAGE)
      }

      captureEvent("[WaaS export] File fetched")

      // 3) Restore wallet
      const {
        appProperties: { backupData },
      } = await getDriveFileAppProperties(files[0].id, authData.access_token)

      captureEvent("[WaaS export] App properties fetched")

      // 4) Generate private key
      const pk = await generatePrivateKey(backupData)

      if (!pk) {
        captureEvent("[WaaS export] [error] Couldn't generate private key")

        throw new Error(
          "Failed to export private key, make sure to authenticate with the correct Google account"
        )
      }

      captureEvent("[WaaS export] Private key generated")

      return pk
    },
    {
      onError: (error) => {
        captureEvent("[WaaS export] [error] Unexpected error", { error })

        toast({
          status: "error",
          description: error?.message || "Something went wrong, please try again",
        })

        if (error?.message === WAAS_DEPRECATION_ERROR_MESSAGE) {
          onClose()
        }
      },
    }
  )

  const { onCopy, hasCopied } = useClipboard(privateKey, 3000)

  const stackProps = useBreakpointValue({
    base: {
      alignItems: "center",
      flexDirection: "column",
    } as StackProps,
    md: {
      alignItems: "start",
      flexDirection: "row",
    } as StackProps,
  })

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent maxWidth={privateKey ? "2xl" : undefined}>
          <ModalHeader>
            {privateKey ? "Import & back up your wallet" : "Export Google Wallet"}
          </ModalHeader>
          <ModalBody>
            {!privateKey ? (
              <VStack alignItems={"start"}>
                <Text>
                  This feature is <strong>deprecated</strong>
                </Text>
                <Text>
                  <strong>Import</strong> your Google-based account{" "}
                  <strong>into an external wallet</strong> by authenticating with the
                  button below and following the steps
                </Text>
                <Text>
                  If you don't have a Google-based account or have no value on it,
                  use the <strong>Smart Wallet</strong> sign-in option
                </Text>
              </VStack>
            ) : (
              <Stack {...stackProps}>
                <VStack>
                  <Text>
                    You can now copy your private key, and import it into a wallet
                    app, like{" "}
                    <Link
                      href="https://metamask.io"
                      isExternal
                      fontWeight={"semibold"}
                    >
                      MetaMask
                    </Link>
                  </Text>
                  <Text>
                    It is highly recommended to <strong>safely store</strong> the
                    copied private key somewhere, as this export option on Guild
                    won't be available forever
                  </Text>
                  <Text>
                    <strong>Never share the private key with anyone!</strong> This
                    key is the only way to access your wallet, and anyone, who knows
                    the private key has access
                  </Text>
                </VStack>
                <video
                  src="/videos/import-wallet-into-metamask.webm"
                  muted
                  autoPlay
                  loop
                  width={300}
                  style={{
                    borderRadius: 8,
                  }}
                >
                  Your browser does not support the HTML5 video tag.
                </video>
              </Stack>
            )}
          </ModalBody>
          <ModalFooter>
            {!privateKey ? (
              <Button
                onClick={onGeneratePrivateKey}
                colorScheme={"white"}
                borderWidth="2px"
                isLoading={isLoading}
                loadingText={
                  googleAuth.isAuthenticating
                    ? "Auhenticate in the popup"
                    : "Generating private key"
                }
                leftIcon={
                  <Center boxSize={6}>
                    <Img
                      src={`/walletLogos/google.svg`}
                      maxW={6}
                      maxH={6}
                      alt={`Google logo`}
                    />
                  </Center>
                }
                {...connectorButtonProps}
              >
                Authenticate with Google
              </Button>
            ) : (
              <HStack>
                <Button
                  onClick={() => {
                    onCopy()
                    setHasCopiedAtLeastOnce(true)
                    captureEvent("[WaaS export] Copied private key")
                  }}
                  isDisabled={hasCopied}
                  colorScheme="white"
                  borderWidth="2px"
                  leftIcon={hasCopied ? <Check /> : <Copy />}
                >
                  {hasCopied ? "Private key copied" : "Copy private key"}
                </Button>

                <Button
                  isDisabled={!hasCopiedAtLeastOnce}
                  colorScheme={"green"}
                  leftIcon={<Wallet />}
                  onClick={alert.onOpen}
                >
                  Backup & import done
                </Button>
              </HStack>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
      <ConfirmationAlert
        isOpen={alert.isOpen}
        onClose={alert.onClose}
        onConfirm={() => {
          captureEvent("[WaaS export] Confirmed wallet import")
          alert.onClose()
          onClose()
          connect({ connector: injectedConnector })
        }}
        title="Are you sure?"
        description="Please double check that the wallet has been imported and it is backed up safely"
        confirmationText="I'm sure"
      />
    </>
  )
}

export default ExportWaasModal
