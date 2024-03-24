import { Signal, WritableSignal, computed, effect, signal } from '@angular/core';
import { SortOrder } from './types/SortOrder';
import { ListTable } from './types/TableData';
import { sortObject } from './utils/sortFn';
import { Column, ColumnInit } from './classes/Column';

export class DataTableService {
	currentOrder: SortOrder = undefined;
	currentSortedId!: keyof ListTable;
	lastSortedId!: keyof ListTable;
	listId: WritableSignal<any[]> = signal([]);
	listOriginal!: WritableSignal<ListTable[]>;
	listDataCopy!: Signal<ListTable[]>;
	list!: WritableSignal<ListTable[]>;

	constructor(data: WritableSignal<ListTable[]>) {
		this.setData(data);
		computed(() => {
			data();
			this.sort(this.listId()[0] as never);
		});
		effect(() => {
			this.listDataCopy();
			console.log(this.getSorted());
		});
	}

	setData(data: WritableSignal<ListTable[]>) {
		console.log('run');

		this.listOriginal = data;
		this.listDataCopy = computed(() => {
			let value = data();
			return JSON.parse(JSON.stringify(value));
		});
		this.list = data;
	}

	column<Item>(columnDef: ColumnInit<Item>) {
		return new Column(columnDef);
	}

	createColumns<Item>(columns: Item[]): Item[] {
		const listId = columns.map((c: any) => {
			return c.id;
		});
		this.listId.set(listId);

		return columns.map((c: any) => ({
			...c,
			state: {
				sort: (sortBy: keyof ListTable) => this.sort(sortBy),
				sortState: computed(() => {
					return this.getSorted();
				}),
				sortOrder: computed(() => {
					const orderState = this.getSorted();
					const order = orderState.id === c.id ? orderState.order : '';
					return order;
				})
			}
		}));
	}

	createViewModels<Item extends object>(columnData: Item[]) {
		return {
			dataRows: this.list(),
			headerRows: () => {
				return [
					{
						id: 0,
						attrsForName: {},
						propsForName: {},
						cells: columnData,
						state: {
							sort: this.sort
						}
					}
				];
			},
			bodyRows: computed(() => {
				const dummy = this.list().map((v: any, index) => {
					const ids: (keyof typeof v)[] = this.listId();

					return {
						cells: () => {
							// v ini harus sesuai dengan yang di define di DataColumn
							// biar yang ke render di td nanti juga yang hanya terdefine di DataColumn
							const keys: (keyof typeof v)[] = Object.keys(v) as (keyof typeof v)[];
							// @ts-ignore
							return ids.map((k) => {
								if (typeof k === 'function') {
									// @ts-ignore
									return { id: k, value: k(index, v) };
								}

								return { id: k, value: v[k] };
							});
						}
					};
				});

				return dummy;
			}),

			footerRows: null,
			state: this.createState()
		};
	}

	createState() {
		return {
			onRowClick: computed(() => {}),
			onRowSelect: computed(() => {}),
			onSort: computed(() => {})
		};
	}

	getSorted = computed(() => {
		this.list();
		return {
			id: this.currentSortedId,
			order: this.currentOrder
		};
	});

	sort(sortBy: keyof ListTable) {
		console.log('is running first ?');

		this.lastSortedId = sortBy;
		if (this.lastSortedId !== this.currentSortedId) this.currentOrder = undefined;

		if (this.currentOrder === undefined) {
			const sorted = sortObject(this.listOriginal(), sortBy, 'asc');
			this.list.set([...sorted]);
			this.currentOrder = 'asc';
		} else if (this.currentOrder === 'asc') {
			const sorted = sortObject(this.listOriginal(), sortBy, 'desc');
			this.list.set([...sorted]);
			this.currentOrder = 'desc';
		} else if (this.currentOrder === 'desc') {
			this.list.set([...this.listDataCopy()]);
			this.currentOrder = undefined;
		}

		this.currentSortedId = sortBy;
	}
}

export function createTable(data: WritableSignal<ListTable[]>) {
	return new DataTableService(data);
}
