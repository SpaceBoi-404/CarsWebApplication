import { Link } from "react-router";

export default function NotFoundPage() {
    const url = window.location.href;
    return (
        <section>
            <h1>404 Not Found</h1>
            <p>Nieznany adres strony: {url}</p>
            <Link to='/' className='btn'>Powrót do strony głównej</Link>
        </section>
    )
}