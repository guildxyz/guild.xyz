import {
  Dialog,
  DialogBody,
  DialogCloseButton,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/Dialog"
import { Input } from "@/components/ui/Input"
import { MagnifyingGlass } from "@phosphor-icons/react/dist/ssr"
import { ReactNode } from "react"
import { useDebounceValue } from "usehooks-ts"

type Props = {
  trigger: ReactNode
  title: string
  initialList: string[]
}

const SearchableListDialog = ({ trigger, title, initialList }: Props) => {
  const [search, setSearch] = useDebounceValue("", 300)

  const filteredList =
    initialList?.filter((address) =>
      address?.toLowerCase()?.includes(search?.toLowerCase())
    ) ?? []

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent scrollBody>
        <DialogHeader className="gap-4">
          <DialogTitle>{title}</DialogTitle>
          <div className="relative">
            <Input onChange={(e) => setSearch(e.target.value)} className="pr-8" />
            <MagnifyingGlass
              weight="bold"
              className="absolute top-3 right-3 size-4 text-muted-foreground"
            />
          </div>
        </DialogHeader>

        <DialogBody
          scroll
          className="scroll-shadow [--scroll-shadow-bg:hsl(var(--card))]"
        >
          {filteredList?.length > 0 ? (
            <ul>
              {filteredList.map((item) => (
                <li>{item}</li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground">No results</p>
          )}
        </DialogBody>

        <DialogCloseButton />
      </DialogContent>
    </Dialog>
  )
}

export { SearchableListDialog }
