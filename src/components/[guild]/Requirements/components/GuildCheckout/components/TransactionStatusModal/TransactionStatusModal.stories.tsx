import type { Meta, StoryObj } from "@storybook/react"

import { ConfettiProvider } from "@/components/Confetti"
import { Anchor } from "@/components/ui/Anchor"
import { FuelProvider } from "@fuels/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { fuelConfig } from "fuelConfig"
import { ThemeProvider } from "next-themes"
import { useEffect } from "react"
import { WagmiProvider } from "wagmi"
import { wagmiConfig } from "wagmiConfig"
import {
  TransactionStatusProvider,
  useTransactionStatusContext,
} from "../TransactionStatusContext"
import { TransactionStatusModal } from "./TransactionStatusModal"

const queryClient = new QueryClient()

const TransactionStatusDialogStory = () => (
  <>
    <TransactionStatusModal
      title="Dialog title"
      successTitle="Success"
      successText={"This is the success text!"}
      successLinkComponent={
        <Anchor
          href="https://sepolia.etherscan.io/tx/0xbb2da2efbfc465f63c100036d25c626ac96a1167d48f80646e91be3361179160"
          target="_blank"
          showExternal
          variant="muted"
        >
          View TX on Etherscan
        </Anchor>
      }
      errorComponent={<p>An error occurred</p>}
      progressComponent={
        <>
          <p className="mb-2 font-bold">You'll get:</p>
          <p>Some really cool rewards!</p>
        </>
      }
      successComponent={
        <>
          <p className="mb-2 font-bold">Your new asset:</p>
          <p>Just a Storybook story</p>
        </>
      }
    />
  </>
)

const meta: Meta<typeof TransactionStatusDialogStory> = {
  title: "Guild UI/TransactionStatusDialog",
  component: TransactionStatusDialogStory,
  decorators: [
    (Story) => (
      <ThemeProvider>
        <WagmiProvider config={wagmiConfig}>
          <QueryClientProvider client={queryClient}>
            <FuelProvider ui={false} fuelConfig={fuelConfig}>
              <TransactionStatusProvider>
                <ConfettiProvider>
                  <Story />
                </ConfettiProvider>
              </TransactionStatusProvider>
            </FuelProvider>
          </QueryClientProvider>
        </WagmiProvider>
      </ThemeProvider>
    ),
  ],
}

export default meta

type Story = StoryObj<typeof TransactionStatusDialogStory>

export const Progress: Story = {
  decorators: [
    (Story) => {
      const { onTxModalOpen, setTxHash } = useTransactionStatusContext()

      useEffect(() => {
        setTxHash(
          "0xbb2da2efbfc465f63c100036d25c626ac96a1167d48f80646e91be3361179160"
        )
        onTxModalOpen()
      }, [])

      return <Story />
    },
  ],
}

export const Error: Story = {
  decorators: [
    (Story) => {
      const { onTxModalOpen, setTxError } = useTransactionStatusContext()

      useEffect(() => {
        setTxError(true)
        onTxModalOpen()
      }, [])

      return <Story />
    },
  ],
}

export const Success: Story = {
  decorators: [
    (Story) => {
      const { onTxModalOpen, setTxSuccess } = useTransactionStatusContext()

      useEffect(() => {
        setTxSuccess(true)
        onTxModalOpen()
      }, [])

      return <Story />
    },
  ],
}
