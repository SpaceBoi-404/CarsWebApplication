import { Link } from 'react-router'
import type { Car } from '../models/Car'

interface CarCardProps {
    car: Car
    onDelete: (id: string) => void
}

export default function CarCard({ car, onDelete }: CarCardProps) {
    return (
        <article className='car-card'>
            <h3>{car.brand} {car.model}</h3>
            <p>Data produkcji: {car.productionDate}</p>

            <div className='buttonBox'>
                <Link to={`/cars/${car.id}`} className='btn'>Szczegóły</Link>
                <Link to={`/cars/${car.id}/edit`} className='btn-secondary'>Edytuj</Link>
                <button type='button' className='btn-secondary' onClick={() => onDelete(car.id)}>Usuń</button>
            </div>
        </article>
    )
}