/**
 * Can be used in Reorder.Group when we'd like to reorder form fields.
 *
 * Returns an array with 2 indexes which we can pass to the `swap` function
 */

const getFieldIndexesToSwap = (originalOrder: string[], newOrder: string[]) => {
  const indexesToSwap: number[] = []

  for (const [i, fieldId] of originalOrder.entries()) {
    const fieldIndexInNewOrder = newOrder.findIndex(
      (newFieldId) => newFieldId === fieldId
    )
    if (fieldIndexInNewOrder !== i) indexesToSwap.push(i)
  }

  const [indexA, indexB] = indexesToSwap
  return [indexA, indexB]
}

export default getFieldIndexesToSwap
