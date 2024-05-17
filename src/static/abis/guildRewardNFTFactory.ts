const guildRewardNFTFacotryAbi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "previousAdmin",
        type: "address",
      },
      { indexed: false, internalType: "address", name: "newAdmin", type: "address" },
    ],
    name: "AdminChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "beacon", type: "address" },
    ],
    name: "BeaconUpgraded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: "uint256", name: "newFee", type: "uint256" },
    ],
    name: "FeeChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "enum IGuildRewardNFTFactory.ContractType",
        name: "contractType",
        type: "uint8",
      },
      { indexed: false, internalType: "address", name: "newNFT", type: "address" },
    ],
    name: "ImplementationChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: "uint8", name: "version", type: "uint8" },
    ],
    name: "Initialized",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      { indexed: true, internalType: "address", name: "newOwner", type: "address" },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: "address", name: "deployer", type: "address" },
      {
        indexed: false,
        internalType: "address",
        name: "tokenAddress",
        type: "address",
      },
      {
        indexed: false,
        internalType: "enum IGuildRewardNFTFactory.ContractType",
        name: "contractType",
        type: "uint8",
      },
    ],
    name: "RewardNFTDeployed",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "newTreasury",
        type: "address",
      },
    ],
    name: "TreasuryChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "implementation",
        type: "address",
      },
    ],
    name: "Upgraded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "newValidSigner",
        type: "address",
      },
    ],
    name: "ValidSignerChanged",
    type: "event",
  },
  {
    inputs: [
      { internalType: "string", name: "name", type: "string" },
      { internalType: "string", name: "symbol", type: "string" },
      { internalType: "string", name: "cid", type: "string" },
      { internalType: "address", name: "tokenOwner", type: "address" },
      { internalType: "address payable", name: "tokenTreasury", type: "address" },
      { internalType: "uint256", name: "tokenFee", type: "uint256" },
    ],
    name: "deployBasicNFT",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          { internalType: "string", name: "name", type: "string" },
          { internalType: "string", name: "symbol", type: "string" },
          { internalType: "string", name: "cid", type: "string" },
          { internalType: "address", name: "tokenOwner", type: "address" },
          { internalType: "address payable", name: "treasury", type: "address" },
          { internalType: "uint256", name: "tokenFee", type: "uint256" },
          { internalType: "bool", name: "soulbound", type: "bool" },
          { internalType: "uint256", name: "maxSupply", type: "uint256" },
          {
            internalType: "uint256",
            name: "mintableAmountPerUser",
            type: "uint256",
          },
        ],
        internalType: "struct IGuildRewardNFTFactory.ConfigurableNFTConfig",
        name: "nftConfig",
        type: "tuple",
      },
    ],
    name: "deployConfigurableNFT",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "fee",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "deployer", type: "address" }],
    name: "getDeployedTokenContracts",
    outputs: [
      {
        components: [
          { internalType: "address", name: "contractAddress", type: "address" },
          {
            internalType: "enum IGuildRewardNFTFactory.ContractType",
            name: "contractType",
            type: "uint8",
          },
        ],
        internalType: "struct IGuildRewardNFTFactory.Deployment[]",
        name: "tokens",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getFeeData",
    outputs: [
      { internalType: "uint256", name: "tokenFee", type: "uint256" },
      { internalType: "address payable", name: "treasuryAddress", type: "address" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address payable", name: "treasuryAddress", type: "address" },
      { internalType: "uint256", name: "fee", type: "uint256" },
      { internalType: "address", name: "validSignerAddress", type: "address" },
    ],
    name: "initialize",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "enum IGuildRewardNFTFactory.ContractType",
        name: "contractType",
        type: "uint8",
      },
    ],
    name: "nftImplementations",
    outputs: [{ internalType: "address", name: "contractAddress", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "proxiableUUID",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "newFee", type: "uint256" }],
    name: "setFee",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "enum IGuildRewardNFTFactory.ContractType",
        name: "contractType",
        type: "uint8",
      },
      { internalType: "address", name: "newNFT", type: "address" },
    ],
    name: "setNFTImplementation",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address payable", name: "newTreasury", type: "address" },
    ],
    name: "setTreasury",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "newValidSigner", type: "address" }],
    name: "setValidSigner",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "newOwner", type: "address" }],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "treasury",
    outputs: [{ internalType: "address payable", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "newImplementation", type: "address" },
    ],
    name: "upgradeTo",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "newImplementation", type: "address" },
      { internalType: "bytes", name: "data", type: "bytes" },
    ],
    name: "upgradeToAndCall",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "validSigner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
] as const

export default guildRewardNFTFacotryAbi
