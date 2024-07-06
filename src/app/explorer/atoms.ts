import { atom } from "jotai"
import { ActiveSection } from "./types"

export const isNavStuckAtom = atom(false)
export const isSeachStuckAtom = atom(false)
export const activeSectionAtom = atom(ActiveSection.YourGuilds)

// const { ref: navToggleRef, isStuck: isNavStuck } = useIsStuck()
// const { ref: searchRef, isStuck: isSearchStuck } = useIsStuck()
// const [activeSection, setActiveSection] = useState<ActiveSection>(
//   ActiveSection.YourGuilds
// )
// const spyActiveSection = useScrollspy(Object.values(ActiveSection), 100)
// useEffect(() => {
//   if (!spyActiveSection) return
//   setActiveSection(spyActiveSection as ActiveSection)
// }, [spyActiveSection])
