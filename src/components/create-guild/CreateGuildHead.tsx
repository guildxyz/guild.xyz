import { Layout } from "components/common/Layout"
import { useWatch } from "react-hook-form"

export function CreateGuildHead() {
  const name = useWatch({ name: "name" })
  const imageUrl = useWatch({ name: "imageUrl" })

  return <Layout.Head ogTitle={name || "Create Guild"} imageUrl={imageUrl} />
}
