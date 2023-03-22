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

const walletActivitySupportedChains: Chain[] = [
  "ETHEREUM",
  "POLYGON",
  "ARBITRUM",
  "OPTIMISM",
  "GOERLI",
  "POLYGON_MUMBAI",
]

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
    label: "Asset activity",
    value: "ALCHEMY_TX_VALUE",
    WalletActivityRequirement: AlchemyTxValue,
  },
  {
    label: "Asset activity (relative)",
    value: "ALCHEMY_TX_VALUE_RELATIVE",
    WalletActivityRequirement: AlchemyTxValueRelative,
  },
]

const WalletActivityForm = ({
  baseFieldPath,
}: RequirementFormProps): JSX.Element => {
  const {
    setValue,
    formState: { errors },
  } = useFormContext()

  const type = useWatch({ name: `${baseFieldPath}.type` })

  const selected = walletActivityRequirementTypes.find(
    (reqType) => reqType.value === type
  )

  return (
    <Stack spacing={4} alignItems="start">
      <FormControl
        isInvalid={!!parseFromObject(errors, baseFieldPath)?.type?.message}
      >
        <FormLabel>Type</FormLabel>

        <ControlledSelect
          name={`${baseFieldPath}.type`}
          rules={{ required: "It's required to select a type" }}
          options={walletActivityRequirementTypes}
          afterOnChange={() => setValue(`${baseFieldPath}.data`, "")}
        />

        <FormErrorMessage>
          {parseFromObject(errors, baseFieldPath)?.type?.message}
        </FormErrorMessage>
      </FormControl>

      {selected?.WalletActivityRequirement && (
        <>
          <ChainPicker
            controlName={`${baseFieldPath}.chain`}
            supportedChains={walletActivitySupportedChains}
          />
          <selected.WalletActivityRequirement baseFieldPath={baseFieldPath} />
        </>
      )}
    </Stack>
  )
}

export default WalletActivityForm
