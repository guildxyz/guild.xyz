const delegateRegistryAbi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "vault",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "delegate",
        type: "address",
      },
      { indexed: false, internalType: "bool", name: "value", type: "bool" },
    ],
    name: "DelegateForAll",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "vault",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "delegate",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "contract_",
        type: "address",
      },
      { indexed: false, internalType: "bool", name: "value", type: "bool" },
    ],
    name: "DelegateForContract",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "vault",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "delegate",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "contract_",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      { indexed: false, internalType: "bool", name: "value", type: "bool" },
    ],
    name: "DelegateForToken",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "vault",
        type: "address",
      },
    ],
    name: "RevokeAllDelegates",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "vault",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "delegate",
        type: "address",
      },
    ],
    name: "RevokeDelegate",
    type: "event",
  },
  {
    inputs: [
      { internalType: "address", name: "delegate", type: "address" },
      { internalType: "address", name: "vault", type: "address" },
    ],
    name: "checkDelegateForAll",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "delegate", type: "address" },
      { internalType: "address", name: "vault", type: "address" },
      { internalType: "address", name: "contract_", type: "address" },
    ],
    name: "checkDelegateForContract",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "delegate", type: "address" },
      { internalType: "address", name: "vault", type: "address" },
      { internalType: "address", name: "contract_", type: "address" },
      { internalType: "uint256", name: "tokenId", type: "uint256" },
    ],
    name: "checkDelegateForToken",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "delegate", type: "address" },
      { internalType: "bool", name: "value", type: "bool" },
    ],
    name: "delegateForAll",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "delegate", type: "address" },
      { internalType: "address", name: "contract_", type: "address" },
      { internalType: "bool", name: "value", type: "bool" },
    ],
    name: "delegateForContract",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "delegate", type: "address" },
      { internalType: "address", name: "contract_", type: "address" },
      { internalType: "uint256", name: "tokenId", type: "uint256" },
      { internalType: "bool", name: "value", type: "bool" },
    ],
    name: "delegateForToken",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "vault", type: "address" }],
    name: "getContractLevelDelegations",
    outputs: [
      {
        components: [
          { internalType: "address", name: "contract_", type: "address" },
          { internalType: "address", name: "delegate", type: "address" },
        ],
        internalType: "struct IDelegationRegistry.ContractDelegation[]",
        name: "contractDelegations",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "vault", type: "address" }],
    name: "getDelegatesForAll",
    outputs: [{ internalType: "address[]", name: "delegates", type: "address[]" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "vault", type: "address" },
      { internalType: "address", name: "contract_", type: "address" },
    ],
    name: "getDelegatesForContract",
    outputs: [{ internalType: "address[]", name: "delegates", type: "address[]" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "vault", type: "address" },
      { internalType: "address", name: "contract_", type: "address" },
      { internalType: "uint256", name: "tokenId", type: "uint256" },
    ],
    name: "getDelegatesForToken",
    outputs: [{ internalType: "address[]", name: "delegates", type: "address[]" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "delegate", type: "address" }],
    name: "getDelegationsByDelegate",
    outputs: [
      {
        components: [
          {
            internalType: "enum IDelegationRegistry.DelegationType",
            name: "type_",
            type: "uint8",
          },
          { internalType: "address", name: "vault", type: "address" },
          { internalType: "address", name: "delegate", type: "address" },
          { internalType: "address", name: "contract_", type: "address" },
          { internalType: "uint256", name: "tokenId", type: "uint256" },
        ],
        internalType: "struct IDelegationRegistry.DelegationInfo[]",
        name: "info",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "vault", type: "address" }],
    name: "getTokenLevelDelegations",
    outputs: [
      {
        components: [
          { internalType: "address", name: "contract_", type: "address" },
          { internalType: "uint256", name: "tokenId", type: "uint256" },
          { internalType: "address", name: "delegate", type: "address" },
        ],
        internalType: "struct IDelegationRegistry.TokenDelegation[]",
        name: "tokenDelegations",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "revokeAllDelegates",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "delegate", type: "address" }],
    name: "revokeDelegate",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "vault", type: "address" }],
    name: "revokeSelf",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "bytes4", name: "interfaceId", type: "bytes4" }],
    name: "supportsInterface",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
] as const

export default delegateRegistryAbi
