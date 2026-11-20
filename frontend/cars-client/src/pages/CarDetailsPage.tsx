import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'
import { getCarById } from '../services/carService';
import { formatDateForDisplay, getBodyTypeLabel, getFuelTypeLabel, type Car } from '../models/Car'
import axios from 'axios'
import { useCarUiStore } from '../store/useCarUiStore'
import { useAuthStore } from '../store/useAuthStore'

export default function CarDetailsPage() {
    const { id } = useParams()
    const [car, setCar] = useState<Car | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const user = useAuthStore((state) => state.user)
    const favoriteCarIdsByUser = useCarUiStore((state) => state.favoriteCarIdsByUser)
    const toggleFavorite = useCarUiStore((state) => state.toggleFavorite)

    useEffect(() => {
        const controller = new AbortController();

        async function loadCarDetails() {
            if (!id) return
            try {
                setIsLoading(true)
                setError(null)
                setCar(await getCarById(id, controller.signal))
            } catch (e) {
                if (axios.isCancel(e)) return
                if (e instanceof Error)
                    setError(e.message)
                else
                    setError('Wystąpił nieznany błąd')

            } finally {
                if (!controller.signal.aborted)
                    setIsLoading(false)
            }
        }

        loadCarDetails()

        return () => {
            controller.abort();
        }
    }, [id])
    
    if (isLoading) {
        return <p>Ładowanie danych...</p>
    }

    if (error) {
        return <p className='error'>{error}</p>
    }

    if (!car) return

    const favoriteCarIds = user ? favoriteCarIdsByUser[user.id] ?? [] : []
    const isFavorite = favoriteCarIds.includes(car.id)

    return (
        <section className='car-details'>
            <h1>Szczegóły</h1>
            <dl className="car-details-list">
                <div className="detail-row">
                    <dt>Id</dt>
                    <dd>{car.id}</dd>
                </div>
                <div className="detail-row">
                    <dt>Marka</dt>
                    <dd>{car.brand}</dd>
                </div>
                <div className="detail-row">
                    <dt>Model</dt>
                    <dd>{car.model}</dd>
                </div>
                <div className="detail-row">
                    <dt>Liczba drzwi</dt>
                    <dd>{car.doorsNumber}</dd>
                </div>
                <div className="detail-row">
                    <dt>Pojemność bagażnika</dt>
                    <dd>{car.luggageCapacity}</dd>
                </div>
                <div className="detail-row">
                    <dt>Pojemność silnika</dt>
                    <dd>{car.engineCapacity}</dd>
                </div>
                <div className="detail-row">
                    <dt>Rodzaj paliwa</dt>
                    <dd>{getFuelTypeLabel(car.fuelType)}</dd>
                </div>
                <div className="detail-row">
                    <dt>Data produkcji</dt>
                    <dd>{formatDateForDisplay(car.productionDate)}</dd>
                </div>
                <div className="detail-row">
                    <dt>Średnie zużycie paliwa</dt>
                    <dd>{car.averageFuelConsumption}</dd>
                </div>
                <div className="detail-row">
                    <dt>Typ nadwozia</dt>
                    <dd>{getBodyTypeLabel(car.bodyType)}</dd>
                </div>
            </dl>
            <div className='buttonBox'>
                <Link to='edit' className='btn gold'>Edytuj</Link>
                <Link to='/cars' className='btn'>Wróć do listy</Link>
                <button type='button' 
                    className={isFavorite ? 'btn btn-gold' : 'btn'}
                    onClick={() => { if (user) toggleFavorite(user.id, car.id) }}
                >
                    {isFavorite ? 'Ulubiony' : 'Ulubione'}    
                </button>
            </div>
        </section>
    )
}