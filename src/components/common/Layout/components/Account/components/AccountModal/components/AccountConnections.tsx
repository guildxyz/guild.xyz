import {
  ButtonGroup,
  Divider,
  Heading,
  HStack,
  Icon,
  IconButton,
  Img,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Spacer,
  Stack,
  Text,
  Tooltip,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react"
import type { UserAddress } from "@guildxyz/types"
import useUser, { useUserPublic } from "components/[guild]/hooks/useUser"
import useWeb3ConnectionManager from "components/_app/Web3ConnectionManager/hooks/useWeb3ConnectionManager"
import Button from "components/common/Button"
import { SectionProps } from "components/common/Section"
import { randomBytes } from "crypto"
import useSubmit from "hooks/useSubmit"
import useToast from "hooks/useToast"
import { Question } from "phosphor-react"
import platforms from "platforms/platforms"
import { useMemo, useState } from "react"
import { mutate } from "swr"
import { PlatformName } from "types"
import { useFetcherWithSign } from "utils/fetcher"
import type { CWaaSConnector } from "waasConnector"
import { useConnect } from "wagmi"
import useDelegateVaults from "../../delegate/useDelegateVaults"
import LinkAddressButton from "./LinkAddressButton"
import LinkDelegateVaultButton from "./LinkDelegateVaultButton"
import LinkedAddress, { LinkedAddressSkeleton } from "./LinkedAddress"
import SharedSocials from "./SharedSocials"
import SocialAccount, { EmailAddress } from "./SocialAccount"

const AccountConnections = () => {
  const { isLoading, addresses, platformUsers, sharedSocials } = useUser()
  const { address, type } = useWeb3ConnectionManager()
  const vaults = useDelegateVaults()
  const { id: userId } = useUserPublic()

  const orderedSocials = useMemo(() => {
    const connectedPlatforms =
      platformUsers?.map((platformUser) => platformUser.platformName as string) ?? []
    const notConnectedPlatforms = Object.keys(platforms).filter(
      (platform) =>
        ![
          "POAP",
          "CONTRACT_CALL",
          "EMAIL",
          "UNIQUE_TEXT",
          "TEXT",
          "POINTS",
        ].includes(platform) && !connectedPlatforms?.includes(platform)
    )
    return [
      ...connectedPlatforms,
      "EMAIL",
      ...notConnectedPlatforms,
    ] as PlatformName[]
  }, [platformUsers])

  const linkedAddresses = addresses?.filter(
    (addr) =>
      (typeof addr === "string" ? addr : addr?.address)?.toLowerCase() !==
      address?.toLowerCase()
  )

  const coinbaseRestoreModal = useDisclosure()
  const [backupData, setBackupData] = useState("")
  const { connectors, connect } = useConnect()
  const fetcherWithSign = useFetcherWithSign()
  const toast = useToast()
  const restore = useSubmit(
    async () => {
      const cwaasConnector = connectors.find(
        ({ id }) => id === "cwaasWallet"
      ) as CWaaSConnector

      const { account } = await cwaasConnector.restoreWallet(backupData)

      const timestamp = Date.now()
      const nonce = randomBytes(32).toString("hex")
      const addr = account.address.toLowerCase()
      const message = `Address: ${addr}\nNonce: ${nonce}\n Timestamp: ${timestamp}`
      const signature = await account.signMessage({
        message,
      })

      const body = {
        address: addr,
        signature,
        nonce,
        timestamp,
        isPrimary: true,
        isDelegated: false,
      }

      const userAddress: UserAddress = await fetcherWithSign([
        `/v2/users/${userId}/addresses`,
        { method: "POST", body },
      ])

      await mutate(
        [`/v2/users/${userId}/profile`, { method: "GET", body: {} }],
        (prev) => ({
          ...prev,
          addresses: [userAddress],
        }),
        { revalidate: false }
      )

      connect({ connector: cwaasConnector })
    },
    {
      onSuccess: () => {
        toast({ status: "success", title: "Wallet restored!" })
        coinbaseRestoreModal.onClose()
        setBackupData("")
      },
    }
  )

  return (
    <>
      <AccountSectionTitle
        title="Social accounts"
        titleRightElement={sharedSocials?.length && <SharedSocials />}
      />
      <AccountSection mb="6" divider={<Divider />}>
        {orderedSocials.map((platform) =>
          platform === "EMAIL" ? (
            <EmailAddress key={"EMAIL"} />
          ) : (
            <SocialAccount key={platform} type={platform} />
          )
        )}
      </AccountSection>

      <AccountSectionTitle
        title="Linked addresses"
        titleRightElement={
          addresses?.length > 1 && (
            <>
              <Popover placement="top" trigger="hover">
                <PopoverTrigger>
                  <Icon as={Question} />
                </PopoverTrigger>
                <PopoverContent>
                  <PopoverArrow />
                  <PopoverBody>
                    Each of your addresses will be used for requirement checks.
                  </PopoverBody>
                </PopoverContent>
              </Popover>
              <Spacer />
              <LinkAddressButton variant="ghost" my="-1 !important" />
            </>
          )
        }
        spacing={3}
        pt="4"
      />

      <AccountSection divider={<Divider />}>
        {isLoading ? (
          <LinkedAddressSkeleton />
        ) : !linkedAddresses?.length ? (
          <Stack
            {...(!vaults?.length && {
              direction: "row",
              alignItems: "center",
              justifyContent: "space-between",
            })}
          >
            <Text fontSize={"sm"} fontWeight={"medium"}>
              No linked addresses yet
            </Text>
            {vaults?.length ? (
              <ButtonGroup w="full">
                <LinkAddressButton />
                <LinkDelegateVaultButton vaults={vaults} />
              </ButtonGroup>
            ) : (
              <>
                <ButtonGroup isAttached>
                  <LinkAddressButton />

                  <Divider
                    orientation="vertical"
                    borderColor="whiteAlpha.500"
                    h="8"
                  />

                  <Tooltip label="Restore and link Coinbase wallet">
                    <IconButton
                      onClick={() => {
                        coinbaseRestoreModal.onOpen()
                      }}
                      size={"sm"}
                      icon={
                        <Img w={5} h={5} src="/walletLogos/coinbasewallet.png" />
                      }
                      aria-label="Restore and link Coinbase wallet"
                    />
                  </Tooltip>
                </ButtonGroup>
                <Modal
                  isOpen={coinbaseRestoreModal.isOpen}
                  onClose={coinbaseRestoreModal.onClose}
                >
                  <ModalOverlay />
                  <ModalContent>
                    <ModalHeader>Restore and link Coinbase wallet</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                      <Stack>
                        <Text>
                          Paste the backup data of the Coinbase wallet here
                        </Text>
                        <Input
                          value={backupData}
                          onChange={({ target: { value } }) => setBackupData(value)}
                        />
                      </Stack>
                    </ModalBody>
                    <ModalFooter>
                      <Button
                        colorScheme="green"
                        isDisabled={!backupData}
                        isLoading={restore.isLoading}
                        loadingText="Restoring"
                        onClick={restore.onSubmit}
                      >
                        Restore
                      </Button>
                    </ModalFooter>
                  </ModalContent>
                </Modal>
              </>
            )}
          </Stack>
        ) : (
          linkedAddresses
            .map((addressData) => (
              <LinkedAddress key={addressData?.address} addressData={addressData} />
            ))
            .concat(
              vaults?.length ? <LinkDelegateVaultButton vaults={vaults} /> : null
            )
        )}
      </AccountSection>
    </>
  )
}

const AccountSection = ({ children, ...rest }) => {
  const bg = useColorModeValue("gray.50", "blackAlpha.200")

  return (
    <Stack
      bg={bg}
      w="full"
      borderWidth="1px"
      borderRadius={"xl"}
      px="4"
      py="3.5"
      spacing={3}
      {...rest}
    >
      {children}
    </Stack>
  )
}

export const AccountSectionTitle = ({ title, titleRightElement }: SectionProps) => (
  <HStack mb="3" w="full">
    <Heading fontSize={"sm"} as="h3" opacity="0.6" fontWeight={"bold"}>
      {title}
    </Heading>
    {titleRightElement}
  </HStack>
)

export default AccountConnections
