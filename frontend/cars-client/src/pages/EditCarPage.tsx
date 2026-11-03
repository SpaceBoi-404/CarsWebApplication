import { Link, useNavigate, useParams } from 'react-router'
import CarForm, { type CarFormData } from '../components/CarForm'
import { useState, useEffect } from 'react'
import { getCarById, upadteCar } from '../services/carService'
import type { NewCar } from '../models/Car'

export default function EditCarPage() {
    const { id } = useParams()
    const navigate = useNavigate()

    const [initialData, setInitialData] = useState<CarFormData | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const controller = new AbortController();

        async function fetchCar() {
            try {
                if (!id) return
                setIsLoading(true)
                setError(null)
                const car = await getCarById(id, controller.signal)
                setInitialData({
                    brand: car.brand,
                    model: car.model,
                    doorsNumber: car.doorsNumber,
                    luggageCapacity: car.luggageCapacity,
                    engineCapacity: car.engineCapacity,
                    fuelType: car.fuelType,
                    productionDate: car.productionDate,
                    averageFuelConsumption: car.averageFuelConsumption,
                    bodyType: car.bodyType
                })
            } catch (e) {
                if (e instanceof DOMException && e.name === 'AbortError') return
                if (e instanceof Error) setError(e.message)
                else setError('Wystąpił nieznany błąd')
            } finally {
                if (!controller.signal.aborted) setIsLoading(false)
            }
        }

        fetchCar()

        return () => {
            controller.abort();
        }
    }, [id])

    async function handleSubmit(newCar: NewCar): Promise<void> {
        if (!id) return
        try {
            setIsLoading(true)
            setError(null)
            await upadteCar(id, newCar)
            navigate(`/cars/${id}`)
        } catch (e) {
            if (e instanceof Error) setError(e.message)
            else setError('Wystąpił nieznany błąd')
        } finally {
            setIsLoading(false)
        }
    }

    if (isLoading) {
        return <p>Ładowanie danych...</p>
    }

    if (error) {
        return <p className='error'>{error}</p>
    }

    if (!initialData) return

    return (
        <section>
            <h1>Edytuj samochód</h1>
            <CarForm onSubmit={handleSubmit} initialData={initialData} />
            <Link to='/cars' className='btn-secondary'>Wróć do listy samochodów</Link>
        </section>
    )
}