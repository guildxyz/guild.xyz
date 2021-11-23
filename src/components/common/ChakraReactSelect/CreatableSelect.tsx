/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { forwardRef } from "react"
import CreatableReactSelect from "react-select/creatable"
import ChakraReactSelect from "./ChakraReactSelect"
import { ChakraSelectProps } from "./types"

const CreatableSelect = forwardRef<any, ChakraSelectProps>((props, ref) => (
  <ChakraReactSelect {...props}>
    <CreatableReactSelect ref={ref} />
  </ChakraReactSelect>
))

export default CreatableSelect
