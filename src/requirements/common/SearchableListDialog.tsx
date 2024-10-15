import {
  Dialog,
  DialogBody,
  DialogCloseButton,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/Dialog"
import { Input } from "@/components/ui/Input"
import { CircleNotch, MagnifyingGlass } from "@phosphor-icons/react/dist/ssr"
import { ReactNode } from "react"
import { useDebounceValue } from "usehooks-ts"

type Props = {
  trigger: ReactNode
  title: string
  initialList: string[]
  isLoading?: boolean
  footer?: ReactNode
  onSearchChange?: (newValue: string) => void
}

const SearchableListDialog = ({
  trigger,
  title,
  initialList,
  isLoading,
  footer,
  onSearchChange,
}: Props) => {
  const [search, setSearch] = useDebounceValue("", 300)

  const filteredList =
    initialList?.filter((address) =>
      address?.toLowerCase()?.includes(search?.toLowerCase())
    ) ?? []

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent size="lg" scrollBody>
        <DialogHeader className="gap-4">
          <DialogTitle>{title}</DialogTitle>
          <div className="relative">
            <Input
              onChange={(e) => {
                setSearch(e.target.value)
                onSearchChange?.(e.target.value)
              }}
              className="pr-8"
              placeholder="Search..."
            />
            <MagnifyingGlass
              weight="bold"
              className="absolute top-3 right-3 size-4 text-muted-foreground"
            />
          </div>
        </DialogHeader>

        <DialogBody
          scroll
          className="scroll-shadow min-h-40 [--scroll-shadow-bg:hsl(var(--card))]"
        >
          {isLoading ? (
            <CircleNotch className="mx-auto size-8 animate-spin" />
          ) : filteredList?.length > 0 ? (
            <ul>
              {filteredList.map((item) => (
                <li>{item}</li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground">No results</p>
          )}
        </DialogBody>

        {footer && <DialogFooter>{footer}</DialogFooter>}

        <DialogCloseButton />
      </DialogContent>
    </Dialog>
  )
}

export { SearchableListDialog }
