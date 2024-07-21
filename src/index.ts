import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { userRouter } from './router/userRouter'
import { productRouter } from './router/productRouter'

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

app.listen(Number(process.env.PORT) || 3003, () => {
    console.log(`Server is running on port ${Number(process.env.PORT) || 3003}`)
})

app.use("/users", userRouter)
app.use("/products", productRouter)
