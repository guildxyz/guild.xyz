import { useColorMode } from "@chakra-ui/react"
import { RequirementLink } from "components/[guild]/Requirements/components/RequirementButton"
import { NULL_ADDRESS } from "utils/guildCheckout/constants"
import { CHAIN_CONFIG, Chain } from "wagmiConfig/chains"
import { useRequirementContext } from "./RequirementContext"

type Props = {
  chain?: Chain
  address?: string
  label?: string
  path?: string
  className?: string
}

const BlockExplorerUrl = ({
  chain: chainProp,
  address: addressProp,
  label,
  path: pathProp,
  className,
}: Props): JSX.Element => {
  const { colorMode } = useColorMode()
  const { chain, type, address, data } = useRequirementContext()

  const blockExplorerUrl = CHAIN_CONFIG[chainProp ?? chain].blockExplorerUrl

  if (type === "COIN" || addressProp === NULL_ADDRESS || !blockExplorerUrl)
    return null

  // Some explorers don't support the /token path
  const path =
    pathProp ??
    (["BERA_TESTNET", "IOTA"].includes(chainProp ?? chain) ? "address" : "token")

  const url =
    (type === "ERC1155" || type === "ERC721") && data?.id
      ? `${blockExplorerUrl}/token/${addressProp ?? address}?a=${data?.id}`
      : `${blockExplorerUrl}/${path}/${addressProp ?? address}`

  return (
    <RequirementLink
      href={url}
      imageUrl={CHAIN_CONFIG[chainProp ?? chain].blockExplorerIconUrl[colorMode]}
      label={label ?? "View on explorer"}
      className={className}
    />
  )
}

export { BlockExplorerUrl }
