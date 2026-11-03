import { useNavigate } from 'react-router'
import CarForm from '../components/CarForm'
import type { NewCar } from '../models/Car'
import { createCar } from '../services/carService'

export default function CreateCarPage() {
    const navigate = useNavigate()
    async function handleSubmit(newCar: NewCar): Promise<void> {
        try {
            await createCar(newCar)
            navigate('/cars')
        } catch (e) {
            if (e instanceof Error) alert(e.message)
            else alert('Wystąpił nieznany błąd.')
        }
    }

    return (
        <section>
            <h1>Dodaj nowy samochód</h1>
            <CarForm onSubmit={handleSubmit} />
        </section>
    )
}