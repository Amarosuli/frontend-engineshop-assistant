const NBSP = ' ';

export type HeaderGroup = {
  type: 'group';
  header: string;
  colspan: number;
  sort: any;
};

export type HeaderLeaf<Item extends object> = {
  type: 'data';
  header: string;
  colspan: 1;
  key: keyof Item;
  sort: any;
};

export type HeaderBlank = {
  type: 'blank';
  header: typeof NBSP;
  colspan: 1;
  sort: any;
};

export type Header<Item extends object> =
  | HeaderGroup
  | HeaderLeaf<Item>
  | HeaderBlank;
