import { HeaderLabel } from './Label';

export type HeaderGroupCell = {};

export type HeaderLeafCell = {};

export type HeaderBlankCell = {};

// export type HeaderCell = HeaderGroupCell | HeaderLeafCell | HeaderBlankCell;

export type HeaderCellInit<Item> = {
	id: string;
	label: HeaderLabel<Item>;
	colspan: number;
	colstart: number;
};

export class HeaderCell<Item> {
	label: HeaderLabel<Item>;
	colspan: number;
	colstart: number;
	constructor({ id, label, colspan, colstart }: HeaderCellInit<Item>) {
		(this.label = label), (this.colspan = colspan);
		this.colstart = colstart;
	}
}
