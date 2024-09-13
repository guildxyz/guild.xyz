import { StickyAction } from "@/components/StickyAction"
import { isStickyActionStuckAtom } from "@/components/[guild]/constants"
import { ButtonGroup, ButtonProps, Divider, useColorMode } from "@chakra-ui/react"
import { useAtomValue } from "jotai"
import AddSolutionsButton from "solutions/components/AddSolutionsButton"
import { useMediaQuery } from "usehooks-ts"
import EditGuildButton from "./EditGuild"
import { useThemeContext } from "./ThemeContext"

const AddSolutionsAndEditGuildButton = () => {
  const isStickyActionStuck = useAtomValue(isStickyActionStuckAtom)
  const isMobile = useMediaQuery("(max-width: 640px")
  const { colorMode } = useColorMode()
  const { textColor, buttonColorScheme } = useThemeContext()

  const buttonProps = {
    size: { base: "xl", smd: "md" },
    variant: { base: "ghost", smd: "solid" },
    ...(!isStickyActionStuck && !isMobile
      ? {
          color: `${textColor} !important`,
          colorScheme: buttonColorScheme,
        }
      : colorMode === "light"
        ? {
            colorScheme: "gray",
          }
        : undefined),
  } satisfies ButtonProps

  return (
    <StickyAction>
      <ButtonGroup
        isAttached
        w={{ base: "full", smd: "auto" }}
        color="WindowText"
        flexDir={{ base: "row-reverse", smd: "row" }}
      >
        <AddSolutionsButton
          w={{ base: "full", smd: "auto" }}
          borderRadius={{ base: "none", smd: "xl" }}
          fontSize="md !important"
          {...buttonProps}
        />
        <Divider
          orientation="vertical"
          h={{ base: 14, smd: "var(--chakra-space-11)" }}
          borderColor={
            isStickyActionStuck && colorMode === "light" ? "gray.300" : undefined
          }
        />
        <EditGuildButton
          borderRadius={{ base: "none", smd: "xl" }}
          {...buttonProps}
        />
      </ButtonGroup>
    </StickyAction>
  )
}

export { AddSolutionsAndEditGuildButton }
