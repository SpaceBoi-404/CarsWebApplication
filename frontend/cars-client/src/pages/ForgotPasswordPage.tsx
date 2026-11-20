import { useState, type ChangeEvent, type SyntheticEvent } from 'react';
import { Link } from 'react-router';
import { forgotPassword } from '../services/authService';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    function handleEmailChange(event: ChangeEvent<HTMLInputElement>) {
        setEmail(event.target.value);
    }

    async function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
        event.preventDefault();
        try {
            setIsSubmitting(true);
            setError(null);
            const msg = await forgotPassword(email);
            setMessage(msg);
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError('Wystąpił nieoczekiwany błąd podczas procesu resetowania hasła.');
            }
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <section className="auth-page">
            <div className="auth-card">
                <h1>Resetowanie hasła</h1>
                {error && <div className="form-error">{error}</div>}
                {message 
                    ? (
                        <>
                            <div className="form-message">{message}</div> 
                            <div className="auth-links">
                                <span>
                                    <Link to="/login">Powrót do logowania</Link>
                                </span>
                            </div>
                        </>
                    ) : (
                        <form onSubmit={handleSubmit} className="auth-form">
                            <div>
                                <label htmlFor="email">E-mail</label>
                                <input id="email" type="email" value={email}
                                    onChange={handleEmailChange} />
                            </div>
                            <button type="submit" className="btn btn-gold auth-submit" disabled={isSubmitting}>
                                {isSubmitting ? 'Resetowanie hasła...' : 'Resetuj hasło'}
                            </button>
                        </form>
                    )
                }
            </div>
        </section>
    );
}