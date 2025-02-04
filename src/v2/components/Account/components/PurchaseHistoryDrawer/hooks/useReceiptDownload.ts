import useUser from "components/[guild]/hooks/useUser"
import { useFetcherWithSign } from "hooks/useFetcherWithSign"
import { useState } from "react"

export const useReceiptDownload = () => {
  const fetcherWithSign = useFetcherWithSign()
  const { id: userId } = useUser()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<any>(null)

  const downloadReceipt = async (receiptId: string) => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await fetcherWithSign([
        `/v2/users/${userId}/orders/download`,
        {
          method: "POST",
          body: {
            receiptId,
          },
        },
      ])

      const arrayBuffer = await response.arrayBuffer()
      const blob = new Blob([arrayBuffer], { type: "application/pdf" })
      const url = window.URL.createObjectURL(blob)

      const link = document.createElement("a")
      link.href = url
      link.download = `receipt-${receiptId}.pdf`
      document.body.appendChild(link)
      link.click()

      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error: any) {
      console.log(error)
      setError(error)
    } finally {
      setIsLoading(false)
    }
  }

  return { downloadReceipt, isLoading, error }
}
