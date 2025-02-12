import { TransactionService } from "./TransactionService";

export const TransactionController = {
  async handleMovimiento(req, res) {
    try {
      const { accountId, amount, transactionType } = req.body;
      const result = await TransactionService.realizarMovimiento(accountId, amount, transactionType);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: "Error procesando el movimiento", error: error.message });
    }
  },

  async handleTransferencia(req, res) {
    try {
      const { sourceAccountId, destinationAccountId, amount } = req.body;
      const result = await TransactionService.realizarTransferencia(sourceAccountId, destinationAccountId, amount);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: "Error procesando la transferencia", error: error.message });
    }
  },

  async handleObtenerTransacciones(req, res) {
    try {
      const result = await TransactionService.obtenerTransacciones();
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: "Error obteniendo transacciones", error: error.message });
    }
  }
};
