import { FormControl, FormLabel, Stack } from "@chakra-ui/react"
import ControlledSelect from "components/common/ControlledSelect"
import FormErrorMessage from "components/common/FormErrorMessage"
import { Chain } from "connectors"
import { useFormContext, useWatch } from "react-hook-form"
import { RequirementFormProps } from "requirements"
import ChainPicker from "requirements/common/ChainPicker"
import { SelectOption } from "types"
import parseFromObject from "utils/parseFromObject"
import AlchemyContractDeploy from "./components/AlchemyContractDeploy"
import AlchemyContractDeployRelative from "./components/AlchemyContractDeployRelative"
import AlchemyFirstTx from "./components/AlchemyFirstTx"
import AlchemyFirstTxRelative from "./components/AlchemyFirstTxRelative"
import AlchemyTxCount from "./components/AlchemyTxCount"
import AlchemyTxCountRelative from "./components/AlchemyTxCountRelative"
import AlchemyTxValue from "./components/AlchemyTxValue"
import AlchemyTxValueRelative from "./components/AlchemyTxValueRelative"

// These can be extended for additional Covalent support
export const COVALENT_CHAINS = new Set<Chain>([
  "BASE_GOERLI",
  "BASE_MAINNET",
  "SCROLL_ALPHA",
  "ZORA",
])

const COVALENT_EXCLUDED_TYPES = new Set([
  "ALCHEMY_TX_VALUE",
  "ALCHEMY_TX_VALUE_RELATIVE",
])

const walletActivityRequirementTypes: SelectOption[] = [
  {
    label: "Wallet age",
    value: "ALCHEMY_FIRST_TX",
    WalletActivityRequirement: AlchemyFirstTx,
  },
  {
    label: "Wallet age (relative)",
    value: "ALCHEMY_FIRST_TX_RELATIVE",
    WalletActivityRequirement: AlchemyFirstTxRelative,
  },
  {
    label: "Deployed a contract",
    value: "ALCHEMY_CONTRACT_DEPLOY",
    WalletActivityRequirement: AlchemyContractDeploy,
  },
  {
    label: "Deployed a contract (relative)",
    value: "ALCHEMY_CONTRACT_DEPLOY_RELATIVE",
    WalletActivityRequirement: AlchemyContractDeployRelative,
  },
  {
    label: "Transaction count",
    value: "ALCHEMY_TX_COUNT",
    WalletActivityRequirement: AlchemyTxCount,
  },
  {
    label: "Transaction count (relative)",
    value: "ALCHEMY_TX_COUNT_RELATIVE",
    WalletActivityRequirement: AlchemyTxCountRelative,
  },
  {
    label: "Asset movement",
    value: "ALCHEMY_TX_VALUE",
    WalletActivityRequirement: AlchemyTxValue,
  },
  {
    label: "Asset movement (relative)",
    value: "ALCHEMY_TX_VALUE_RELATIVE",
    WalletActivityRequirement: AlchemyTxValueRelative,
  },
]

const WalletActivityForm = ({
  baseFieldPath,
}: RequirementFormProps): JSX.Element => {
  const {
    resetField,
    formState: { errors },
  } = useFormContext()

  const type = useWatch({ name: `${baseFieldPath}.type` })
  const chain = useWatch({ name: `${baseFieldPath}.chain` })

  const supportedRequirementTypes = COVALENT_CHAINS.has(chain)
    ? walletActivityRequirementTypes
        .filter(({ value }) => !COVALENT_EXCLUDED_TYPES.has(value))
        .map(
          ({ value, ...rest }) =>
            ({
              ...rest,
              value: value.replace("ALCHEMY_", "COVALENT_"),
            } as SelectOption)
        )
    : walletActivityRequirementTypes

  const selected = supportedRequirementTypes.find(
    (reqType) => reqType.value === type
  )

  const walletActivitySupportedChains: Chain[] = [
    "ETHEREUM",
    "POLYGON",
    "ARBITRUM",
    "OPTIMISM",
    "GOERLI",
    "POLYGON_MUMBAI",
    "SCROLL_ALPHA",
    "BASE_MAINNET",
    "BASE_GOERLI",
    "ZORA",
  ]

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
