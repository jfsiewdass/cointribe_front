export interface Transaction {
    id: string,
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