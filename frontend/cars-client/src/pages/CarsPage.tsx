import CarCard  from '../components/CarCard'
import { useEffect, useState } from 'react'
import type { Car } from '../models/Car'
import { getCars, deleteCar } from '../services/carService'

export default function CarsPage() {
    const [cars, setCars] = useState<Car[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const controller = new AbortController();

        async function loadCars() {
            try {
                setIsLoading(true)
                setError(null)
                setCars(await getCars(controller.signal))
            } catch (e) {
                if (e instanceof DOMException && e.name === 'AbortError') return

                if (e instanceof Error) {
                    setError(e.message)
                } else {
                    setError('Wystąpił nieznany błąd.')
                }

            } finally {
                if (!controller.signal.aborted) {
                    setIsLoading(false)
                }
            }
        }

        loadCars()

        return () => {
            controller.abort();
        }
    }, [])
    
    async function handleDelete(id: string) {
        const confirmed = window.confirm(`Czy napewno chcesz usunąć wybrany samochód?`)
        if (!confirmed) return

        try {
            await deleteCar(id)
            setCars(prevCars => prevCars.filter(car => car.id !== id))
        } catch (e) {
            if (e instanceof Error) alert(e.message)
            else alert('Wystąpił nieznany błąd')
        }
    }

    if (isLoading) {
        return <p>Ładowanie danych...</p>
    }

    if (error) {
        return <p className='error'>{error}</p>
    }

    if (cars.length === 0) {
        return <p>Nie znaleziono samochodów.</p>
    }

    return (
        <section className='cars-page'>
            <h1>Lista samochodów</h1>
            <div className='cars-list'>
                {cars.map((car) => (
                    <CarCard key={car.id} car={car} onDelete={handleDelete} />
                ))}
            </div>
        </section>
    )
}