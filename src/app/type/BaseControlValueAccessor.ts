import { inject } from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validator,
} from '@angular/forms';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs';
import { ZodAny, z } from 'zod';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

export abstract class BaseControlValueAccessor<
  T extends object,
  U extends object
> implements ControlValueAccessor, Validator
{
  protected fb = inject(FormBuilder);
  public form: FormGroup;
  abstract valueSchema: z.Schema<U>;

  protected constructor() {
    const controls = this.formSchema().parse(this.createFormControls());
    console.log(controls);

    this.form = this.fb.nonNullable.group<T>(controls);
    this.form.valueChanges
      .pipe(
        takeUntilDestroyed(),
        debounceTime(300),
        distinctUntilChanged(),
        tap((value: U) => this.handleFormChanges(value)),
        tap((value: U) => this._triggerOnChange(value))
      )
      .subscribe();
  }

  #onChange: (value: U) => void = () => {};

  #onTouched: () => void = () => {};

  #onValidationChange: () => void = () => {};

  protected _triggerOnChange(value: U): void {
    if (this.valueSchema.safeParse(value).success) {
      this.#onChange(value);
      this.#onValidationChange();
    }
  }

  protected _triggerOnTouched(): void {
    this.#onTouched();
    this.#onValidationChange();
  }

  writeValue(value: U): void {
    if (value && this.valueSchema.safeParse(value).success) {
      this.form.setValue(value, { emitEvent: false });
    }
  }

  registerOnChange(fn: (value: U) => void): void {
    this.#onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.#onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    throw new Error('Method not implemented.');
  }

  validate(control: AbstractControl<ZodAny, ZodAny>): ValidationErrors | null {
    const validationResult = this.valueSchema.safeParse(control.value);

    console.error('validate', validationResult);

    if (!validationResult.success) {
      // Convert Zod errors to Angular validation errors format (can be enhanced further)
      return { zodError: validationResult.error.errors };
    }

    return this.form.valid ? null : { valid: true };
  }

  // Optional: If you want to react to external validation changes
  registerOnValidatorChange?(fn: () => void): void {
    // This function can be used if external factors might affect the validation.
    // For example, if a different form control value change affects this control's validation.
    this.#onValidationChange = fn;
  }

  abstract formSchema(): z.Schema<T>;

  abstract createFormControls(): T;

  abstract handleFormChanges(value: U): void;
}
