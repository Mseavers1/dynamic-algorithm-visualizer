import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

function Header() {
    const location = useLocation();

    const isHome = location.pathname === "/";

    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 400);
        };

        handleScroll();

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    const visible = !isHome || scrolled;

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    return (
        <header
            className={`
                fixed
                top-0
                left-0
                w-full
                z-50

                bg-[#0D1424]
                text-[#F1F5F9]

                border-b
                border-[#1E293B]

                px-8
                py-4

                select-none

                transition-all
                duration-300

                ${
                visible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 -translate-y-full pointer-events-none"
            }
            `}
        >
            <div className="flex items-center justify-between">

                {isHome ? (
                    <button
                        onClick={scrollToTop}
                        className="
                            font-bold
                            text-2xl
                            tracking-wide
                            cursor-pointer
                            hover:scale-105
                            active:scale-95
                            transition-transform
                        "
                    >
                        D<span className="text-blue-500">.</span>
                        A<span className="text-blue-500">.</span>
                        V<span className="text-blue-500">.</span>
                        E
                    </button>
                ) : (
                    <Link
                        to="/"
                        className="
                            font-bold
                            text-2xl
                            tracking-wide
                            hover:scale-105
                            active:scale-95
                            transition-transform
                        "
                    >
                        D<span className="text-blue-500">.</span>
                        A<span className="text-blue-500">.</span>
                        V<span className="text-blue-500">.</span>
                        E
                    </Link>
                )}

                <nav className="flex items-center gap-7 text-[#94A3B8]">

                    {location.pathname === "/algorithms" ? (
                        <span className="text-blue-400 cursor-default">
                            Algorithms
                        </span>
                    ) : (
                        <Link
                            to="/algorithms"
                            className="
                                text-[#94A3B8]
                                hover:text-white
                                transition-colors
                                cursor-pointer
                            "
                        >
                            Algorithms
                        </Link>
                    )}

                    <a
                        href="/#about"
                        className="hover:text-[#F1F5F9] transition-colors"
                    >
                        About
                    </a>

                    <a
                        href="/#credits"
                        className="hover:text-[#F1F5F9] transition-colors"
                    >
                        Credits
                    </a>

                </nav>

            </div>
        </header>
    );
}

export default Header;