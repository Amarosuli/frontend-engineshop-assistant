import { z } from 'zod';
import { ZodApiResponse } from '../type/Api';
import { BaseControlValueAccessor } from './BaseControlValueAccessor';

export type CustomerData = {
  id: string;
  name: string;
  description: string;
  email: string;
  alias: string;
  deleted: boolean;
};
export type CustomerRequest = {
  name: string;
  description?: string;
  email?: string;
  alias?: string;
};

export const ZodCustomerRequestSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  email: z.string().optional(),
  alias: z.string().optional(),
});

export const ZodCustomerDataSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  email: z.string().optional(),
  alias: z.string().optional(),
  deleted: z.boolean().optional(),
});

const customerResponse = ZodApiResponse(ZodCustomerDataSchema);
export type ZodCustomerResponse = z.infer<typeof customerResponse>;

export class ZCustomerRequest extends BaseControlValueAccessor<
  z.infer<typeof ZodCustomerDataSchema>,
  any
> {
  valueSchema: z.Schema<z.infer<typeof ZodCustomerDataSchema>> =
    ZodCustomerDataSchema;
  formSchema(): z.Schema<z.infer<typeof ZodCustomerDataSchema>> {
    return ZodCustomerDataSchema;
  }
  createFormControls(): z.infer<typeof ZodCustomerDataSchema> {
    return {
      id: '',
      name: '',
      description: '',
      alias: '',
    };
  }
  handleFormChanges(value: any): void {
    console.log(this.form);
  }
}
