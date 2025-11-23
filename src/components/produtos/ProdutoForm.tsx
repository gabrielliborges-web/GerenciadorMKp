import { ArrowLeft, Upload, Image as ImageIcon } from "lucide-react";
import { useState, useRef } from "react";
import Input from "../common/Input";
import Textarea from "../common/Textarea";
import type { Produto } from "../../lib/produto";

interface ProdutoFormProps {
    onClose: () => void;
    onSave: (data: Omit<Produto, "id" | "criadoEm" | "atualizadoEm">) => void;
    initialData?: Produto;
    isLoading?: boolean;
    categorias: Array<{ id: number; nome: string }>;
}

interface FormData {
    nome: string;
    descricao: string;
    categoriaId: number | null;
    preco: string;
    estoque: string;
    imagem: string;
    ativo: boolean;
}

interface FormErrors {
    [key: string]: string;
}

export default function ProdutoForm({
    onClose,
    onSave,
    initialData,
    isLoading = false,
    categorias,
}: ProdutoFormProps) {
    const [formData, setFormData] = useState<FormData>({
        nome: initialData?.nome || "",
        descricao: initialData?.descricao || "",
        categoriaId: initialData?.categoriaId || null,
        preco: initialData?.preco?.toString() || "",
        estoque: initialData?.estoque?.toString() || "",
        imagem: initialData?.imagem || "",
        ativo: initialData?.ativo ?? true,
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [imagePreview, setImagePreview] = useState<string>(initialData?.imagem || "");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (!formData.nome.trim()) {
            newErrors.nome = "Nome é obrigatório";
        }

        const preco = parseFloat(formData.preco);
        if (!formData.preco || isNaN(preco) || preco <= 0) {
            newErrors.preco = "Preço é obrigatório e deve ser maior que 0";
        }

        const estoque = parseFloat(formData.estoque);
        if (!formData.estoque || isNaN(estoque) || estoque < 0) {
            newErrors.estoque = "Estoque é obrigatório e deve ser maior ou igual a 0";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
                setFormData({ ...formData, imagem: reader.result as string });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleImageUpload = () => {
        fileInputRef.current?.click();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        onSave({
            nome: formData.nome,
            descricao: formData.descricao || undefined,
            categoriaId: formData.categoriaId ?? undefined,
            preco: parseFloat(formData.preco),
            estoque: parseFloat(formData.estoque),
            imagem: formData.imagem || undefined,
            ativo: formData.ativo,
        } as any);

        setFormData({
            nome: "",
            descricao: "",
            categoriaId: null,
            preco: "",
            estoque: "",
            imagem: "",
            ativo: true,
        });
        setImagePreview("");
        setErrors({});
    };

    const handleClose = () => {
        setFormData({
            nome: "",
            descricao: "",
            categoriaId: null,
            preco: "",
            estoque: "",
            imagem: "",
            ativo: true,
        });
        setImagePreview("");
        setErrors({});
        onClose();
    };

    return (
        <div className="w-full max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8 flex items-center gap-4">
                <button
                    onClick={handleClose}
                    disabled={isLoading}
                    className="p-2 rounded-lg transition-all duration-300 hover:bg-white/10 disabled:opacity-50"
                >
                    <ArrowLeft className="h-5 w-5 text-white/60 hover:text-white" />
                </button>
                <div>
                    <h1 className="text-3xl font-bold text-white">
                        {initialData ? "Editar Produto" : "Novo Produto"}
                    </h1>
                    <p className="mt-1 text-sm text-white/50">
                        {initialData ? "Atualize os detalhes do produto" : "Crie um novo produto no seu catálogo"}
                    </p>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Image Upload */}
                <div>
                    <label className="mb-2 block text-sm font-semibold text-white">
                        Imagem do Produto
                    </label>
                    <div className="flex gap-4 flex-col sm:flex-row">
                        {/* Preview */}
                        <div className="relative w-full sm:w-32 h-32 rounded-lg overflow-hidden bg-gradient-to-br from-blue-500/10 to-blue-600/5 flex items-center justify-center flex-shrink-0">
                            {imagePreview ? (
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <ImageIcon className="h-8 w-8 text-white/30" />
                            )}
                        </div>

                        {/* Upload Button */}
                        <div className="flex-1 flex flex-col justify-between">
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                                disabled={isLoading}
                            />
                            <button
                                type="button"
                                onClick={handleImageUpload}
                                disabled={isLoading}
                                className="flex items-center justify-center gap-2 rounded-lg py-3 px-4 font-semibold transition-all duration-300 bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 disabled:opacity-50"
                            >
                                <Upload className="h-4 w-4" />
                                Fazer Upload
                            </button>
                            <p className="text-xs text-white/50 mt-2">
                                PNG, JPG até 5MB
                            </p>
                        </div>
                    </div>
                </div>

                {/* Nome */}
                <div>
                    <label className="mb-2 block text-sm font-semibold text-white">
                        Nome <span className="text-blue-400">*</span>
                    </label>
                    <Input
                        name="nome"
                        value={formData.nome}
                        onChange={(e) => {
                            setFormData({ ...formData, nome: e.target.value });
                            if (errors.nome) setErrors({ ...errors, nome: "" });
                        }}
                        placeholder="Ex: Gin Tanqueray"
                        disabled={isLoading}
                        className={errors.nome ? "border-red-500" : ""}
                    />
                    {errors.nome && (
                        <p className="mt-1 text-xs text-red-400">{errors.nome}</p>
                    )}
                </div>

                {/* Descrição */}
                <div>
                    <label className="mb-2 block text-sm font-semibold text-white">
                        Descrição
                    </label>
                    <Textarea
                        name="descricao"
                        value={formData.descricao}
                        onChange={(e) =>
                            setFormData({ ...formData, descricao: e.target.value })
                        }
                        placeholder="Descreva o produto..."
                        disabled={isLoading}
                        rows={4}
                    />
                </div>

                {/* Categoria */}
                <div>
                    <label className="mb-2 block text-sm font-semibold text-white">
                        Categoria
                    </label>
                    <select
                        value={formData.categoriaId || ""}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                categoriaId: e.target.value ? Number(e.target.value) : null,
                            })
                        }
                        disabled={isLoading}
                        className="w-full rounded-lg border border-blue-500/20 bg-blue-500/10 text-white py-2 px-3 text-sm transition-all duration-300 focus:border-blue-500/40 focus:outline-none"
                    >
                        <option value="">Selecione uma categoria</option>
                        {categorias.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.nome}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Preço e Estoque */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                        <label className="mb-2 block text-sm font-semibold text-white">
                            Preço <span className="text-blue-400">*</span>
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={formData.preco}
                            onChange={(e) => {
                                setFormData({ ...formData, preco: e.target.value });
                                if (errors.preco) setErrors({ ...errors, preco: "" });
                            }}
                            placeholder="0.00"
                            disabled={isLoading}
                            className={`w-full rounded-lg border py-2 px-3 text-sm transition-all duration-300 border-blue-500/20 bg-blue-500/10 text-white focus:border-blue-500/40 focus:outline-none ${errors.preco ? "border-red-500" : ""}`}
                        />
                        {errors.preco && (
                            <p className="mt-1 text-xs text-red-400">{errors.preco}</p>
                        )}
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-semibold text-white">
                            Estoque <span className="text-blue-400">*</span>
                        </label>
                        <input
                            type="number"
                            step="1"
                            min="0"
                            value={formData.estoque}
                            onChange={(e) => {
                                setFormData({ ...formData, estoque: e.target.value });
                                if (errors.estoque) setErrors({ ...errors, estoque: "" });
                            }}
                            placeholder="0"
                            disabled={isLoading}
                            className={`w-full rounded-lg border py-2 px-3 text-sm transition-all duration-300 border-blue-500/20 bg-blue-500/10 text-white focus:border-blue-500/40 focus:outline-none ${errors.estoque ? "border-red-500" : ""}`}
                        />
                        {errors.estoque && (
                            <p className="mt-1 text-xs text-red-400">{errors.estoque}</p>
                        )}
                    </div>
                </div>

                {/* Status */}
                <div className="flex items-center gap-3 rounded-lg p-4 bg-white/5 border border-white/10">
                    <input
                        type="checkbox"
                        id="ativo"
                        checked={formData.ativo}
                        onChange={(e) =>
                            setFormData({ ...formData, ativo: e.target.checked })
                        }
                        disabled={isLoading}
                        className="h-4 w-4 cursor-pointer rounded border-blue-500/30 bg-blue-500/10 text-blue-500 transition-colors"
                    />
                    <label
                        htmlFor="ativo"
                        className="cursor-pointer text-sm font-medium text-white"
                    >
                        Produto Ativo
                    </label>
                </div>

                {/* Buttons */}
                <div className="flex gap-3 pt-8">
                    <button
                        type="button"
                        onClick={handleClose}
                        disabled={isLoading}
                        className="flex-1 rounded-lg py-3 font-semibold text-white hover:bg-white/10 transition-all duration-300 disabled:opacity-50"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="flex-1 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 py-3 font-semibold text-white transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/40 hover:scale-105 active:scale-95 disabled:opacity-50"
                    >
                        {isLoading ? "Salvando..." : initialData ? "Atualizar" : "Criar"}
                    </button>
                </div>
            </form>
        </div>
    );
}
