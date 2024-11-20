// dumping here types util it comes down properly

export {}

declare global {
  type Guild = {
    name: string;
    id: string;
    urlName: string;
    createdAt: number;
    updatedAt: number;
    description: string;
    imageUrl: string;
    backgroundImageUrl: string;
    visibility: Record<string, string>;
    settings: Record<string, string>;
    searchTags: string[];
    categoryTags: string[];
    socialLinks: Record<string, string>;
    owner: string;
  };

  type PaginatedResponse<Item extends any> = {
    page: number;
    pageSize: number;
    sortBy: string;
    reverse: boolean;
    searchQuery: string;
    query: string;
    items: Item[];
    total: number;
  };
}
