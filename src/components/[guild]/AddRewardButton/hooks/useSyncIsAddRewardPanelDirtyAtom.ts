import { useAtom } from "jotai"
import { useEffect } from "react"
import { UseFormReturn } from "react-hook-form"
import { isAddRewardPanelDirtyAtom } from "../AddRewardButton"

export const useSyncIsAddRewardPanelDirtyAtom = (methods: UseFormReturn<any>) => {
  const [, setIsAddRewardPanelDirty] = useAtom(isAddRewardPanelDirtyAtom)

  useEffect(() => {
    setIsAddRewardPanelDirty(methods.formState.isDirty)
  }, [methods.formState.isDirty])
}
