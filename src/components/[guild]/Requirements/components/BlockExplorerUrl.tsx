import { useColorMode } from "@chakra-ui/react"
import { RequirementLinkButton } from "components/[guild]/Requirements/components/RequirementButton"
import { NULL_ADDRESS } from "utils/guildCheckout/constants"
import { Chain, CHAIN_CONFIG } from "wagmiConfig/chains"
import { useRequirementContext } from "./RequirementContext"

type Props = {
  chain?: Chain
  address?: string
  label?: string
  path?: string
}

const BlockExplorerUrl = ({
  chain: chainProp,
  address: addressProp,
  label,
  path: pathProp,
}: Props): JSX.Element => {
  const { colorMode } = useColorMode()
  const { chain, type, address, data } = useRequirementContext()

  // @ts-expect-error TODO: fix this error originating from strictNullChecks
  const blockExplorerUrl = CHAIN_CONFIG[chainProp ?? chain].blockExplorerUrl

  if (type === "COIN" || addressProp === NULL_ADDRESS || !blockExplorerUrl)
    // @ts-expect-error TODO: fix this error originating from strictNullChecks
    return null

  // Some explorers don't support the /token path
  const path =
    // @ts-expect-error TODO: fix this error originating from strictNullChecks
    pathProp ?? (["BERA_TESTNET"].includes(chainProp ?? chain) ? "address" : "token")

  const url =
    (type === "ERC1155" || type === "ERC721") && data?.id
      ? `${blockExplorerUrl}/token/${addressProp ?? address}?a=${data?.id}`
      : `${blockExplorerUrl}/${path}/${addressProp ?? address}`

  return (
    <RequirementLinkButton
      href={url}
      // @ts-expect-error TODO: fix this error originating from strictNullChecks
      imageUrl={CHAIN_CONFIG[chainProp ?? chain].blockExplorerIconUrl[colorMode]}
    >
      {label ?? "View on explorer"}
    </RequirementLinkButton>
  )
}

export default BlockExplorerUrl
