import { useState, type ChangeEvent, type SyntheticEvent } from 'react';
import { Link, useSearchParams } from 'react-router';
import { resetPassword } from '../services/authService';

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email');
  const token = searchParams.get('token');

  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handlePasswordChange(event: ChangeEvent<HTMLInputElement>) {
    setNewPassword(event.target.value);
  }

  async function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email || !token) {
      return;
    }
    
    try {
      setIsSubmitting(true);
      setError(null);
      const result = await resetPassword(email, token, newPassword);
      setMessage(result);
    } catch (caughtError) {
      if (caughtError instanceof Error) {
        setError(caughtError.message);
      } else {
        setError('Nie udało się zmienić hasła.');
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!email || !token) {
    return (
      <div>
        <h1>Nieprawidłowy link</h1>
        <Link to="/login">Wróć do logowania</Link>
      </div>
    );
  }

  return (
    <section className="auth-page">
      <div className="auth-card">
        <h1>Ustaw nowe hasło</h1>
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
                        <label htmlFor="password">Nowe hasło</label>
                        <input id="password" type="password" value={newPassword}
                            onChange={handlePasswordChange} />
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