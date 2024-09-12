"use client"

import { Card } from "@/components/ui/Card"
import { cn } from "@/lib/utils"
import { AnimatePresence, LayoutGroup, motion } from "framer-motion"
import { ChooseGuildTemplate } from "./ChooseGuildTemplate"
import { CreateGuildCard } from "./CreateGuildCard"
import { useCreateGuildContext } from "./CreateGuildProvider"

const MotionCard = motion(Card)

const CreateGuildContent = () => {
  const { step } = useCreateGuildContext()

  return (
    <LayoutGroup>
      <MotionCard
        layout
        style={{ borderRadius: "16px" }}
        transition={{ delay: 0.125 }}
        className={cn("mx-auto", {
          "max-w-md": step === "GENERAL_DETAILS",
        })}
      >
        <AnimatePresence initial={false} mode="wait" presenceAffectsLayout={false}>
          {step === "GENERAL_DETAILS" ? (
            <CreateGuildCard key="GENERAL_DETAILS" />
          ) : step === "CHOOSE_TEMPLATE" ? (
            <ChooseGuildTemplate key="CHOOSE_TEMPLATE" />
          ) : null}
        </AnimatePresence>
      </MotionCard>
    </LayoutGroup>
  )
}
export default CreateGuildContent
