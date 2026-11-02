import Infrastructure from '../models/infrastructure.model'

export const generateAssetSerialNumber = async (modelCode: string): Promise<string> => {
    const cleanCode = modelCode.trim().toUpperCase()
    
    let isUnique = false
    let serialNumber = ''

    // Loop until we guarantee absolute uniqueness in the database
    while (!isUnique) {
        const randomSuffix = Math.floor(1000 + Math.random() * 9000) // 4-digit random number
        serialNumber = `${cleanCode}-${randomSuffix}`

        const existingAsset = await Infrastructure.findOne({ serialNumber })
        if (!existingAsset) {
            isUnique = true
        }
    }

    return serialNumber
}