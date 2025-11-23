import { api } from "./api";

// Types
export interface VendaItem {
  id: number;
  produtoId: number;
  quantidade: number;
  preco: number;
}

export interface Venda {
  id: number;
  cliente?: string;
  dataVenda: string;
  formaPagamento: string;
  total: number;
  itens: VendaItem[];
  usuarioId: number;
  status: string;
  criadoEm: string;
  atualizadoEm: string;
}

export interface CreateVendaRequest {
  cliente?: string;
  dataVenda: string;
  formaPagamento: string;
  itens: {
    produtoId: number;
    quantidade: number;
    preco: number;
  }[];
}

export interface FiltroListagemVenda {
  dataInicio?: string;
  dataFim?: string;
  formaPagamento?: string;
}

// API Calls
export const listVendas = async (
  filtros?: FiltroListagemVenda
): Promise<Venda[]> => {
  try {
    const params = new URLSearchParams();
    if (filtros?.dataInicio) params.append("dataInicio", filtros.dataInicio);
    if (filtros?.dataFim) params.append("dataFim", filtros.dataFim);
    if (filtros?.formaPagamento)
      params.append("formaPagamento", filtros.formaPagamento);

    const response = await api.get(`/vendas?${params.toString()}`);
    return response.data;
  } catch (error: any) {
    const apiError = error.response?.data;
    const message = apiError?.message || "Erro ao listar vendas.";
    throw new Error(message);
  }
};

export const getVendaById = async (id: number): Promise<Venda> => {
  try {
    const response = await api.get(`/vendas/${id}`);
    return response.data;
  } catch (error: any) {
    const apiError = error.response?.data;
    if (apiError?.errors) {
      throw new Error(apiError.errors.join(", "));
    }
    const message = apiError?.message || "Erro ao obter venda.";
    throw new Error(message);
  }
};

export const createVenda = async (data: CreateVendaRequest): Promise<Venda> => {
  try {
    const response = await api.post("/vendas", data);
    return response.data;
  } catch (error: any) {
    const apiError = error.response?.data;
    if (apiError?.errors) {
      throw new Error(apiError.errors.join(", "));
    }
    const message = apiError?.message || "Erro ao criar venda.";
    throw new Error(message);
  }
};

export const cancelVenda = async (id: number): Promise<any> => {
  try {
    const response = await api.delete(`/vendas/${id}`);
    return response.data;
  } catch (error: any) {
    const apiError = error.response?.data;
    if (apiError?.errors) {
      throw new Error(apiError.errors.join(", "));
    }
    const message = apiError?.message || "Erro ao cancelar venda.";
    throw new Error(message);
  }
};
