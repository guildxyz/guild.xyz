import DynamicDevTool from "components/create-guild/DynamicDevTool"
import { useFormContext } from "react-hook-form"
import { GuildFormType } from "types"

export function CreateGuildDynamicDevTool() {
  const { control } = useFormContext<GuildFormType>()
  return <DynamicDevTool control={control} />
}
