import { Children, ReactElement, ReactNode, isValidElement } from "react"

export function doesComponentExistIn(
  parent: ReactNode,
  predicate: React.FC<unknown>
): boolean {
  let exists = false
  for (const child of Children.toArray(parent)) {
    if (isValidElement(child)) {
      const childElement = child as ReactElement
      if (childElement.type === predicate) {
        exists = true
        break
      } else if (childElement.props.children) {
        exists = doesComponentExistIn(childElement.props.children, predicate)
      }
    }
  }
  return exists
}
