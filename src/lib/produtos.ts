import type { Produto } from "../mocks/produtosMock";

interface CreateProdutoDTO {
  nome: string;
  descricao?: string;
  categoriaId?: number;
  precoVenda: number;
  precoCompra?: number;
  precoPromocional?: number;
  imagem?: string;
  ativo?: boolean;
}

interface UpdateProdutoDTO extends CreateProdutoDTO {
  id: number;
}

class ProdutoService {
  private baseUrl = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

  // Listar todos os produtos com filtros
  async listProdutos(filtros?: {
    nome?: string;
    ativo?: boolean;
    categoriaId?: number;
    ordenar?: "nome" | "preco" | "estoque";
  }): Promise<Produto[]> {
    try {
      const params = new URLSearchParams();
      if (filtros?.nome) params.append("nome", filtros.nome);
      if (filtros?.ativo !== undefined)
        params.append("ativo", String(filtros.ativo));
      if (filtros?.categoriaId)
        params.append("categoriaId", String(filtros.categoriaId));
      if (filtros?.ordenar) params.append("ordenar", filtros.ordenar);

      const response = await fetch(`${this.baseUrl}/produtos?${params}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) throw new Error("Erro ao buscar produtos");
      return await response.json();
    } catch (error) {
      console.error("Erro no service ProdutoService.listProdutos:", error);
      throw error;
    }
  }

  // Obter um produto pelo ID
  async getProduto(id: number): Promise<Produto> {
    try {
      const response = await fetch(`${this.baseUrl}/produtos/${id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) throw new Error("Erro ao buscar produto");
      return await response.json();
    } catch (error) {
      console.error("Erro no service ProdutoService.getProduto:", error);
      throw error;
    }
  }

  // Criar novo produto
  async createProduto(data: CreateProdutoDTO): Promise<Produto> {
    try {
      const response = await fetch(`${this.baseUrl}/produtos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Erro ao criar produto");
      return await response.json();
    } catch (error) {
      console.error("Erro no service ProdutoService.createProduto:", error);
      throw error;
    }
  }

  // Atualizar produto
  async updateProduto(data: UpdateProdutoDTO): Promise<Produto> {
    try {
      const { id, ...updateData } = data;
      const response = await fetch(`${this.baseUrl}/produtos/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) throw new Error("Erro ao atualizar produto");
      return await response.json();
    } catch (error) {
      console.error("Erro no service ProdutoService.updateProduto:", error);
      throw error;
    }
  }

  // Desativar produto (soft delete)
  async desativarProduto(id: number): Promise<Produto> {
    try {
      const response = await fetch(`${this.baseUrl}/produtos/${id}/desativar`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) throw new Error("Erro ao desativar produto");
      return await response.json();
    } catch (error) {
      console.error("Erro no service ProdutoService.desativarProduto:", error);
      throw error;
    }
  }

  // Excluir produto (hard delete)
  async deleteProduto(id: number): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/produtos/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) throw new Error("Erro ao deletar produto");
    } catch (error) {
      console.error("Erro no service ProdutoService.deleteProduto:", error);
      throw error;
    }
  }

  // Upload de imagem para AWS S3
  async uploadImagem(file: File): Promise<string> {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`${this.baseUrl}/upload`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Erro ao fazer upload da imagem");
      const data = await response.json();
      return data.url; // URL da imagem no S3
    } catch (error) {
      console.error("Erro no service ProdutoService.uploadImagem:", error);
      throw error;
    }
  }

  // Excluir imagem do S3
  async deleteImagem(imageUrl: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/upload`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: imageUrl }),
      });

      if (!response.ok) throw new Error("Erro ao deletar imagem");
    } catch (error) {
      console.error("Erro no service ProdutoService.deleteImagem:", error);
      throw error;
    }
  }
}

export const produtoService = new ProdutoService();
