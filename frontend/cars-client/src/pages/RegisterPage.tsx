import { useState, type ChangeEvent, type SyntheticEvent } from 'react';
import { Link } from 'react-router';
import { register } from '../services/authService';

export default function RegisterPage() {
    // const navigate = useNavigate();
    const [userName, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    function handleUserNameChange(event: ChangeEvent<HTMLInputElement>) {
        setUserName(event.target.value);
    }
    function handleEmailChange(event: ChangeEvent<HTMLInputElement>) {
        setEmail(event.target.value);
    }
    function handlePasswordChange(event: ChangeEvent<HTMLInputElement>) {
        setPassword(event.target.value);
    }

    async function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
        event.preventDefault();
        try {
            setIsSubmitting(true);
            setError(null);
            const msg = await register({ userName, email, password });
            setUserName(''); setEmail(''); setPassword('');
            setMessage(msg);
        } catch (caughtError) {
            if (caughtError instanceof Error) {
                setError(caughtError.message);
            } else {
                setError('Wystąpił nieoczekiwany błąd podczas rejestracji.');
            }
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <section className="auth-page">
            <div className="auth-card">
                <h1>Rejestracja</h1>

                {message && <div className="form-message">{message}</div>}
                {error && <div className="form-error">{error}</div>}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div>
                        <label htmlFor="userName">Nazwa użytkownika</label>
                        <input id="userName" type="text" value={userName}
                            onChange={handleUserNameChange} />
                    </div>
                    <div>
                        <label htmlFor="email">E-mail</label>
                        <input id="email" type="email" value={email}
                            onChange={handleEmailChange} />
                    </div>
                    <div>
                        <label htmlFor="password">Hasło</label>
                        <input id="password" type="password" value={password}
                            onChange={handlePasswordChange} />
                    </div>

                    <button type="submit" className="btn btn-gold auth-submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Rejestrowanie...' : 'Zarejestruj'}
                    </button>
                </form>

                <div className="auth-links">
                    <span>
                        Masz już konto?{' '}
                        <Link to="/login">Zaloguj się</Link>
                    </span>
                </div>
            </div>
        </section>
    );
}   