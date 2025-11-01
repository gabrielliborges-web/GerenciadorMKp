import { useState, useEffect, useRef } from "react";
import Input from "../common/Input";
import Button from "../common/Button";
import { Search } from "lucide-react";
import Modal from "../common/Modal";
import FormsFields from "../common/FormsFields";
import { fieldsSearch } from "../../utils/fields";
import { useMoviesContext } from "../../context/MoviesContext";
import MovieDrawer from "./MovieDrawer";
import { validateRequiredFields } from "../../utils/validateRequiredFields";
import toast from "react-hot-toast";

export default function MovieActions() {
    const { refreshMovies } = useMoviesContext();
    const { setFilters, filters } = useMoviesContext();

    const [localFilters, setLocalFilters] = useState(filters);
    const [openModal, setOpenModal] = useState(false);
    const [openDrawer, setOpenDrawer] = useState(false);
    const [searchTerm, setSearchTerm] = useState(filters.search ?? "");
    const lastSearch = useRef("");

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (
                (searchTerm.length >= 3 || searchTerm.length === 0) &&
                searchTerm !== lastSearch.current
            ) {
                setFilters({ ...filters, search: searchTerm });
                lastSearch.current = searchTerm;
            }
        }, 700);

        return () => clearTimeout(timeout);
    }, [searchTerm]);

    const handleApplyFilters = () => {
        const { isValid, missingFields } = validateRequiredFields(fieldsSearch, localFilters);
        if (!isValid) {
            toast.error(`Preencha os campos obrigatórios: ${missingFields.join(", ")}`);
            return;
        }
        setFilters(localFilters);
        setOpenModal(false);
    };

    const handleClearFilters = () => {
        const emptyFilters = Object.keys(localFilters).reduce((acc, key) => {
            acc[key as keyof typeof localFilters] = undefined;
            return acc;
        }, {} as typeof localFilters);

        setLocalFilters(emptyFilters);
        setFilters({});
    };

    const activeFilters = Object.values(localFilters).some(
        (v) => v !== "" && v !== null && v !== undefined)


    return (
        <section className="w-full flex flex-col gap-3 md:flex-row md:items-center md:justify-end md:gap-3">
            <div className="w-full md:w-[520px] md:flex-shrink-0">
                <Input
                    name="search"
                    placeholder="Pesquise por filmes"
                    label=""
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onClear={() => setSearchTerm("")}
                    icon={<Search className="w-5 h-5" />}
                    type="text"
                />
            </div>

            <div className="flex w-full md:w-auto gap-2 md:gap-3 md:items-center">
                <Button
                    variant="secondary"
                    className="w-[40%] md:w-auto h-[48px]"
                    onClick={() => setOpenModal(true)}
                >
                    Filtros
                </Button>
                <Button
                    variant="primary"
                    className="w-[60%] md:w-auto h-[48px]"
                    onClick={() => setOpenDrawer(true)}
                >
                    Adicionar Filme
                </Button>
            </div>


            <Modal
                title="Filtros Avançados"
                open={openModal}
                onClose={() => setOpenModal(false)}
                footer={
                    <>
                        <Button variant="secondary" onClick={() => setOpenModal(false)}>
                            Cancelar
                        </Button>
                        <Button variant="primary" onClick={handleApplyFilters} disabled={!activeFilters}>
                            Aplicar Filtros
                        </Button>
                        {activeFilters && (
                            <Button
                                variant="primary"
                                className="text-sm text-red-400 hover:text-red-300"
                                onClick={handleClearFilters}
                            >
                                Limpar
                            </Button>
                        )}
                    </>
                }
            >
                <FormsFields
                    fields={fieldsSearch}
                    values={localFilters}
                    setValues={setLocalFilters}
                />
            </Modal>

            <MovieDrawer open={openDrawer} onClose={() => setOpenDrawer(false)} mode="create" onSaved={() => {
                refreshMovies();
                setOpenDrawer(false);
            }} />
        </section>
    );
}
