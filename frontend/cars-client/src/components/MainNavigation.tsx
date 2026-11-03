import { NavLink, useLocation } from "react-router";

export function MainNavigation() {
    const { pathname } = useLocation()
    const isCarsActive = pathname.startsWith('/cars') && pathname !== '/cars/new'
    return (
        <nav className="navigation">
            <NavLink to='/' end className={({ isActive }) => (isActive ? "active" : undefined)}>
                Strona główna
            </NavLink>

            <NavLink to="/cars" className={() => (isCarsActive ? "active" : undefined)}>
                Samochody
            </NavLink>

            <NavLink to="/cars/new" className={({ isActive }) => (isActive ? "active" : undefined)}>
                Dodaj samochód
            </NavLink>
        </nav>
    );
}