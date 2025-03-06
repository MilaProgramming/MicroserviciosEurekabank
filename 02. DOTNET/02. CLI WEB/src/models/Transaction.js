// src/models/Transaction.js
export default class Transaction {
    constructor(id, transactionType, amount, sourceAccountId, destinationAccountId, userId, transactionDate, status) {
      this.id = id;
      this.transactionType = transactionType;
      this.amount = amount;
      this.sourceAccountId = sourceAccountId;
      this.destinationAccountId = destinationAccountId;
      this.userId = userId;
      this.transactionDate = transactionDate;
      this.status = status;
    }
  
    static fromApiResponse(response) {
      return response.map(item => new Transaction(
        item.id,
        item.transactionType,
        item.amount,
        item.sourceAccountId,
        item.destinationAccountId,
        item.userId,
        item.transactionDate,
        item.status
      ));
    }
  }
  