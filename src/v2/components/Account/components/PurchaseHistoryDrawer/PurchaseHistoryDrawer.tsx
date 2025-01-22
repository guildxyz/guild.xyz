import { CopyableAddress } from "@/components/CopyableAddress"
import { purchaseHistoryDrawerAtom } from "@/components/Providers/atoms"
import { Button } from "@/components/ui/Button"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/Drawer"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu"
import { IconButton } from "@/components/ui/IconButton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/Tooltip"
import { useErrorToast } from "@/components/ui/hooks/useErrorToast"
import {
  CircleNotch,
  ClockClockwise,
  DotsThreeVertical,
  DownloadSimple,
} from "@phosphor-icons/react/dist/ssr"
import { useAtom } from "jotai"
import { useEffect, useRef } from "react"
import * as customChains from "static/customChains"
import * as viemChains from "viem/chains"
import { OrderStatusBadge } from "./components/OrderStatusBadge"
import { Order, useOrders } from "./hooks/useOrders"
import { useReceiptDownload } from "./hooks/useReceiptDownload"
import { prettyDate } from "@/lib/prettyDate"

const getChainInfo = (chainId: number): { symbol: string; name: string } => {
  const allChains = [...Object.values(customChains), ...Object.values(viemChains)]

  const chain = allChains.find((chain) => chain.id === chainId)
  if (chain) {
    return {
      symbol: chain.nativeCurrency.symbol,
      name: chain.name,
    }
  }

  throw new Error(`Chain with id ${chainId} not found`)
}

const getTotal = (order: Order) => {
  return order.items?.reduce(
    (acc, item) => acc + item.pricePerUnit * item.quantity,
    0
  )
}

export const PurchaseHistoryDrawer = () => {
  const isInitialMount = useRef(true)
  const [isOpen, setIsOpen] = useAtom(purchaseHistoryDrawerAtom)
  const {
    orders,
    isLoading: isLoadingMore,
    isReachingEnd,
    error,
    loadMore,
    mutate,
  } = useOrders(isOpen)

  const {
    downloadReceipt,
    isLoading,
    error: receiptDownloadError,
  } = useReceiptDownload()

  const errorToast = useErrorToast()

  useEffect(() => {
    if (receiptDownloadError) errorToast(receiptDownloadError)
    if (error)
      errorToast({ error: error.message, correlationId: error?.correlationId })
  }, [receiptDownloadError, error, errorToast])

  useEffect(() => {
    if (isOpen) {
      if (!isInitialMount.current) {
        mutate()
      }
      isInitialMount.current = false
    }
  }, [isOpen, mutate])

  return (
    <Drawer open={isOpen} onClose={() => setIsOpen(false)}>
      <DrawerContent className="max-h-[90vh] pb-10">
        <DrawerHeader>
          <DrawerTitle className="text-center">
            Purchase History{" "}
            <IconButton
              icon={<ClockClockwise weight="bold" />}
              isLoading={isLoadingMore}
              aria-label="Refresh"
              className="ml-2 rounded-full"
              onClick={() => mutate()}
            />
          </DrawerTitle>
        </DrawerHeader>
        <div className="overflow-y-auto">
          <Table className="mb-4">
            <TableHeader className="sticky top-0 bg-card shadow-sm">
              <TableRow className="[&>*]:whitespace-nowrap">
                <TableHead className="w-[100px] pl-6">Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Items</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead>Chain</TableHead>
                <TableHead>Payment Address</TableHead>
                <TableHead className="">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders?.map((order) => {
                if (!order.cryptoDetails) return <></>
                return (
                  <TableRow className="[&>*]:whitespace-nowrap" key={order._id}>
                    <TableCell className="pl-6">
                      {prettyDate(order.createdAt)}
                    </TableCell>
                    <TableCell className="capitalize">
                      <OrderStatusBadge
                        status={order.status}
                        createdAt={order.createdAt}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span>{order.items[0].name}</span>
                        {order.items[0].quantity > 1 && (
                          <span className="text-gray-500 text-xs">
                            ×{order.items[0].quantity}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      {getTotal(order)}{" "}
                      {getChainInfo(order.cryptoDetails.chainId).symbol}
                    </TableCell>
                    <TableCell>
                      {getChainInfo(order.cryptoDetails.chainId).name}
                    </TableCell>
                    <TableCell>
                      <CopyableAddress address={order.cryptoDetails.walletAddress} />
                    </TableCell>
                    <TableCell className="w-[32px]">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <IconButton
                            aria-label="Open menu"
                            variant="outline"
                            size="sm"
                            icon={<DotsThreeVertical weight="bold" />}
                          />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent side="left">
                          <Tooltip>
                            <TooltipTrigger>
                              <DropdownMenuItem
                                className="flex items-center gap-2 px-4 font-semibold"
                                disabled={
                                  order.receipt?.status !== "available" ||
                                  !order.receipt?.externalId ||
                                  isLoading
                                }
                                onSelect={(e) => {
                                  e.preventDefault()
                                }}
                                onClick={(e) => {
                                  e.stopPropagation()
                                  if (order.receipt?.externalId)
                                    downloadReceipt(order.receipt.externalId)
                                }}
                              >
                                {isLoading ? (
                                  <>
                                    <CircleNotch
                                      weight="bold"
                                      className="animate-spin"
                                    />{" "}
                                    Loading...
                                  </>
                                ) : (
                                  <>
                                    <DownloadSimple weight="bold" /> Download Receipt{" "}
                                  </>
                                )}
                              </DropdownMenuItem>
                            </TooltipTrigger>
                            {order.receipt?.status !== "available" && (
                              <TooltipContent>Receipt not available</TooltipContent>
                            )}
                          </Tooltip>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )
              })}
              {orders.length === 0 && !isLoadingMore && (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center text-secondary-subtle"
                  >
                    No orders found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        {!isReachingEnd && orders.length > 0 && (
          <Button
            className="mx-auto w-fit"
            onClick={loadMore}
            isLoading={isLoadingMore}
            loadingText="Loading..."
          >
            Show more
          </Button>
        )}
      </DrawerContent>
    </Drawer>
  )
}
