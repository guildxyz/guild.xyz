import { useDraggable } from "@dnd-kit/core"
import { ReactNode } from "react"

const Draggable = ({ id, children }: { id: string; children?: ReactNode }) => {
  const { attributes, listeners, setNodeRef } = useDraggable({ id })

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={{ touchAction: "none" }}
    >
      {children}
    </div>
  )
}

export default Draggable
