import { atom, useAtom } from "jotai"
import { useEffect } from "react"

export const isAddRewardPanelDirtyAtom = atom(false)

export const useAddRewardDiscardAlert = (isDirty?: boolean) => {
  const [isAddRewardPanelDirty, setIsAddRewardPanelDirty] = useAtom<boolean>(
    isAddRewardPanelDirtyAtom
  )

  useEffect(() => {
    if (isDirty) setIsAddRewardPanelDirty(isDirty)
  }, [isDirty, setIsAddRewardPanelDirty])

  return [isAddRewardPanelDirty, setIsAddRewardPanelDirty] as const
}
