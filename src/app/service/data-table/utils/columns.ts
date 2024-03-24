import { DataLabel, HeaderLabel } from '../types/Label';

export interface ColumnInit<Item> {
	header: HeaderLabel<Item>;
	footer?: HeaderLabel<Item>;
	height: number;
	// plugins?: PluginColumnConfigs<Plugins>;
}

export class Column<Item> {
	header: HeaderLabel<Item>;
	footer?: HeaderLabel<Item>;
	height: number;
	//   plugins?: PluginColumnConfigs<Plugins>;
	constructor({ header, footer, height }: ColumnInit<Item>) {
		this.header = header;
		this.footer = footer;
		this.height = height;
		//  this.plugins = plugins;
	}

	isFlat(): this is FlatColumn<Item> {
		return '__flat' in this;
	}

	isData(): this is DataColumn<Item> {
		return '__data' in this;
	}

	isDisplay(): this is DisplayColumn<Item> {
		return '__display' in this;
	}

	isGroup(): this is GroupColumn<Item> {
		return '__group' in this;
	}
}

// -------------------------------------------

export type FlatColumnInit<
	Item,
	//   Plugins extends AnyPlugins = AnyPlugins,
	Id extends string = any
> = Omit<ColumnInit<Item>, 'height'> & {
	id?: Id;
};

export class FlatColumn<Item, Id extends string = any> extends Column<Item> {
	__flat = true;
	id: Id;
	constructor({ header, footer, id }: FlatColumnInit<Item>) {
		super({ header, footer, height: 1 });
		this.id = id ?? String(header);
	}
}

// --------------------------------------------

export type DataColumnInit<Item, Id extends string = string, Value = unknown> = DataColumnInitBase<Item, Value> &
	((Id extends keyof Item ? DataColumnInitKey<Item, Id> : never) | DataColumnInitIdAndKey<Item, Id, keyof Item> | DataColumnInitFnAndId<Item, Id, Value>);

export type DataColumnInitBase<Item, Value = unknown> = Omit<ColumnInit<Item>, 'height'> & {
	cell?: DataLabel<Item, Value>;
};

export type DataColumnInitKey<Item, Id extends keyof Item> = {
	accessor: Id;
	id?: Id;
};

export type DataColumnInitIdAndKey<Item, Id extends string, Key extends keyof Item> = {
	accessor: Key;
	id?: Id;
};

export type DataColumnInitFnAndId<Item, Id extends string, Value> = {
	accessor: keyof Item | ((item: Item) => Value);
	id?: Id;
};

export class DataColumn<Item, Id extends string = any, Value = any> extends FlatColumn<Item, Id> {
	__data = true;

	cell?: DataLabel<Item, Value>;
	accessorKey?: keyof Item;
	accessorFn?: (item: Item) => Value;
	constructor({ header, footer, cell, accessor, id }: DataColumnInit<Item, Id, Value>) {
		super({ header, footer, id: 'Initialization not complete' });
		this.cell = cell;
		if (accessor instanceof Function) {
			this.accessorFn = accessor;
		} else {
			this.accessorKey = accessor;
		}
		if (id === undefined && this.accessorKey === undefined && header === undefined) {
			throw new Error('A column id, string accessor, or header is required');
		}
		const accessorKeyId = typeof this.accessorKey === 'string' ? this.accessorKey : null;
		this.id = (id ?? accessorKeyId ?? String(header)) as Id;
	}

	getValue(item: Item): any {
		if (this.accessorFn !== undefined) {
			return this.accessorFn(item);
		}
		if (this.accessorKey !== undefined) {
			return item[this.accessorKey];
		}
		return undefined;
	}
}

// --------------------------------------------
// export type DisplayColumnDataGetter<Item> = (
// 	cell: DisplayBodyCell<Item>,
// 	state?: TableState<Item>
// ) => unknown;

export type DisplayColumnInit<Item, Id extends string = any> = FlatColumnInit<Item, Id> & {
	// cell: DisplayLabel<Item>;
	// data?: DisplayColumnDataGetter<Item>;
};

export class DisplayColumn<Item, Id extends string = any> extends FlatColumn<Item, Id> {
	__display = true;
	// cell: DisplayLabel<Item, Plugins>;
	// data?: DisplayColumnDataGetter<Item, Plugins>;
	constructor({
		header,
		footer,
		id
	}: //  cell,
	//  data,
	DisplayColumnInit<Item, Id>) {
		super({ header, footer, id });
		// this.cell = cell;
		// this.data = data;
	}
}

// --------------------------------------------

export type GroupColumnInit<Item> = Omit<ColumnInit<Item>, 'height'> & {
	columns: Column<Item>[];
};

export class GroupColumn<Item> extends Column<Item> {
	__group = true;
	columns: Column<Item>[];
	ids: string[];
	constructor({ header, footer, columns }: GroupColumnInit<Item>) {
		const height = Math.max(...columns.map((c) => c.height)) + 1;
		super({ header, footer, height });
		this.columns = columns;
		this.ids = getFlatColumnIds(columns);
	}
}

export const getFlatColumnIds = <Item>(columns: Column<Item>[]): string[] => columns.flatMap((c) => (c.isFlat() ? [c.id] : c.isGroup() ? c.ids : []));

export const getFlatColumns = <Item>(columns: Column<Item>[]): FlatColumn<Item>[] => {
	return columns.flatMap((c) => (c.isFlat() ? [c] : c.isGroup() ? getFlatColumns(c.columns) : []));
};
