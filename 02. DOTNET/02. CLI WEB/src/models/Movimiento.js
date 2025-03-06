// src/models/Movimiento.js
export class Movimiento {
    constructor(fecha, tipo, monto) {
      this.fecha = fecha;
      this.tipo = tipo;
      this.monto = monto;
    }
  
    toString() {
      return `Fecha: ${this.fecha}, Tipo: ${this.tipo}, Monto: ${this.monto}`;
    }
  }
  