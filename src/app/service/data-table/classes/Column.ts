export type HeaderLabel<Item> = (cell: HeaderCell<Item>, state: any) => void | string;

export type HeaderCellInit<Item> = {
	id?: string;
	label: HeaderLabel<Item> | string;
	colspan: number;
	colstart: number;
};

export class HeaderCell<Item> {
	label: HeaderLabel<Item> | string;
	colspan: number;
	colstart: number;
	constructor({ id, label, colspan, colstart }: HeaderCellInit<Item>) {
		(this.label = label), (this.colspan = colspan);
		this.colstart = colstart;
	}
}

export interface ColumnInit<Item> {
	id?: string;
	//   header: string;
	header: HeaderLabel<Item> | string;
	footer?: HeaderLabel<Item>;
	height?: number;
	accessor?: Function | string;
	cells?: (item: Item) => string | HeaderCellInit<Item>;
}

export class Column<Item> {
	//   header: string;
	header: HeaderLabel<Item> | string;
	footer?: HeaderLabel<Item>;
	height?: number;

	constructor({ header, footer, height, accessor, id, cells }: ColumnInit<Item>) {
		this.header = header;
		this.footer = footer;
		this.height = height;

		Object.assign(this, this.isData(id, accessor, cells), this.isFlat(id), this.isDisplay(id, cells));
	}

	isFlat(id: string | undefined) {
		// id exist, height 1
		if (id === undefined) {
			return {
				__flat: true
			};
		} else {
			return {
				__flat: true,
				id: id,
				height: 1
			};
		}
	}

	isData(id: string | undefined, accessor: string | Function | undefined, cells: Function | HeaderCellInit<Item> | undefined) {
		if (accessor === undefined) return;
		const headerCell = new HeaderCell<Item>({
			id,
			label: String(this.header),
			colspan: 1,
			colstart: 0
		});
		return {
			__data: true,
			accessorKey: accessor,
			accessorFn: accessor === Function ? accessor : accessor === String ? accessor : undefined,
			id: id || accessor,
			...headerCell
		};
		// id, cell, accessorKey, accessorFn
	}

	isDisplay(id: string | undefined, cells: Function | HeaderCellInit<Item> | undefined) {
		// id, cell, data
		let headerCell: Function | HeaderCellInit<Item> | undefined = undefined;
		if (cells === undefined) return;
		if (cells instanceof Function) {
			headerCell = cells;
		} else {
			headerCell = new HeaderCell<Item>(cells);
		}
		return {
			__display: true,
			...headerCell,
			id: id || 'aduha apaaya'
		};
	}

	isGroup(id: string | undefined, columns: Column<Item>[], data: any) {
		// ids, columns, data, const height = Math.max(...columns.map((c) => c.height)) + 1;

		return {
			__group: true,
			columns: columns
			// ids : getFlatColumnIds(columns),
			// height?: Math.max(...columns.map((c) => c.height)) + 1,
		};
	}
}

// export const getFlatColumnIds = <Item>(columns: Column<Item>[]): string[] =>
//   columns.flatMap((c) => (c.isFlat() ? [c.id] : c.isGroup() ? c.ids : []));

// export const getFlatColumns = <Item>(
//   columns: Column<Item>[]
// ): FlatColumn<Item>[] => {
//   return columns.flatMap((c) =>
//     c.isFlat() ? [c] : c.isGroup() ? getFlatColumns(c.columns) : []
//   );
// };
