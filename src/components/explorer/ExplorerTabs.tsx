import Tabs from "components/[guild]/Tabs"
import TabButton from "components/[guild]/Tabs/components/TabButton"
import useScrollspy from "hooks/useScrollSpy"

const ExplorerTabs = ({ yourGuildsRef, allGuildsRef, ...rest }) => {
  const activeSection = useScrollspy(["yourGuilds", "allGuilds"], 100)

  return (
    /**
     * Not simply using anchor links with `scrollBehavior: smooth`, because that way
     * the scroll animates when navigating to a guild page too, and the page jumps to
     * the anchor instead of restoring position when coming back
     */
    <Tabs {...rest}>
      <TabButton
        isActive={activeSection !== "allGuilds"}
        onClick={() =>
          window.scrollTo({
            top:
              window.scrollY +
              yourGuildsRef.current.getBoundingClientRect().top -
              80,
            behavior: "smooth",
          })
        }
      >
        Your guilds
      </TabButton>
      <TabButton
        isActive={activeSection === "allGuilds"}
        onClick={() =>
          window.scrollTo({
            top:
              window.scrollY + allGuildsRef.current.getBoundingClientRect().top - 20,
            behavior: "smooth",
          })
        }
      >
        Explore guilds
      </TabButton>
    </Tabs>
  )
}

export default ExplorerTabs
