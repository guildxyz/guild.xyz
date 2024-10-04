import { Badge } from "@/components/ui/Badge"
import { Skeleton } from "@/components/ui/Skeleton"
import { Visibility } from "components/[guild]/Visibility"
import dynamic from "next/dynamic"
import React, { ComponentType, PropsWithChildren } from "react"
import { useFormContext } from "react-hook-form"
import { useRequirementContext } from "./RequirementContext"
import { RequirementImage, RequirementImageCircle } from "./RequirementImage"
import ResetRequirementButton from "./ResetRequirementButton"
import { ViewOriginalPopover } from "./ViewOriginalPopover"

const DataProviderRequirement = dynamic(() => import("./DataProviderRequirement"))

export type RequirementProps = PropsWithChildren<{
  isImageLoading?: boolean
  image?: string | JSX.Element
  footer?: JSX.Element
  rightElement?: JSX.Element
  imageWrapper?: ComponentType<unknown>
  childrenWrapper?: ComponentType<unknown>
  showViewOriginal?: boolean
  dynamicDisplay?: boolean
}>

const Requirement = ({
  isImageLoading,
  image,
  footer,
  rightElement,
  children,
  imageWrapper,
  childrenWrapper,
  showViewOriginal,
  dynamicDisplay,
}: RequirementProps): JSX.Element => {
  const requirement = useRequirementContext()
  const { setValue } = useFormContext() ?? {}

  if (dynamicDisplay)
    return (
      <DataProviderRequirement
        {...{ isImageLoading, image, rightElement, children }}
      />
    )

  const ChildrenWrapper = childrenWrapper ?? "div"
  const ImageWrapper = imageWrapper ?? React.Fragment

  return (
    <div className="flex w-full items-center gap-4 py-2">
      <RequirementImageCircle isImageLoading={isImageLoading}>
        <ImageWrapper>
          <RequirementImage image={requirement?.data?.customImage || image} />
        </ImageWrapper>
      </RequirementImageCircle>

      <div className="flex flex-grow flex-col items-start">
        <ChildrenWrapper className="inline-block w-full">
          {requirement?.isNegated && <Badge className="mr-2">DON'T</Badge>}
          {requirement?.type === "LINK_VISIT"
            ? children
            : requirement?.data?.customName || children}
        </ChildrenWrapper>

        <div className="flex flex-wrap items-center gap-2 has-[>*]:mt-1">
          {!setValue && (
            <Visibility
              visibilityRoleId={requirement?.visibilityRoleId || null}
              entityVisibility={requirement?.visibility ?? "PUBLIC"}
              size="sm"
            />
          )}
          {footer}
          {showViewOriginal && (
            <ViewOriginalPopover>
              <div className="flex items-center gap-4">
                <RequirementImageCircle isImageLoading={isImageLoading}>
                  <RequirementImage image={image} />
                </RequirementImageCircle>
                <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:gap-4">
                  <p className="break-words">{children}</p>
                  {!!setValue && <ResetRequirementButton />}
                </div>
              </div>
            </ViewOriginalPopover>
          )}
        </div>
      </div>
      {rightElement}
    </div>
  )
}

export const RequirementSkeleton = () => (
  <Requirement isImageLoading={true}>
    <Skeleton className="h-4 max-w-[75%]" />
  </Requirement>
)

export { Requirement }
