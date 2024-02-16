import { FormControl, FormLabel, Stack } from "@chakra-ui/react"
import { Chain } from "chains"
import ControlledSelect from "components/common/ControlledSelect"
import FormErrorMessage from "components/common/FormErrorMessage"
import { useFormContext, useWatch } from "react-hook-form"
import { RequirementFormProps } from "requirements"
import ChainPicker from "requirements/common/ChainPicker"
import { SelectOption } from "types"
import parseFromObject from "utils/parseFromObject"
import AlchemyContractDeploy from "./components/AlchemyContractDeploy"
import AlchemyContractDeployRelative from "./components/AlchemyContractDeployRelative"
import AlchemyFirstTxRelative from "./components/AlchemyFirstTxRelative"
import AlchemyTxCount from "./components/AlchemyTxCount"
import AlchemyTxCountRelative from "./components/AlchemyTxCountRelative"
import CovalentFirstTx from "./components/CovalentFirstTx"

// These can be extended for additional Covalent support
export const COVALENT_CHAINS = new Set<Chain>([
  "ETHEREUM",
  "POLYGON",
  "POLYGON_ZKEVM",
  "BASE_MAINNET",
  "BASE_GOERLI",
  "BSC",
  "SCROLL",
  "SCROLL_SEPOLIA",
  "ZORA",
  "AVALANCHE",
  "ZKSYNC_ERA",
  "CRONOS",
  "PGN",
  "NEON_EVM",
  "OPTIMISM",
  "LINEA",
  "MANTLE",
  "RONIN",
  "ARBITRUM",
  "METIS",
  "TAIKO_KATLA",
])

const walletActivityRequirementTypes: SelectOption[] = [
  {
    label: "Wallet age",
    value: "COVALENT_FIRST_TX",
    WalletActivityRequirement: CovalentFirstTx,
  },
  {
    label: "Wallet age (relative)",
    value: "COVALENT_FIRST_TX_RELATIVE",
    WalletActivityRequirement: AlchemyFirstTxRelative,
  },
  {
    label: "Deployed a contract",
    value: "COVALENT_CONTRACT_DEPLOY",
    WalletActivityRequirement: AlchemyContractDeploy,
  },
  {
    label: "Deployed a contract (relative)",
    value: "COVALENT_CONTRACT_DEPLOY_RELATIVE",
    WalletActivityRequirement: AlchemyContractDeployRelative,
  },
  {
    label: "Transaction count",
    value: "COVALENT_TX_COUNT",
    WalletActivityRequirement: AlchemyTxCount,
  },
  {
    label: "Transaction count (relative)",
    value: "COVALENT_TX_COUNT_RELATIVE",
    WalletActivityRequirement: AlchemyTxCountRelative,
  },
]

const WalletActivityForm = ({
  baseFieldPath,
  field,
}: RequirementFormProps): JSX.Element => {
  const {
    resetField,
    formState: { errors },
  } = useFormContext()

  const type = useWatch({ name: `${baseFieldPath}.type` })
  const chain = useWatch({ name: `${baseFieldPath}.chain` })
  const isEditMode = !!field?.id

  const supportedRequirementTypes = walletActivityRequirementTypes

  const selected = supportedRequirementTypes.find(
    (reqType) => reqType.value === type
  )

  const walletActivitySupportedChains: Chain[] = [
    "ETHEREUM",
    "POLYGON",
    "POLYGON_ZKEVM",
    "ARBITRUM",
    "OPTIMISM",
    "SCROLL",
    "SCROLL_SEPOLIA",
    "BASE_MAINNET",
    "BASE_GOERLI",
    "BSC",
    "ZORA",
    "ZKSYNC_ERA",
    "CRONOS",
    "PGN",
    "NEON_EVM",
    "LINEA",
    "MANTLE",
    "RONIN",
    "METIS",
    "TAIKO_KATLA",
  ]

  for (const covalentChain of COVALENT_CHAINS.values()) {
    if (!walletActivitySupportedChains.includes(covalentChain)) {
      walletActivitySupportedChains.push(covalentChain)
    }
  }

  const resetFields = () => {
    resetField(`${baseFieldPath}.address`, { defaultValue: "" })
    resetField(`${baseFieldPath}.data.minAmount`, { defaultValue: "" })
    resetField(`${baseFieldPath}.data.maxAmount`, { defaultValue: "" })
    resetField(`${baseFieldPath}.data.timestamps.minAmount`, { defaultValue: "" })
    resetField(`${baseFieldPath}.data.timestamps.maxAmount`, { defaultValue: "" })
    resetField(`${baseFieldPath}.data.txCount`, { defaultValue: "" })
    resetField(`${baseFieldPath}.data.txValue`, { defaultValue: "" })
  }

  return (
    <Stack spacing={4} alignItems="start">
      <ChainPicker
        controlName={`${baseFieldPath}.chain`}
        supportedChains={walletActivitySupportedChains}
      />

      {chain && (
        <>
          <FormControl
            isInvalid={!!parseFromObject(errors, baseFieldPath)?.type?.message}
          >
            <FormLabel>Type</FormLabel>

            <ControlledSelect
              name={`${baseFieldPath}.type`}
              rules={{ required: "It's required to select a type" }}
              options={supportedRequirementTypes}
              beforeOnChange={resetFields}
              isDisabled={isEditMode}
            />

            <FormErrorMessage>
              {parseFromObject(errors, baseFieldPath)?.type?.message}
            </FormErrorMessage>
          </FormControl>

          {selected?.WalletActivityRequirement && (
            <selected.WalletActivityRequirement baseFieldPath={baseFieldPath} />
          )}
        </>
      )}
    </Stack>
  )
}

export default WalletActivityForm
