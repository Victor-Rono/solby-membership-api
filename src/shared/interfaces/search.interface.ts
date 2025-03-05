export interface SearchInterface {
  search?: string;
  filter?: string;
  sort?: string;
  country?: string;
  category?: string;
  order?: 'ASC' | 'DESC';
}

export interface SearchFieldsInterface {
  field: string;
  displayText: string;
}

export interface FilteredItemsInterface {
  reset: boolean;
  items: any[];
}
