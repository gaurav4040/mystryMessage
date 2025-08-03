import {z} from 'zod'


export const messageSchema = z.object({
    content:z.string().min(10,{message:"message must be at least 10 character"}).max(300,{message:"message must be with in 300 character"})
})