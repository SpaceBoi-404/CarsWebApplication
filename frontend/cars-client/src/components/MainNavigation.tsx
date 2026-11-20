import { NavLink, useLocation, useNavigate } from "react-router";
import { useCarUiStore } from "../store/useCarUiStore";
import { useAuthStore } from "../store/useAuthStore";

export function MainNavigation() {
    const { pathname } = useLocation()
    const isCarsActive = pathname.startsWith('/cars') && pathname !== '/cars/new'

    const user = useAuthStore((state) => state.user);
    const favoriteCount = useCarUiStore((state) => user ? (state.favoriteCarIdsByUser[user.id] ?? []).length : 0)
    const logout = useAuthStore((state) => state.logout);
    const navigate = useNavigate();

    function handleLogout() {
        logout();
        navigate('/login');
    }

    return (
        <nav className="navigation">
            <div className="nav-section">
                {user && (
                    <>
                        <NavLink to='/' end className={({ isActive }) => (isActive ? "active" : undefined)}>
                            Strona główna
                        </NavLink>

                        <NavLink to="/cars" className={() => (isCarsActive ? "active" : undefined)} end>
                            Samochody
                        </NavLink>

                        <NavLink to="/cars/new" className={({ isActive }) => (isActive ? "active" : undefined)}>
                            Dodaj samochód
                        </NavLink>
                    </>
                )}
                <NavLink to="/about">O aplikacji</NavLink>
            </div>
            <div className="auth-section">
                {user ? (
                <>
                    <span>Ulubione: {favoriteCount}</span>
                    <span>
                        {user.userName} ({user.roles.join(', ')})
                    </span>
                    <button onClick={handleLogout}>Wyloguj</button>
                </>
                ) : (
                <>
                    <NavLink to="/login" className={({ isActive }) => (isActive ? "active" : undefined)}>Logowanie</NavLink>
                    <NavLink to="/register" className={({ isActive }) => (isActive ? "active" : undefined)}>Rejestracja</NavLink>
                </>
                )}
            </div>
            {/* <span className="favorite-counter">Ulubione: {favoriteCount}</span> */}
        </nav>
    );
}