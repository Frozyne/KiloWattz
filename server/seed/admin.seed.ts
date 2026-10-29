import 'dotenv/config'
import bcrypt from 'bcryptjs'
import mongoose from 'mongoose'
import connectToDB from '../config/db_config'
import User from '../models/user.model'
import { getSeedUser } from './data/user.data'

const SALT_ROUNDS = 10

async function seed(): Promise<void> {
    const uri = process.env.MONGODB_URI
    if (!uri) {
        throw new Error('Missing MONGODB URI in env file')
    }

    const isProduction = process.env.NODE_ENV === 'production'
    const isFresh = process.argv.includes('--fresh')

    if (isProduction && isFresh) {
        throw new Error('Refusing to run --fresh in production')
    }

    await connectToDB()

    const users = getSeedUser()

    const filteredUser = isProduction ? 
        users.filter((u) => u.role === 'admin') : 
        users

    if (isFresh) {
        const emails = users.map((u) => u.email.toLowerCase())
        const result = await User.deleteMany({email : {$in: emails}})

        console.log(`Deleted ${result.deletedCount} previously seeded user(s)`)
    }

    let created = 0
    let skipped = 0

    for (const user of filteredUser) {
        const email = user.email.toLowerCase()
        const exists = await User.exists({email})

        if (exists) {
            console.log(`Skipped (alreadyb exists) : ${email}`)
            skipped++
            continue
        }

        const hashedPassword = await bcrypt.hash(user.password, SALT_ROUNDS)

        await User.create({
            fullName: user.name,
            email,
            password: hashedPassword,
            role: user.role
        })

        console.log(`Created ${user.role}: ${user.email}`)
        created++
    }

    console.log(`Seeding complete. Created: ${created}, Skipped: ${skipped}`)
}

seed()
    .catch((error: unknown) => {
        console.error('Seeding failed', error)
        process.exitCode = 1
    })
    .finally(async () => {
        await mongoose.disconnect()
    })