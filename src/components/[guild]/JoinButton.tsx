import { MobileFooter } from "@/components/MobileFooter"
import { Button } from "@/components/ui/Button"
import { useMediaQuery } from "usehooks-ts"
import { useOpenJoinModal } from "./JoinModal/JoinModalProvider"

const JoinButton = (): JSX.Element => {
  const openJoinModal = useOpenJoinModal()
  const isMobile = useMediaQuery("(max-width: 640px)")

  return (
    <MobileFooter>
      <Button
        colorScheme="success"
        {...(isMobile ? { size: "xl", variant: "subtle" } : {})}
        className="w-full rounded-none sm:w-auto sm:rounded-2xl"
        onClick={openJoinModal}
      >
        Join Guild
      </Button>
    </MobileFooter>
  )
}

export { JoinButton }
