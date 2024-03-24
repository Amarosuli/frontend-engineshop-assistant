import { DataLabel, DisplayLabel } from '../types/Label';
import { DataColumn, DisplayColumn, FlatColumn } from './columns';

export type BodyCellInit<Item> = {
  id: string;
  row: BodyRow<Item>;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export type BodyCellAttributes<Item> = {
  role: 'cell';
};

export abstract class BodyCell<Item> extends TableComponent<
  Item,
  'tbody.tr.td'
> {
  abstract column: FlatColumn<Item>;
  row: BodyRow<Item>;
  constructor({ id, row }: BodyCellInit<Item>) {
    super({ id });
    this.row = row;
  }

  abstract render(): void;

  attrs(): BodyCellAttributes<Item> {
    return derived(super.attrs(), ($baseAttrs) => {
      return {
        ...$baseAttrs,
        role: 'cell' as const,
      };
    });
  }

  abstract clone(): BodyCell<Item>;

  rowColId(): string {
    return `${this.row.id}:${this.column.id}`;
  }

  dataRowColId(): string | undefined {
    if (!this.row.isData()) {
      return undefined;
    }
    return `${this.row.dataId}:${this.column.id}`;
  }

  // TODO Workaround for https://github.com/vitejs/vite/issues/9528
  isData(): this is DataBodyCell<Item> {
    return '__data' in this;
  }

  // TODO Workaround for https://github.com/vitejs/vite/issues/9528
  isDisplay(): this is DisplayBodyCell<Item> {
    return '__display' in this;
  }
}

export type DataBodyCellInit<Item, Value = unknown> = Omit<
  BodyCellInit<Item>,
  'id'
> & {
  column: DataColumn<Item>;
  label?: DataLabel<Item, Value>;
  value: Value;
};

export type DataBodyCellAttributes<Item> = BodyCellAttributes<Item>;

export class DataBodyCell<Item, Value = unknown> extends BodyCell<Item> {
  // TODO Workaround for https://github.com/vitejs/vite/issues/9528
  __data = true;

  column: DataColumn<Item>;
  label?: DataLabel<Item, Value>;
  value: Value;
  constructor({ row, column, label, value }: DataBodyCellInit<Item, Value>) {
    super({ id: column.id, row });
    this.column = column;
    this.label = label;
    this.value = value;
  }

  render(): any {
    if (this.label === undefined) {
      return `${this.value}`;
    }
    if (this.state === undefined) {
      throw new Error('Missing `state` reference');
    }
    return this.label(this as DataBodyCell<Item, Value>, this.state);
  }

  clone(): DataBodyCell<Item> {
    const clonedCell = new DataBodyCell({
      row: this.row,
      column: this.column,
      label: this.label,
      value: this.value,
    });
    return clonedCell;
  }
}

export type DisplayBodyCellInit<Item> = Omit<BodyCellInit<Item>, 'id'> & {
  column: DisplayColumn<Item>;
  label: DisplayLabel<Item>;
};

export class DisplayBodyCell<Item> extends BodyCell<Item, Plugins> {
  // TODO Workaround for https://github.com/vitejs/vite/issues/9528
  __display = true;

  column: DisplayColumn<Item>;
  label: DisplayLabel<Item>;
  constructor({ row, column, label }: DisplayBodyCellInit<Item>) {
    super({ id: column.id, row });
    this.column = column;
    this.label = label;
  }

  render(): void {
    if (this.state === undefined) {
      throw new Error('Missing `state` reference');
    }
    return this.label(this, this.state);
  }

  clone(): DisplayBodyCell<Item> {
    const clonedCell = new DisplayBodyCell({
      row: this.row,
      column: this.column,
      label: this.label,
    });
    return clonedCell;
  }
}
