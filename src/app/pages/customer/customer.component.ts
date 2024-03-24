import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { z } from 'zod';

import { CustomerRequest, ZodCustomerDataSchema } from '../../type/Customer';
import { ErrorHandlerService } from '../../service/error/error.service';
import { CustomerService } from '../../service/customer.service';
import { FadeIn, SlideIn } from '../../shared/transition/animation';
import { createTable } from '../../service/data-table/dataTable';
import { Column } from '../../service/data-table/classes/Column';

@Component({
	selector: 'app-customer',
	standalone: true,
	animations: [FadeIn(200, 200, false), SlideIn(200, 200)],
	imports: [CommonModule, ReactiveFormsModule, FormsModule, LucideAngularModule],
	templateUrl: './customer.component.html',
	styleUrl: './customer.component.scss'
})
export class CustomerComponent implements OnInit {
	// column config
	tableData = signal<any[]>([]);
	dataTableService = createTable(this.tableData);

	columnConfig = this.dataTableService.createColumns<any>([
		new Column({
			header: 'No.',
			accessor: (index: any) => {
				return index + 1;
			}
		}),
		new Column({
			header: 'Id',
			accessor: 'id'
		}),
		new Column({
			header: 'Name',
			accessor: 'name'
		}),
		new Column({
			header: 'Description',
			accessor: 'description'
		}),
		new Column({
			header: 'Alias',
			accessor: 'alias'
		})
	]);
	viewModel = this.dataTableService.createViewModels(this.columnConfig);
	headerRows = this.viewModel.headerRows;
	bodyRows = this.viewModel.bodyRows;

	fb = inject(FormBuilder);
	errorHandler = inject(ErrorHandlerService);

	customerService = inject(CustomerService);
	customers: z.infer<typeof ZodCustomerDataSchema>[] = [];
	currentPage: number = 0;
	hasNext: boolean = false;
	hasPrev: boolean = false;
	lastPage: boolean = true;

	// pop up
	activeLayer: string[] = [];

	show(layerName: string) {
		this.activeLayer.push(layerName);
	}
	hide(event: MouseEvent, layerName: string) {
		if ((event.target as HTMLElement).classList.contains('parent') || (event.target as HTMLElement).classList.contains('cancel-btn')) {
			this.activeLayer = this.activeLayer.filter((v) => v !== layerName);
		}
	}

	showEditForm(data: any) {
		this.activeLayer.push('form-edit');

		this.customerForm.setValue({
			name: data.name,
			description: data.description,
			alias: data.alias
		});
	}

	// form control
	customerForm = this.fb.group({
		name: ['', [Validators.required, Validators.minLength(3)]],
		description: [''],
		alias: ['']
	});

	saveCustomer() {
		if (this.customerForm.invalid) return;
		this.customerService.createCustomer(this.customerForm.value as CustomerRequest).subscribe({
			next: (res) => {
				window.location.reload();
			},
			error: (err) => {
				this.errorHandler.handle(err, 'Error Occured');
			}
		});
	}

	next() {
		if (this.hasNext == true) {
			this.customerService
				.getCustomers({
					totalItemsPerPage: 3,
					currentPage: this.currentPage + 1
				})
				.subscribe({
					next: (customers) => {
						this.currentPage = customers.body.currentPage;
						this.hasNext = customers.body.hasNext;
						this.hasPrev = customers.body.hasPrev;
						this.lastPage = customers.body.lastPage;

						this.customers = customers.body.data;
						this.tableData.update((v) => customers.body.data);
					},
					error: (error) => console.log(error)
				});
		}
	}
	prev() {
		if (this.hasPrev) {
			this.customerService
				.getCustomers({
					totalItemsPerPage: 3,
					currentPage: this.currentPage - 1
				})
				.subscribe({
					next: (customers) => {
						this.currentPage = customers.body.currentPage;
						this.hasNext = customers.body.hasNext;
						this.hasPrev = customers.body.hasPrev;
						this.lastPage = customers.body.lastPage;

						this.customers = customers.body.data;
						this.tableData.update((v) => customers.body.data);
					},
					error: (error) => console.log(error)
				});
		}
	}
	refresh() {
		this.customerService.getCustomers({ totalItemsPerPage: 3, currentPage: this.currentPage }).subscribe({
			next: (customers) => {
				this.customers = customers.body.data;
			},
			error: (error) => console.log(error)
		});
	}

	deleteCustomer(id: string) {
		this.customerService.deleteCustomer(id).subscribe({ next: () => this.refresh() });
	}
	destroyCustomer(id: string) {
		this.customerService.destroyCustomer(id).subscribe({ next: () => this.refresh() });
	}
	recoverCustomer(id: string) {
		this.customerService.recoverCustomer(id).subscribe({ next: () => this.refresh() });
	}

	ngOnInit(): void {
		this.customerService
			.getCustomers({
				totalItemsPerPage: 3,
				currentPage: 0
			})
			.subscribe({
				next: (customers) => {
					this.currentPage = customers.body.currentPage;
					this.hasNext = customers.body.hasNext;
					this.hasPrev = customers.body.hasPrev;
					this.lastPage = customers.body.lastPage;

					this.customers = customers.body.data;
					this.tableData.set(customers.body.data);
				},
				error: (error) => console.log(error)
			});
	}
}
