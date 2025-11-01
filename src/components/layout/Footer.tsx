export default function Footer() {
    return (
        <footer className="
      w-full h-[80px] 
      bg-background-light dark:bg-background-dark
      border-t border-border-subtle/20 
      flex items-center justify-center 
      font-montserrat
      transition-colors duration-300
    ">
            <p className="
        text-[16px] font-normal 
        text-text-secondary-light dark:text-text-secondary-dark 
        leading-none text-center
      ">
                2025 © Todos os direitos reservados a{" "}
                <span className="font-semibold text-text-primary-light dark:text-text-primary-dark">
                    Cubos Movies
                </span>
            </p>
        </footer>
    );
}
