import { SortOrder } from '../types/SortOrder';
import { ListTable } from '../types/TableData';

export function sortNumberFn(a: any, b: any, sortOrder: SortOrder) {
	if (sortOrder === 'asc') {
		return a > b ? 1 : -1;
	} else if (sortOrder === 'desc') {
		return a > b ? -1 : 1;
	} else {
		return 0;
	}
}

export function sortStringFn(a: any, b: any, sortOrder: SortOrder) {
	const _a = a.toLowerCase();
	const _b = b.toLowerCase();
	if (sortOrder === 'asc') {
		return _a > _b ? 1 : -1;
	} else if (sortOrder === 'desc') {
		return _b > _a ? 1 : -1;
	} else {
		return 0;
	}
}

export function sortBooleanFn(a: any, b: any, sortOrder: SortOrder) {
	if (sortOrder === 'asc') {
		return a === b ? 0 : a ? 1 : -1;
	} else if (sortOrder === 'desc') {
		return a === b ? 0 : a ? -1 : 1;
	} else {
		return 0;
	}
}

export function sortObject(
	array: ListTable[],
	sortBy: keyof ListTable,
	sortOrder?: SortOrder
) {
	return array.sort((a: ListTable, b: ListTable): number => {
		//  console.log(typeof a[sortBy]);

		if (typeof a[sortBy] === 'string') {
			return sortStringFn(a[sortBy], b[sortBy], sortOrder);
		} else if (typeof a[sortBy] === 'number') {
			return sortNumberFn(a[sortBy], b[sortBy], sortOrder);
		} else if (typeof a[sortBy] === 'boolean') {
			return sortBooleanFn(a[sortBy], b[sortBy], sortOrder);
		} else {
			return 0;
		}
	});
}
