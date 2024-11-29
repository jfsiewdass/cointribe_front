import { FormControl } from "@angular/forms";

export interface User {
    _id: string,
    currency: string;
    amount: number;
    confirmations: number;
    statusId: number;
    transactionId: string;
    status: string;
    created_at: string;
    type: string,
    typeId: number
  }

  export interface UserFilterQuery {
    page: number;
    limit: number;
    firstName?: string;
    lastName?: string;
    email?: string;
    status?: number;
    wallet?: string;
  }

  export interface UserFilterForm {
    firstName?: FormControl<string>;
    lastName?: FormControl<string>;
    email?: FormControl<string>;
    wallet?: FormControl<string>;
    status?: FormControl<string>;
  }