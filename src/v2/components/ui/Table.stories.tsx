import type { Meta, StoryObj } from "@storybook/react"
import Link from "next/link"
import shortenHex from "utils/shortenHex"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./Table"

const TableExample = () => (
  <Table>
    <TableCaption>A list of your recent purchases.</TableCaption>
    <TableHeader>
      <TableRow>
        <TableHead className="w-[100px]">ID</TableHead>
        <TableHead>Name</TableHead>
        <TableHead>Payment Address</TableHead>
        <TableHead>Date</TableHead>
        <TableHead className="text-right">Amount (USD)</TableHead>
        <TableHead>Receipt</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow>
        <TableCell className="font-medium">INV001</TableCell>
        <TableCell>Guild Pin</TableCell>
        <TableCell>{shortenHex()}</TableCell>
        <TableCell>{new Date().toLocaleDateString()}</TableCell>
        <TableCell className="text-right">$250.00</TableCell>
        <TableCell>
          <Link href={"#view"} className="text-blue-500 hover:text-blue-400">
            View
          </Link>
        </TableCell>
      </TableRow>
    </TableBody>
  </Table>
)

const meta: Meta<typeof TableExample> = {
  title: "Design system/Table",
  component: TableExample,
}

export default meta

type Story = StoryObj<typeof TableExample>

export const Default: Story = {}
