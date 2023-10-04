import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient()


export const getDoorStatus = async () => {
    try {
        const res = await prisma.doorStatus.findUnique({ where: { id: 1 } })

        return res
    } catch (error) {
        return undefined
    }
}