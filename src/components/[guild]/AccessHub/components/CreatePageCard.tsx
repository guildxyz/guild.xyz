import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { useDisclosure } from "@/hooks/useDisclosure"
import { FolderSimplePlus, Plus } from "@phosphor-icons/react/dist/ssr"
import CreateCampaignModal from "components/[guild]/CreateCampaignModal"

const CreatePageCard = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <Card className="flex flex-col justify-between p-5 sm:p-6">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-image text-white">
          <FolderSimplePlus weight="bold" className="size-5" />
        </div>

        <div className="flex flex-col">
          <span className="font-bold">Create page</span>
          <span className="text-muted-foreground text-sm">
            Group roles on a separate page
          </span>
        </div>
      </div>
      <Button variant="outline" onClick={onOpen}>
        <Plus weight="bold" />
        <span>Create page</span>
      </Button>
      <CreateCampaignModal isOpen={isOpen} onClose={onClose} />
    </Card>
  )
}

export { CreatePageCard }
