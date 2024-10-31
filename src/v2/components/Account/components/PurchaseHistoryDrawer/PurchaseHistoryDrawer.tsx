import { purchaseHistoryDrawerAtom } from "@/components/Providers/atoms"
import { Button } from "@/components/ui/Button"
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
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
import { useBilling } from "@/hooks/useBilling"
import { DownloadSimple } from "@phosphor-icons/react"
import { useFetcherWithSign } from "hooks/useFetcherWithSign"
import useShowErrorToast from "hooks/useShowErrorToast"
import { useAtom } from "jotai"
import { useEffect } from "react"
import shortenHex from "utils/shortenHex"
import { useAccount } from "wagmi"

export const PurchaseHistoryDrawer = () => {
  const [isOpen, setIsOpen] = useAtom(purchaseHistoryDrawerAtom)
  const { address } = useAccount()

  const {
    receipts,
    pagination,
    mutate: refetch,
    loadMore,
    isLoading,
    isValidating,
  } = useBilling()

  useEffect(() => {
    if (isOpen) refetch()
  }, [isOpen, refetch])

  const showLoadMore =
    !!pagination && pagination.currentPage !== pagination.totalPages

  const fetcherWithSign = useFetcherWithSign()
  const showErrorToast = useShowErrorToast()

  const download = async (receiptId: string) => {
    try {
      const blob = await fetcherWithSign([
        `/v2/users/${address}/purchase-history/download/${receiptId}`,
        {
          method: "GET",
          headers: {
            Accept: "application/pdf",
            "Content-Type": "application/pdf",
          },
        },
      ])

      const url = window.URL.createObjectURL(blob)
      window.open(url)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Error in submit function:", error)
      showErrorToast(
        "Failed to load receipt, please try again later or contact support"
      )
    }
  }

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerContent className="max-h-[80vh] select-text">
        <DrawerHeader>
          <DrawerTitle className="text-center">Purchase History</DrawerTitle>
        </DrawerHeader>
        <div className="flex-1 overflow-auto p-4">
          <div className="h-full overflow-auto rounded-md border">
            <Table className="select-text">
              <TableHeader>
                <TableRow className="hover:bg-accent/50">
                  <TableHead className="w-[100px]">Receipt</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Payment Address</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {receipts.map((receipt) => (
                  <TableRow key={receipt.externalId} className="hover:bg-accent/50">
                    <TableCell className="font-medium">
                      <button
                        onClick={() => download(receipt.externalId)}
                        className="flex cursor-pointer flex-row items-center justify-center border-none bg-transparent p-0 font-normal text-blue-500 hover:text-blue-700"
                      >
                        {receipt.externalId}
                        <DownloadSimple
                          weight="bold"
                          className="ml-1 inline-block"
                        />
                      </button>
                    </TableCell>
                    <TableCell>{receipt.itemName}</TableCell>
                    <TableCell className="text-right">
                      {receipt.totalPrice} USD
                    </TableCell>
                    <TableCell>
                      {new Date(receipt.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{shortenHex(receipt.paymentAddress)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
        <DrawerFooter>
          {showLoadMore && (
            <Button
              variant="outline"
              onClick={loadMore}
              isLoading={isLoading || isValidating}
              loadingText="Loading..."
            >
              Load More
            </Button>
          )}
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
