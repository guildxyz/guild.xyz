import { Button } from "@/components/ui/Button"
import {
  Dialog,
  DialogBody,
  DialogCloseButton,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog"
import {
  FormControl,
  FormErrorMessage,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/Form"
import { Input } from "@/components/ui/Input"
import { useErrorToast } from "@/components/ui/hooks/useErrorToast"
import { useToast } from "@/components/ui/hooks/useToast"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRolePlatform } from "components/[guild]/RolePlatforms/components/RolePlatformProvider"
import { Dispatch, SetStateAction } from "react"
import { FormProvider, useForm } from "react-hook-form"
import tokenRewardPoolAbi from "static/abis/tokenRewardPool"
import {
  ERC20_CONTRACTS,
  ERC20_SUPPORTED_CHAINS,
} from "utils/guildCheckout/constants"
import processViemContractError from "utils/processViemContractError"
import { WriteContractParameters } from "viem"
import { useWriteContract } from "wagmi"
import { z } from "zod"

type Props = {
  open: boolean
  onOpenChange: Dispatch<SetStateAction<boolean>>
  onSuccess: () => void
}

const TransferPoolOwnershipFormSchema = z.object({
  transferPoolOwnershipTo: z
    .string()
    .regex(/^0x[0-9a-f]{40}$/i, "Invalid EVM address")
    .transform((str) => str as `0x${string}`),
})

const TransferPoolOwnershipDialog = ({ open, onOpenChange, onSuccess }: Props) => {
  const { guildPlatform } = useRolePlatform()

  const form = useForm<z.infer<typeof TransferPoolOwnershipFormSchema>>({
    resolver: zodResolver(TransferPoolOwnershipFormSchema),
    defaultValues: {
      transferPoolOwnershipTo: "" as `0x${string}`,
    },
  })

  const { writeContract, isPending } = useWriteContract()

  const { toast } = useToast()
  const errorToast = useErrorToast()

  return (
    <Dialog open={open} onOpenChange={(open) => onOpenChange(open)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Transfer pool ownership</DialogTitle>
        </DialogHeader>

        <DialogBody>
          <FormProvider {...form}>
            <FormField
              control={form.control}
              name="transferPoolOwnershipTo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New owner's EVM address:</FormLabel>
                  <FormControl>
                    <Input placeholder="0x..." {...field} />
                  </FormControl>
                  <FormErrorMessage />
                </FormItem>
              )}
            />
          </FormProvider>
        </DialogBody>

        <DialogFooter>
          <Button
            colorScheme="destructive"
            isLoading={isPending}
            loadingText="Transferring ownership"
            onClick={form.handleSubmit((data) =>
              writeContract(
                {
                  abi: tokenRewardPoolAbi,
                  // TODO: should we use `guildPlatform.platformGuildData.contractAddress` here instead?
                  address:
                    ERC20_CONTRACTS[
                      guildPlatform.platformGuildData
                        .chain as (typeof ERC20_SUPPORTED_CHAINS)[number]
                    ],
                  functionName: "transferPoolOwnership",
                  args: [
                    BigInt(guildPlatform.platformGuildData.poolId),
                    data.transferPoolOwnershipTo,
                  ],
                  // This looks pretty strange, but we need it until we don't switch to strictNullChecks: true...
                } as any satisfies WriteContractParameters<
                  typeof tokenRewardPoolAbi
                >,
                {
                  onSuccess: () => {
                    toast({
                      variant: "success",
                      title: "Successfully transferred pool ownership",
                    })
                    onOpenChange(false)
                    onSuccess()
                  },
                  onError: (error) =>
                    errorToast(processViemContractError(error) ?? "Unknown error"),
                }
              )
            )}
          >
            Transfer ownership
          </Button>
        </DialogFooter>

        <DialogCloseButton />
      </DialogContent>
    </Dialog>
  )
}

export { TransferPoolOwnershipDialog }
