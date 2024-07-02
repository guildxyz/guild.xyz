import { Button } from "@/components/ui/Button"
import React from "react"

const Page = () => {
  console.log("signal from empty page")
  return (
    <div>
      an empty page with no dependencies
      <Button>regular button</Button>
    </div>
  )
}

export default Page
