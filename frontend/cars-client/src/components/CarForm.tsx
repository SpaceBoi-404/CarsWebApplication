import { useState } from 'react'
import type { NewCar } from '../models/Car'

interface CarFormProps {
    onSubmit: (carData: NewCar) => Promise<void>
    initialData?: CarFormData
}

export interface CarFormData {
    brand: string
    model: string
    doorsNumber: number | string;
    luggageCapacity: number | string
    engineCapacity: number | string
    fuelType: number | string
    productionDate: string
    averageFuelConsumption: number | string
    bodyType: number | string
}

const blankData: CarFormData = {
    brand: '',
    model: '',
    doorsNumber: '',
    luggageCapacity: '',
    engineCapacity: '',
    fuelType: '',
    productionDate: '',
    averageFuelConsumption: '',
    bodyType: ''
}

export default function CarForm({ onSubmit, initialData }: CarFormProps) {
    const [formData, setFormData] = useState<CarFormData>(initialData ?? blankData)
    const [isSubmitting, setIsSubmitting] = useState(false)

    function handleChange(event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
        const { name, value } = event.target
        setFormData(currentData => ({
            ...currentData,
            [name]: value
        }))
    }

    async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
        event.preventDefault()
        setIsSubmitting(true)

        const newCar: NewCar = {
            brand: formData.brand,
            model: formData.model,
            doorsNumber: Number(formData.doorsNumber),
            luggageCapacity: Number(formData.luggageCapacity),
            engineCapacity: Number(formData.engineCapacity),
            fuelType: Number(formData.fuelType),
            productionDate: formData.productionDate,
            averageFuelConsumption: Number(formData.averageFuelConsumption),
            bodyType: Number(formData.bodyType)
        }
    
        try {
            await onSubmit(newCar)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="car-form">
            <div>
                <label>Marka</label>
                <input name="brand" type='text' value={formData.brand}
                    onChange={handleChange} required />
            </div>
            <div>
                <label> Model</label>
                <input name="model" type='text' value={formData.model}
                    onChange={handleChange} required />
            </div>
            
            <div>
                <label>Liczba drzwi</label>
                    <input name="doorsNumber" type='number' value={formData.doorsNumber}
                        min={0} onChange={handleChange} required />
            </div>
            <div>
                <label>Pojemność bagażnika</label>
                    <input name="luggageCapacity" type='number' value={formData.luggageCapacity}
                        min={0} onChange={handleChange} required />
            </div>
            <div>
                <label>Pojemność silnika</label>
                <input name="engineCapacity" type='number' value={formData.engineCapacity}
                    min={0} onChange={handleChange} required />
            </div>
            <div>
                <label>Rodzaj paliwa</label>
                <select name="fuelType" onChange={handleChange} value={formData.fuelType} required>
                    <option value="" disabled hidden></option>
                    <option value={0}>Benzyna</option>
                    <option value={1}>Diesel</option>
                    <option value={2}>Hybryda</option>
                    <option value={3}>Elektryk</option>
                    <option value={4}>LPG</option>
                </select>
            </div>
            <div>
                <label>Data produkcji</label>
                    <input name="productionDate" type='date' value={formData.productionDate}
                        onChange={handleChange} required />
            </div>
            <div>
                <label>Średnie zużycie paliwa</label>
                    <input name="averageFuelConsumption" type='number' value={formData.averageFuelConsumption}
                        min={0} step={0.1} onChange={handleChange} required />
            </div>
            <div>
                <label>Typ nadwozia</label>
                <select name="bodyType" onChange={handleChange} value={formData.bodyType} required>
                    <option value="" disabled hidden></option>
                    <option value={0}>Hatchback</option>
                    <option value={1}>Sedan</option>
                    <option value={2}>Kombi</option>
                    <option value={3}>SUV</option>
                    <option value={4}>Roadster</option>
                </select>
            </div>
            <button type="submit" id='submitBtn' className='btn' disabled={isSubmitting}>
                {initialData ? 'Zapisz zmiany' : 'Dodaj samochód'}
            </button>
        </form>
    )
}