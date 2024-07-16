import { Badge } from "@/components/ui/Badge"
import { buttonVariants } from "@/components/ui/Button"
import Link from "next/link"
import { connectorButtonBaseProps } from "./ConnectorButton"

const ExportCWaaSLink = () => (
  <Link
    href="/cwaas-export"
    className={buttonVariants({ ...connectorButtonBaseProps, variant: "outline" })}
  >
    <img src={`/walletLogos/google.svg`} alt={`Google logo`} className="h-6" />
    Google
    <Badge className="ml-auto">Deprecated</Badge>
  </Link>
)

export { ExportCWaaSLink }
