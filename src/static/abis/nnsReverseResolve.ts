const nnsReverseResolveAbi = [
  {
    inputs: [
      { internalType: "address", name: "_nns", type: "address" },
      { internalType: "address", name: "_ens", type: "address" },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "ens",
    outputs: [{ internalType: "contract ENS", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "nns",
    outputs: [{ internalType: "contract ENS", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "addr", type: "address" }],
    name: "resolve",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
] as const

export default nnsReverseResolveAbi
