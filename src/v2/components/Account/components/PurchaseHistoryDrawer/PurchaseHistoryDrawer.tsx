import { purchaseHistoryDrawerAtom } from "@/components/Providers/atoms"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/Drawer"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table"
import { DownloadSimple } from "@phosphor-icons/react"
import { useAtom } from "jotai"
import Link from "next/link"
import shortenHex from "utils/shortenHex"

export const PurchaseHistoryDrawer = () => {
  const [isOpen, setIsOpen] = useAtom(purchaseHistoryDrawerAtom)

  return (
    <Drawer open={isOpen} onClose={() => setIsOpen(false)}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle className="text-center">Purchase History</DrawerTitle>
        </DrawerHeader>
        <Table className="mb-4">
          <TableHeader>
            <TableRow className="[&>*]:whitespace-nowrap">
              <TableHead className="w-[100px]">Receipt</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Payment Address</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow className="[&>*]:whitespace-nowrap">
              <TableCell>
                <Link
                  href={"#view"}
                  className="flex items-center gap-1 font-medium text-blue-500 hover:text-blue-400"
                >
                  INV001 <DownloadSimple weight="bold" />
                </Link>
              </TableCell>
              <TableCell>Guild Pin</TableCell>
              <TableCell className="text-right">$250.00</TableCell>
              <TableCell>{new Date().toLocaleDateString()}</TableCell>
              <TableCell>{shortenHex()}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </DrawerContent>
    </Drawer>
  )
}
