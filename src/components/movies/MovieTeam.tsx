
interface Person {
    name: string;
    image?: string;
    role: string;
}

interface MovieTeamProps {
    actors?: any[];
    producers?: any[];
    director?: any;
}

export default function MovieTeam({ actors = [], producers = [], director }: MovieTeamProps) {
    const parsePerson = (raw: any): { name: string; image?: string } | null => {
        if (!raw) return null;

        let val = raw;

        if (typeof val === "object" && typeof val.name === "string") {
            try {
                val = JSON.parse(val.name);
            } catch {
                val = { name: val.name };
            }
        }

        if (typeof val === "string") {
            try {
                val = JSON.parse(val);
            } catch {
                val = { name: val };
            }
        }

        if (typeof val.name === "string" && val.name.startsWith("{")) {
            try {
                val = JSON.parse(val.name);
            } catch {
            }
        }

        const safeName = typeof val.name === "string" && val.name.trim() !== "" ? val.name : "Desconhecido";

        return {
            name: safeName,
            image: typeof val.image === "string" ? val.image : undefined,
        };
    };

    const parsedActors: Person[] = Array.isArray(actors)
        ? actors
            .map(parsePerson)
            .filter((p): p is Person => !!p && typeof p.name === "string")
            .map((a) => ({ ...a, role: "Ator" }))
        : [];

    const parsedProducers: Person[] = Array.isArray(producers)
        ? producers
            .map(parsePerson)
            .filter((p): p is Person => !!p && typeof p.name === "string")
            .map((p) => ({ ...p, role: "Produtor" }))
        : [];

    const parsedDirector: Person[] = director
        ? (() => {
            const dir = parsePerson(director);
            return dir ? [{ ...dir, role: "Diretor" }] : [];
        })()
        : [];

    const people: Person[] = [...parsedDirector, ...parsedActors, ...parsedProducers];

    if (people.length === 0) return null;

    return (
        <section className="w-full mt-16 mb-10">
            <h2 className="text-2xl font-semibold mb-8 text-white">Elenco e Produção</h2>

            <ul
                role="list"
                className="grid gap-x-8 gap-y-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
            >
                {people.map((person, idx) => (
                    <li
                        key={`${person.name}-${idx}`}
                        className="flex flex-col items-center text-center"
                    >
                        <div className="relative w-24 h-24 rounded-full overflow-hidden border border-border-subtle/30 mb-3 bg-mauve-dark-3">
                            <img
                                alt={person.name}
                                src={
                                    person.image && person.image.startsWith("http")
                                        ? person.image
                                        : "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                                }
                                className="object-cover w-full h-full"
                            />
                        </div>
                        <h3 className="text-base font-medium text-white truncate max-w-[150px]">{person.name}</h3>
                        <p className="text-sm text-gray-400">{person.role}</p>
                    </li>
                ))}
            </ul>
        </section>
    );
}
