import { Flex, Icon, Stack, Text, Tooltip } from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import Button from "components/common/Button"
import CardMotionWrapper from "components/common/CardMotionWrapper"
import { useWeb3ConnectionManager } from "components/_app/Web3ConnectionManager"
import { Chains } from "connectors"
import { Check, Question } from "phosphor-react"
import { useEffect } from "react"
import { FormProvider, useForm, useFormContext, useWatch } from "react-hook-form"
import { RequirementFormProps } from "requirements"
import { FEE_COLLECTOR_CONTRACT } from "utils/guildCheckout/constants"
import RegisterVaultForm, {
  RegisterVaultFormType,
} from "./components/RegisterVaultForm"
import useRegisterVault from "./components/RegisterVaultForm/hooks/useRegisterVault"

const PaymentForm = ({
  baseFieldPath,
  addRequirement,
}: RequirementFormProps): JSX.Element => {
  const { chainId, account } = useWeb3React()
  const { requestNetworkChange } = useWeb3ConnectionManager()

  const { setValue } = useFormContext()

  useEffect(() => {
    if (!chainId) return
    setValue(`${baseFieldPath}.address`, FEE_COLLECTOR_CONTRACT[Chains[chainId]])
  }, [chainId])

  const vaultId = useWatch({ name: `${baseFieldPath}.data.id` })

  const registerVaultFormMethods = useForm<RegisterVaultFormType>({
    mode: "all",
    defaultValues: { owner: account },
  })
  const {
    control: registerVaultFormControl,
    formState: { errors: registerVaultFormErrors },
    handleSubmit: registerVaultFormHandleSubmit,
  } = registerVaultFormMethods

  const chain = useWatch({ control: registerVaultFormControl, name: "chain" })

  useEffect(() => setValue(`${baseFieldPath}.chain`, chain), [chain])

  const isOnCorrectChain = chainId === Chains[chain]

  const token = useWatch({ control: registerVaultFormControl, name: "token" })
  const fee = useWatch({ control: registerVaultFormControl, name: "fee" })

  const { onSubmit, isLoading } = useRegisterVault((registeredVaultId) =>
    setValue(`${baseFieldPath}.data.id`, registeredVaultId)
  )

  return (
    <Stack spacing={4}>
      <Text colorScheme="gray" fontSize="sm">
        You need to register a vault in Guild's <i>FeeCollector</i> contract in order
        to receive payments. You'll be able to withdraw from it at any time.
      </Text>

      <FormProvider {...registerVaultFormMethods}>
        <RegisterVaultForm isDisabled={!!vaultId} />
      </FormProvider>

      <Flex pt={4} w="full" justifyContent="end">
        {!isOnCorrectChain && (
          <CardMotionWrapper>
            <Button
              mr={2}
              colorScheme="blue"
              onClick={() => requestNetworkChange(Chains[chain])}
              rightIcon={
                <Tooltip label="This feature is available on Görli">
                  <Icon as={Question} />
                </Tooltip>
              }
            >
              Switch network
            </Button>
          </CardMotionWrapper>
        )}
        {isOnCorrectChain && (
          <CardMotionWrapper>
            <Button
              mr={2}
              colorScheme={isOnCorrectChain ? "blue" : "gray"}
              onClick={registerVaultFormHandleSubmit(onSubmit)}
              isDisabled={
                vaultId ||
                !!Object.keys(registerVaultFormErrors).length ||
                !isOnCorrectChain ||
                !token ||
                !fee
              }
              isLoading={isLoading}
              loadingText="Registering vault"
              leftIcon={vaultId && <Icon as={Check} />}
            >
              Register vault
            </Button>
          </CardMotionWrapper>
        )}

        <CardMotionWrapper>
          <Button colorScheme="green" onClick={addRequirement} isDisabled={!vaultId}>
            Add requirement
          </Button>
        </CardMotionWrapper>
      </Flex>
    </Stack>
  )
}

export default PaymentForm
