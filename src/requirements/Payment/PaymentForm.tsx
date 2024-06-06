import { HStack, Icon, Stack, Tooltip } from "@chakra-ui/react"
import Button from "components/common/Button"
import useTriggerNetworkChange from "hooks/useTriggerNetworkChange"
import { Check, Question } from "phosphor-react"
import { useEffect } from "react"
import { FormProvider, useForm, useFormContext, useWatch } from "react-hook-form"
import { RequirementFormProps } from "requirements"
import { FEE_COLLECTOR_CONTRACT } from "utils/guildCheckout/constants"
import { useAccount } from "wagmi"
import { Chains } from "wagmiConfig/chains"
import RegisterVaultForm, {
  RegisterVaultFormType,
} from "./components/RegisterVaultForm"
import useRegisterVault from "./components/RegisterVaultForm/hooks/useRegisterVault"

const PaymentForm = ({
  baseFieldPath,
  addRequirement,
  setOnCloseAttemptToast,
}: RequirementFormProps): JSX.Element => {
  const { address, chainId } = useAccount()
  const { requestNetworkChange } = useTriggerNetworkChange()

  const { setValue } = useFormContext()

  useEffect(() => {
    if (!chainId) return
    setValue(`${baseFieldPath}.address`, FEE_COLLECTOR_CONTRACT[Chains[chainId]])
  }, [chainId, setValue, baseFieldPath])

  const vaultId = useWatch({ name: `${baseFieldPath}.data.id` })

  const registerVaultFormMethods = useForm<RegisterVaultFormType>({
    mode: "all",
    defaultValues: { owner: address },
  })
  const {
    control: registerVaultFormControl,
    formState: { errors: registerVaultFormErrors },
    handleSubmit: registerVaultFormHandleSubmit,
  } = registerVaultFormMethods

  const chain = useWatch({ control: registerVaultFormControl, name: "chain" })

  useEffect(
    () => setValue(`${baseFieldPath}.chain`, chain),
    [chain, setValue, baseFieldPath]
  )

  const isOnCorrectChain = chainId === Chains[chain]

  const token = useWatch({ control: registerVaultFormControl, name: "token" })
  const fee = useWatch({ control: registerVaultFormControl, name: "fee" })
  const owner = useWatch({ control: registerVaultFormControl, name: "owner" })

  const { onSubmitTransaction, isLoading } = useRegisterVault({
    chain,
    token,
    fee,
    owner,
    onSuccess: (registeredVaultId) =>
      setValue(`${baseFieldPath}.data.id`, registeredVaultId),
  })

  useEffect(() => {
    if (!vaultId) return
    addRequirement()
  }, [vaultId, addRequirement])

  useEffect(() => {
    if (isLoading)
      setOnCloseAttemptToast(
        "You can't close the modal until the transaction finishes"
      )
    else setOnCloseAttemptToast(false)
  }, [isLoading, setOnCloseAttemptToast])

  return (
    <Stack spacing={4}>
      <FormProvider {...registerVaultFormMethods}>
        <RegisterVaultForm isDisabled={!!vaultId} />
      </FormProvider>

      <HStack pt={4} w="full" justifyContent="end">
        {isOnCorrectChain ? (
          <Button
            data-test="payment-form-register-vault-button"
            colorScheme={isOnCorrectChain ? "green" : "gray"}
            onClick={registerVaultFormHandleSubmit(() => onSubmitTransaction())}
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
            Register vault & add requirement
          </Button>
        ) : (
          <Button
            data-test="payment-form-switch-network-button"
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
        )}
      </HStack>
    </Stack>
  )
}

export default PaymentForm
