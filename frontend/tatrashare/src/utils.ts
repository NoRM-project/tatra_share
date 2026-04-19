import type { TransactionDto } from "./axios/api";

export function groupTransactionsByDate(transactions: TransactionDto[]) {
  const groups: Record<string, TransactionDto[]> = {};

  transactions.forEach((t) => {
    const date = new Date(t.created_at);
    const key = date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    if (!groups[key]) {
      groups[key] = [];
    }

    groups[key].push(t);
  });

  return groups;
}