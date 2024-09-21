export interface Product {
  id: string | null;
  tituloProducto: string;
}

export interface Proyectos {
  codigo: string;
  titulo: string;
  productos: Product[];
}

export interface Person {
  nombre: string;
  correo: string;
  numerodocumento: string;
  proyectos: Proyectos[];
}

interface DataRow {
  isSelected: boolean;
  rol: string;
  horasestricto: number; // Asegúrate de que sea un número
  investigadorId: string;
  productoId: string | null;
  proyectoId: string;
}
