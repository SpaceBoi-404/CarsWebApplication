import { Link } from 'react-router'
import { formatDateForDisplay, type Car } from '../models/Car'
import { useCarUiStore } from '../store/useCarUiStore'

interface CarCardProps {
    car: Car
    onDelete: (id: string) => void
}

export default function CarCard({ car, onDelete }: CarCardProps) {
    const isFavorite = useCarUiStore((state) => state.favoriteCarIds.includes(car.id))
    const toggleFavorite = useCarUiStore((state) => state.toggleFavorite)
    return (
        <article className='car-card'>
            <h3>{car.brand} {car.model}</h3>
            <p>Data produkcji: {formatDateForDisplay(car.productionDate)}</p>

            <div className='buttonBox'>
                <Link to={`/cars/${car.id}`} className='btn'>Szczegóły</Link>
                <Link to={`/cars/${car.id}/edit`} className='btn'>Edytuj</Link>
                <button type='button' className='btn' onClick={() => onDelete(car.id)}>Usuń</button>
                <button type='button' 
                    className={isFavorite ? 'btn btn-gold' : 'btn'}
                    onClick={() => toggleFavorite(car.id)}
                >
                    {isFavorite ? 'Ulubiony' : 'Ulubione'}    
                </button>
            </div>
        </article>
    )
}