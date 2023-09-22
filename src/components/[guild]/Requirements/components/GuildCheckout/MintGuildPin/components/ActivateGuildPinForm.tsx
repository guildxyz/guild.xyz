import { Checkbox, Stack, useColorModeValue } from "@chakra-ui/react"
import Button from "components/common/Button"
import useCreateRole from "components/create-guild/hooks/useCreateRole"
import useEditGuild from "components/[guild]/EditGuild/hooks/useEditGuild"
import useGuild from "components/[guild]/hooks/useGuild"
import { Chain } from "connectors"
import useToast from "hooks/useToast"
import { FormProvider, useController, useForm, useWatch } from "react-hook-form"
import ChainPicker from "requirements/common/ChainPicker"
import { GUILD_PIN_CONTRACTS } from "utils/guildCheckout/constants"
import { useMintGuildPinContext } from "../../MintGuildPinContext"

type ActivatePinForm = {
  chain: Chain
  shouldCreatePinHolderRole: boolean
}

const ActivateGuildPinForm = (): JSX.Element => {
  const checkboxBorderColor = useColorModeValue("gray.300", "inherit")

  const { isInvalidImage, pinImage, isTooSmallImage, onActivateModalClose } =
    useMintGuildPinContext()
  const setupRequired = isInvalidImage || isTooSmallImage

  const toast = useToast()

  const methods = useForm<ActivatePinForm>()

  const chain = useWatch({ control: methods.control, name: "chain" })
  const {
    field: {
      onChange: onShouldCreatePinHolderRoleChange,
      value: shouldCreatePinHolderRole,
      ...onShouldCreatePinHolderRoleControllerProps
    },
  } = useController({ control: methods.control, name: "shouldCreatePinHolderRole" })

  const { id: guildId } = useGuild()

  const { onSubmit: onEditGuildSubmit, isLoading: isEditGuildLoading } =
    useEditGuild({
      onSuccess: shouldCreatePinHolderRole
        ? () => {
            onCreateRoleSubmit({
              guildId,
              imageUrl: `${process.env.NEXT_PUBLIC_IPFS_GATEWAY}${pinImage}`,
              name: "Pin Holder",
              logic: "AND",
              requirements: [
                {
                  type: "ERC721",
                  chain,
                  address: GUILD_PIN_CONTRACTS[chain].address,
                  data: {
                    attributes: [
                      {
                        trait_type: "guildId",
                        value: guildId,
                      },
                    ],
                  },
                  isNegated: false,
                },
              ],
              rolePlatforms: [],
            })
          }
        : () => {
            toast({
              status: "success",
              title: "Success",
              description: "Successfully activated Guild Pin",
            })
            onActivateModalClose()
          },
    })

  const { onSubmit: onCreateRoleSubmit, isLoading: isCreateRoleLoading } =
    useCreateRole(onActivateModalClose)

  const activateGuildPin = (data: ActivatePinForm) => {
    onEditGuildSubmit({
      guildPin: {
        chain: data.chain,
        isActive: true,
      },
    })
  }

  const isLoading = isEditGuildLoading || isCreateRoleLoading

  return (
    <FormProvider {...methods}>
      <Stack w="full" spacing={4}>
        <ChainPicker
          controlName="chain"
          // TODO: uncomment this
          // supportedChains={Object.keys(GUILD_PIN_CONTRACTS) as Chain[]}
          supportedChains={["POLYGON_MUMBAI"]}
          showDivider={false}
        />

        <Checkbox
          {...onShouldCreatePinHolderRoleControllerProps}
          alignItems="start"
          sx={{
            "> .chakra-checkbox__control": {
              marginTop: 1,
              checkboxBorderColor,
            },
          }}
          _checked={{
            "> .chakra-checkbox__control[data-checked]": {
              bgColor: "green.500",
              borderColor: "green.500",
              color: "white",
            },
          }}
          isChecked={shouldCreatePinHolderRole}
          onChange={(e) => onShouldCreatePinHolderRoleChange(e.target.checked)}
        >
          Create a role for pin holders
        </Checkbox>

        <Button
          size="lg"
          colorScheme="green"
          isDisabled={setupRequired}
          w="full"
          onClick={methods.handleSubmit(activateGuildPin)}
          isLoading={isLoading}
          loadingText="Activating Guild Pin"
        >
          {setupRequired ? "Setup required" : "Activate Guild Pin"}
        </Button>
      </Stack>
    </FormProvider>
  )
}
export default ActivateGuildPinForm
