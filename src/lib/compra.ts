import { api } from "./api";

// Types
export interface CompraItem {
  id: number;
  produtoId: number;
  quantidade: number;
  preco: number;
}

export interface Compra {
  id: number;
  fornecedor: string;
  dataCompra: string;
  total: number;
  itens: CompraItem[];
  usuarioId: number;
  criadoEm: string;
  atualizadoEm: string;
}

export interface CreateCompraRequest {
  fornecedor: string;
  dataCompra: string;
  itens: {
    produtoId: number;
    quantidade: number;
    preco: number;
  }[];
}

export interface FiltroListagemCompra {
  dataInicio?: string;
  dataFim?: string;
  fornecedor?: string;
}

// API Calls
export const listCompras = async (
  filtros?: FiltroListagemCompra
): Promise<Compra[]> => {
  try {
    const params = new URLSearchParams();
    if (filtros?.dataInicio) params.append("dataInicio", filtros.dataInicio);
    if (filtros?.dataFim) params.append("dataFim", filtros.dataFim);
    if (filtros?.fornecedor) params.append("fornecedor", filtros.fornecedor);

    const response = await api.get(`/compras?${params.toString()}`);
    return response.data;
  } catch (error: any) {
    const apiError = error.response?.data;
    const message = apiError?.message || "Erro ao listar compras.";
    throw new Error(message);
  }
};

export const getCompraById = async (id: number): Promise<Compra> => {
  try {
    const response = await api.get(`/compras/${id}`);
    return response.data;
  } catch (error: any) {
    const apiError = error.response?.data;
    if (apiError?.errors) {
      throw new Error(apiError.errors.join(", "));
    }
    const message = apiError?.message || "Erro ao obter compra.";
    throw new Error(message);
  }
};

export const createCompra = async (
  data: CreateCompraRequest
): Promise<Compra> => {
  try {
    const response = await api.post("/compras", data);
    return response.data;
  } catch (error: any) {
    const apiError = error.response?.data;
    if (apiError?.errors) {
      throw new Error(apiError.errors.join(", "));
    }
    const message = apiError?.message || "Erro ao criar compra.";
    throw new Error(message);
  }
};

export const deleteCompra = async (id: number): Promise<any> => {
  try {
    const response = await api.delete(`/compras/${id}`);
    return response.data;
  } catch (error: any) {
    const apiError = error.response?.data;
    if (apiError?.errors) {
      throw new Error(apiError.errors.join(", "));
    }
    const message = apiError?.message || "Erro ao deletar compra.";
    throw new Error(message);
  }
};
