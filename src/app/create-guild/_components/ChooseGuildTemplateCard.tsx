import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar"
import { Button, buttonVariants } from "@/components/ui/Button"
import { Skeleton } from "@/components/ui/Skeleton"
import { cn } from "@/lib/utils"
import { AnimationProps, motion } from "framer-motion"
import { useCreateGuildContext } from "./CreateGuildProvider"

type Variants = Record<"hide" | "show", AnimationProps["animate"]>

const rootVariants = {
  hide: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { duration: 0.2, delay: 0.2, delayChildren: 0.4, ease: "easeOut" },
  },
} satisfies Variants

const categoryListVariants = {
  hide: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { duration: 0.2, staggerChildren: 0.1, ease: "easeOut" },
  },
} satisfies Variants

const categoryVariants = {
  hide: { opacity: 0, translateY: 16, scale: 0.95 },
  show: {
    opacity: 1,
    translateY: 0,
    scale: 1,
    transition: { duration: 0.1, ease: "easeOut" },
  },
} satisfies Variants

const slideFadeInVariants = {
  hide: { opacity: 0, translateY: 16 },
  show: {
    opacity: 1,
    translateY: 0,
    transition: { duration: 0.2, ease: "easeOut" },
  },
} satisfies Variants

const contentVariants = categoryListVariants

const MotionButton = motion(Button)

const ChooseGuildTemplateCard = () => {
  const { templates } = useCreateGuildContext()

  return (
    <motion.div
      className="grid grid-cols-3"
      variants={rootVariants}
      initial="hide"
      animate="show"
    >
      <motion.div
        className="flex flex-col gap-2 bg-card-secondary p-6"
        variants={categoryListVariants}
      >
        {templates.map((template) => (
          <motion.div
            key={template.id}
            className={cn(
              buttonVariants({
                variant: "ghost",
                className: "flex h-16 justify-start gap-4 border border-border p-4",
              })
            )}
            variants={categoryVariants}
          >
            <Avatar className="row-span-2 size-8">
              <AvatarImage
                src={template.imageUrl}
                alt={`${template.name} logo`}
                width={32}
                height={48}
              />
              <AvatarFallback>
                <Skeleton className="size-full" />
              </AvatarFallback>
            </Avatar>
            <span className="font-bold">{template.name}</span>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        className="col-span-2 flex flex-col gap-6 p-6"
        variants={contentVariants}
      >
        <motion.div
          className="flex aspect-video items-center justify-center rounded-xl border border-border font-semibold text-2xl text-muted-foreground"
          variants={slideFadeInVariants}
        >
          Choose a template
        </motion.div>
        <div className="flex items-end justify-center gap-6">
          <div className="flex flex-col gap-1">
            <motion.span className="font-bold" variants={slideFadeInVariants}>
              DeFi
            </motion.span>
            <motion.p
              className="text-muted-foreground"
              variants={slideFadeInVariants}
            >
              Motivate and reward users for their participation and contributions.
            </motion.p>
          </div>

          <MotionButton
            colorScheme="success"
            className="px-6"
            variants={slideFadeInVariants}
          >
            Create guild
          </MotionButton>
        </div>
      </motion.div>
    </motion.div>
  )
}
export { ChooseGuildTemplateCard }
