export interface WeatherStatus {
    condition: 'Sunny' | 'Partly Cloudy' | 'Cloudy' | 'Overcast / Rainy' | 'Night / Low Light'
    description: string
    colorClass: string // Tailwind text color styling
    bgClass: string    // Tailwind badge background styling
}

export const getWeatherCondition = (
    solarIrradianceWm2: number = 0,
    cloudCoverPercent: number = 0
): WeatherStatus => {
    // 1. Night / Dark threshold (Irradiance near zero)
    if (solarIrradianceWm2 < 20) {
        return {
            condition: 'Night / Low Light',
            description: 'Minimal to no solar generation active',
            colorClass: 'text-indigo-400',
            bgClass: 'bg-indigo-950/40 border-indigo-800/40',
        }
    }

    // 2. Heavy Cloud Cover / Rainy (High cloudiness + low solar irradiance during daytime)
    if (cloudCoverPercent >= 75 && solarIrradianceWm2 < 250) {
        return {
            condition: 'Overcast / Rainy',
            description: 'Heavy cloud density reducing solar yields',
            colorClass: 'text-blue-400',
            bgClass: 'bg-blue-950/40 border-blue-800/40',
        }
    }

    // 3. Moderate Cloud Cover
    if (cloudCoverPercent >= 50 || (solarIrradianceWm2 >= 250 && solarIrradianceWm2 < 550)) {
        return {
            condition: 'Cloudy',
            description: 'Diffused sunlight with moderate output',
            colorClass: 'text-slate-300',
            bgClass: 'bg-slate-800/40 border-slate-700/40',
        }
    }

    // 4. Partly Cloudy
    if (cloudCoverPercent >= 20 || (solarIrradianceWm2 >= 550 && solarIrradianceWm2 < 750)) {
        return {
            condition: 'Partly Cloudy',
            description: 'Intermittent cloud passing with strong peak pulses',
            colorClass: 'text-amber-300',
            bgClass: 'bg-amber-950/40 border-amber-800/40',
        }
    }

    // 5. Clear / Sunny (Low cloudiness + high irradiance)
    return {
        condition: 'Sunny',
        description: 'Optimal irradiance and maximum photovoltaic yield',
        colorClass: 'text-amber-400',
        bgClass: 'bg-amber-500/10 border-amber-500/30',
    }
}