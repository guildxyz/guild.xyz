import { Layout } from "components/common/CompoundLayout"
import { useWatch } from "react-hook-form"

export function CreateGuildHead() {
  const name = useWatch({ name: "name" })
  const imageUrl = useWatch({ name: "imageUrl" })

  return <Layout.Head title={name || "Create Guild"} imageUrl={imageUrl} />
}
