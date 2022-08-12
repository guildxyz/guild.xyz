import { formatUnits } from "@ethersproject/units"
import ModalButton from "components/common/ModalButton"
import usePayFee from "components/[guild]/claim-poap/hooks/usePayFee"
import usePoapVault from "components/[guild]/CreatePoap/hooks/usePoapVault"
import { Chains, RPC } from "connectors"
import useTokenData from "hooks/useTokenData"

type Props = {
  chainId: number
  vaultId: number
}

const PayFeeButton = ({ chainId, vaultId }: Props): JSX.Element => {
  const { vaultData, isVaultLoading } = usePoapVault(vaultId, chainId)
  const { onSubmit, loadingText } = usePayFee(vaultId)
  const {
    data: { symbol, decimals },
    isValidating,
  } = useTokenData(Chains[chainId], vaultData?.token)

  return (
    <ModalButton
      colorScheme="gray"
      isLoading={
        isVaultLoading || isValidating || !!loadingText || isValidating || !symbol
      }
      loadingText={loadingText}
      onClick={onSubmit}
    >
      {`Pay ${formatUnits(vaultData?.fee ?? "0", decimals ?? 18)} ${
        symbol || RPC[Chains[chainId]]?.nativeCurrency?.symbol
      }`}
    </ModalButton>
  )
}

export default PayFeeButton
