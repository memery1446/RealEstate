// src/contracts/abis/PropertyManager.ts
export const PropertyManagerABI = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "propertyId",
        type: "uint256"
      },
      {
        indexed: true,
        internalType: "address",
        name: "tenant",
        type: "address"
      }
    ],
    name: "LeaseInitiated",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "propertyId",
        type: "uint256"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "requestId",
        type: "uint256"
      }
    ],
    name: "MaintenanceRequested",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "propertyId",
        type: "uint256"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "requestId",
        type: "uint256"
      }
    ],
    name: "MaintenanceResolved",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address"
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address"
      }
    ],
    name: "OwnershipTransferred",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "account",
        type: "address"
      }
    ],
    name: "Paused",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "propertyId",
        type: "uint256"
      },
      {
        indexed: false,
        internalType: "address",
        name: "owner",
        type: "address"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "rentAmount",
        type: "uint256"
      }
    ],
    name: "PropertyListed",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "propertyId",
        type: "uint256"
      },
      {
        indexed: true,
        internalType: "address",
        name: "tenant",
        type: "address"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256"
      }
    ],
    name: "RentPaid",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "account",
        type: "address"
      }
    ],
    name: "Unpaused",
    type: "event"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_rentAmount",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "_securityDeposit",
        type: "uint256"
      }
    ],
    name: "addProperty",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address"
      }
    ],
    name: "approvedPaymentTokens",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_propertyId",
        type: "uint256"
      },
      {
        internalType: "address",
        name: "_tenant",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "_leaseDuration",
        type: "uint256"
      }
    ],
    name: "inititateLease",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    name: "maintenanceRequestCount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    name: "maintenanceRequests",
    outputs: [
      {
        internalType: "uint256",
        name: "requestId",
        type: "uint256"
      },
      {
        internalType: "string",
        name: "description",
        type: "string"
      },
      {
        internalType: "uint256",
        name: "timestamp",
        type: "uint256"
      },
      {
        internalType: "bool",
        name: "resolved",
        type: "bool"
      },
      {
        internalType: "uint256",
        name: "cost",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "pause",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "paused",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_propertyId",
        type: "uint256"
      },
      {
        internalType: "address",
        name: "_paymentToken",
        type: "address"
      }
    ],
    name: "payRent",
    outputs: [],
    stateMutability: "payable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    name: "properties",
    outputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "rentAmount",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "securityDeposit",
        type: "uint256"
      },
      {
        internalType: "address",
        name: "currentTenant",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "leaseStart",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "leaseEnd",
        type: "uint256"
      },
      {
        internalType: "bool",
        name: "active",
        type: "bool"
      },
      {
        internalType: "enum PropertyManager.PropertyStatus",
        name: "status",
        type: "uint8"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "propertyCount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_propertyId",
        type: "uint256"
      },
      {
        internalType: "string",
        name: "_description",
        type: "string"
      }
    ],
    name: "requestMaintenance",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_token",
        type: "address"
      },
      {
        internalType: "bool",
        name: "_approved",
        type: "bool"
      }
    ],
    name: "setPaymentToken",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address"
      }
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "unpause",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  }
] as const;

