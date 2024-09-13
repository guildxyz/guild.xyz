import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar"
import { buttonVariants } from "@/components/ui/Button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/RadioGroup"
import { Skeleton } from "@/components/ui/Skeleton"
import { cn } from "@/lib/utils"
import { AnimationProps, motion } from "framer-motion"
import { useFormContext } from "react-hook-form"
import { CreateGuildFormType } from "../types"
import { CreateGuildButton } from "./CreateGuildButton"
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

const MotionRadioGroup = motion(RadioGroup)
const ChooseGuildTemplate = () => {
  const { templates } = useCreateGuildContext()
  const { setValue } = useFormContext<CreateGuildFormType>()

  return (
    <motion.div
      className="grid grid-cols-3"
      variants={rootVariants}
      initial="hide"
      animate="show"
    >
      <MotionRadioGroup
        className="gap-2 bg-card-secondary p-6"
        variants={categoryListVariants}
        onValueChange={(newTemplateUrlName) => {
          const template = templates.find((t) => t.urlName === newTemplateUrlName)
          setValue("theme", template?.theme)
          setValue("roles", template?.roles ?? [])
          setValue("guildPlatforms", template?.guildPlatforms)
        }}
      >
        {templates.map((template) => (
          <motion.div key={template.urlName} variants={categoryVariants}>
            <RadioGroupItem
              value={template.urlName}
              id={template.urlName}
              className="hidden [&~label]:data-[state=checked]:border-primary [&~label]:data-[state=checked]:ring-1 [&~label]:data-[state=checked]:ring-primary"
            />
            <label
              htmlFor={template.urlName}
              tabIndex={0}
              className={cn(
                buttonVariants({
                  variant: "ghost",
                  className:
                    "flex h-16 justify-start gap-4 border border-border p-4",
                })
              )}
            >
              <Avatar className="row-span-2 size-8">
                <AvatarImage
                  src={template.imageUrl ?? ""}
                  alt={`${template.name} logo`}
                  width={32}
                  height={48}
                />
                <AvatarFallback>
                  <Skeleton className="size-full" />
                </AvatarFallback>
              </Avatar>
              <span className="font-bold">{template.name}</span>
            </label>
          </motion.div>
        ))}
      </MotionRadioGroup>

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
          <div className="flex w-full flex-col gap-1">
            <motion.span className="font-bold" variants={slideFadeInVariants}>
              Choose a template
            </motion.span>
            <motion.p
              className="text-muted-foreground"
              variants={slideFadeInVariants}
            >
              You can now choose a Guild template now.
            </motion.p>
          </div>

          <motion.div variants={slideFadeInVariants}>
            <CreateGuildButton />
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  )
}
export { ChooseGuildTemplate }
