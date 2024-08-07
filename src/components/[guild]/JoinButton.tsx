import { MobileFooter } from "@/components/MobileFooter"
import { Button } from "@/components/ui/Button"
import { useOpenJoinModal } from "./JoinModal/JoinModalProvider"

const JoinButton = (): JSX.Element => {
  const openJoinModal = useOpenJoinModal()

  return (
    <MobileFooter>
      <Button colorScheme="success" className="h-10" onClick={openJoinModal}>
        Join Guild to get roles
      </Button>
    </MobileFooter>
  )
}

export { JoinButton }
