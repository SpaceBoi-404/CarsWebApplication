import CarCard  from '../components/CarCard'
import { useEffect, useState } from 'react'
import type { Car } from '../models/Car'
import { getCars, deleteCar } from '../services/carService'
import axios from 'axios'
import { useCarUiStore } from '../store/useCarUiStore'
import { useAuthStore } from '../store/useAuthStore'

export default function CarsPage() {
    const [cars, setCars] = useState<Car[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const user = useAuthStore((state) => state.user)
    const searchTerm = useCarUiStore((state) => state.searchTerm)
    const setSearchTerm = useCarUiStore((state) => state.setSearchTerm)
    const showFavoritesOnly = useCarUiStore((state) => state.showFavoritesOnly)
    const setShowFavoritesOnly = useCarUiStore((state) => state.setShowFavoritesOnly)
    const favoriteCarIdsByUser = useCarUiStore((state) => state.favoriteCarIdsByUser)
    const favoriteCarIds  = user ? favoriteCarIdsByUser[user.id] ?? [] : []
    const removeFavorite = useCarUiStore((state) => state.removeFavorite)

    const normalizedSearch = searchTerm.trim().toLowerCase()
    const visibleCars = cars.filter((car) => {
        const matchesSearch = car.brand.toLowerCase().includes(normalizedSearch)
            || car.model.toLowerCase().includes(normalizedSearch)
        
        const matchesFavorite = !showFavoritesOnly || favoriteCarIds.includes(car.id)

        return (matchesSearch && matchesFavorite)
    })

    
    
    useEffect(() => {
        const controller = new AbortController();

        async function loadCars() {
            try {
                setIsLoading(true)
                setError(null)
                setCars(await getCars(controller.signal))
            } catch (e) {
                if (axios.isCancel(e)) {
                    return
                }

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
            if (user) removeFavorite(user.id, id)
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
            <div className='cars-toolbar'>
                <input type="search" placeholder='Szukaj po marce lub modelu'
                    value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} />
                <label className='favorite-filter'>
                    <input type="checkbox" checked={showFavoritesOnly} 
                        onChange={(event) => setShowFavoritesOnly(event.target.checked)}
                    />
                    Tylko ulubione
                </label>
            </div>
            <div className='cars-list'>
                {visibleCars.map((car) => (
                    <CarCard key={car.id} car={car} onDelete={handleDelete} />
                ))}
            </div>
        </section>
    )
}