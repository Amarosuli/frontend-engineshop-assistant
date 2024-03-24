import { HeaderCell } from './HeaderCell';

// export type Label<Item extends Object> = string | ((data: Item[]) => string);

export type DataLabel<Item, Value = any> = (
	//   cell: DataBodyCell<Item, Value>,
	state: any
) => void;

export type DisplayLabel<Item> = (
	//   cell: DisplayBodyCell<Item>,
	state: any
) => void;

export type HeaderLabel<Item> =
	| ((cell: HeaderCell<Item>, state: any) => void)
	| string;
