export const FuelType = {
    Petrol: 0,
    Diesel: 1,
    Hybrid: 2,
    Electric: 3,
    LPG: 4
} as const

export type FuelType = typeof FuelType[keyof typeof FuelType]

export const BodyType = {
    Hatchback: 0,
    Sedan: 1,
    Kombi: 2,
    SUV: 3,
    Roadster: 4
} as const

export type BodyType = typeof BodyType[keyof typeof BodyType]

const fuelTypeLabels: Record<FuelType, string> = {
    [FuelType.Petrol]: 'Benzyna',
    [FuelType.Diesel]: 'Diesel',
    [FuelType.Hybrid]: 'Hybryda',
    [FuelType.Electric]: 'Elektryk',
    [FuelType.LPG]: 'LPG'
}

const bodyTypeLabels: Record<BodyType, string> = {
    [BodyType.Hatchback]: 'Hatchback',
    [BodyType.Sedan]: 'Sedan',
    [BodyType.Kombi]: 'Kombi',
    [BodyType.SUV]: 'SUV',
    [BodyType.Roadster]: 'Roadster'
}

export function getFuelTypeLabel(value: number): string {
    return fuelTypeLabels[value as FuelType] ?? `Nieznany (${value})`
}

export function getBodyTypeLabel(value: number): string {
    return bodyTypeLabels[value as BodyType] ?? `Nieznany (${value})`
}

export function formatDateForInput(value: string): string {
    return value.match(/^\d{4}-\d{2}-\d{2}/)?.[0] ?? ''
}

export function formatDateForDisplay(value: string): string {
    const dateForInput = formatDateForInput(value)
    if (!dateForInput) return value

    const [year, month, day] = dateForInput.split('-').map(Number)
    const date = new Date(year, month - 1, day)

    if (Number.isNaN(date.getTime())) return value

    return new Intl.DateTimeFormat('pl-PL').format(date)
}

export interface Car {
    id: string;
    brand: string;
    model: string;
    doorsNumber: number;
    luggageCapacity: number;
    engineCapacity: number;
    fuelType: FuelType;
    productionDate: string;
    averageFuelConsumption: number;
    bodyType: BodyType;
}

export type NewCar = Omit<Car, "id">;