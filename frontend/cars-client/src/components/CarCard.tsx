import { Link } from 'react-router'
import { formatDateForDisplay, type Car } from '../models/Car'
import { useCarUiStore } from '../store/useCarUiStore'
import { useAuthStore } from '../store/useAuthStore'

interface CarCardProps {
    car: Car
    onDelete: (id: string) => void
}

export default function CarCard({ car, onDelete }: CarCardProps) {
    const user = useAuthStore((state) => state.user)
    const favoriteCarIdsByUser = useCarUiStore((state) => state.favoriteCarIdsByUser)
    const favoriteCarIds  = user ? favoriteCarIdsByUser[user.id] ?? [] : []
    const isFavorite = favoriteCarIds.includes(car.id)
    const toggleFavorite = useCarUiStore((state) => state.toggleFavorite)
    const isAdmin = user?.roles.includes('Admin')

    return (
        <article className='car-card'>
            <h3>{car.brand} {car.model}</h3>
            <p>Data produkcji: {formatDateForDisplay(car.productionDate)}</p>

            <div className='buttonBox'>
                <Link to={`/cars/${car.id}`} className='btn'>Szczegóły</Link>
                <Link to={`/cars/${car.id}/edit`} className='btn'>Edytuj</Link>

                <button type='button' className='btn' onClick={() => onDelete(car.id)} hidden={!isAdmin}>Usuń</button>
                <button type='button' 
                    className={isFavorite ? 'btn btn-gold' : 'btn'}
                    onClick={() => {if (user) toggleFavorite(user.id, car.id)}}
                >
                    {isFavorite ? 'Ulubiony' : 'Ulubione'}    
                </button>
            </div>
        </article>
    )
}