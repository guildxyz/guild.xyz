export type PaginatedResponse<Item = unknown> = {
  page: number;
  pageSize: number;
  sortBy: string;
  reverse: boolean;
  searchQuery: string;
  query: string;
  items: Item[];
  total: number;
};

export type DynamicRoute<T extends Record<string, string>> = {
  params: T;
};

const G = {
  id: "8dcc0fc6-31e6-4e6c-b24b-19b5a4f244ca",
  createdAt: 1732304836273,
  updatedAt: 1732304836273,
  name: "Basic Template",
  urlName: "basic-template",
  description: "This template provides basic functionality for...",
  imageUrl: "https://example.com/images/template.jpg",
  backgroundImageUrl: "https://example.com/images/background.jpg",
  visibility: {},
  settings: {},
  searchTags: [],
  categoryTags: [],
  socialLinks: {},
};

const RG = {
  id: "ff3b37ed-727e-5ab3-a202-32f9e3387e5a",
  legacyId: "1024",
  createdAt: "1725848548765",
  updatedAt: "1725848548765",
  name: "#RR",
  urlName: "rr",
  description: "",
  imageUrl:
    "https://guild-xyz.mypinata.cloud/ipfs/QmfVFG6mFMtFzNYsKXyN3FffBmpZzrqWcycBgDYjLzg14C",
  visibility: {
    hideFromGuildPage: false,
  },
  settings: {
    position: 0,
  },
  guildId: "32feb189-9b03-59c8-a1ef-7b296cbc42e6",
  type: "CATEGORY",
};

const R = {
  id: "85afa420-f3d6-5113-a978-1eea9f2ef543",
  legacyId: "17184",
  createdAt: "1664067944168",
  updatedAt: "1677588151210",
  system: {
    lastSyncedAt: null,
  },
  name: '"Loser" Skellie Chimps',
  urlName: "loser-skellie-chimps",
  description: "hold Loser from Skellie Chimps",
  imageUrl: "/guildLogos/213.svg",
  visibility: {
    hidden: false,
    hideFromEyes: false,
  },
  settings: {
    position: 0,
    anyOfNum: 0,
    logic: "AND",
  },
  guildId: "30c83783-db7e-58b3-b890-3afd77ad8af3",
  groupId: "",
  members: "0",
};

export type Guild = typeof G;
export type RoleGroup = typeof RG;
export type Role = typeof R;
