import Fastify from 'fastify'
import cors from '@fastify/cors'
import jwt from '@fastify/jwt'
import rateLimit from '@fastify/rate-limit'
import { PrismaClient } from '@prisma/client'
import { authRoutes } from './routes/auth.js'
import { workspaceRoutes } from './routes/workspaces.js'
import { aiEmployeeRoutes } from './routes/ai-employees.js'
import { knowledgeRoutes } from './routes/knowledge.js'
import { workflowRoutes } from './routes/workflows.js'

export const prisma = new PrismaClient()

const fastify = Fastify({
  logger: {
    transport: {
      target: 'pino-pretty',
      options: {
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname',
      },
    },
  },
})

// Register plugins
await fastify.register(cors, {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
})

await fastify.register(jwt, {
  secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production',
})

await fastify.register(rateLimit, {
  max: 100,
  timeWindow: '1 minute',
})

// Decorate with prisma
fastify.decorate('prisma', prisma)

// Health check
fastify.get('/health', async () => {
  return { status: 'ok', timestamp: new Date().toISOString() }
})

// Register routes
await fastify.register(authRoutes, { prefix: '/api/v1/auth' })
await fastify.register(workspaceRoutes, { prefix: '/api/v1/workspaces' })
await fastify.register(aiEmployeeRoutes, { prefix: '/api/v1/ai-employees' })
await fastify.register(knowledgeRoutes, { prefix: '/api/v1/knowledge' })
await fastify.register(workflowRoutes, { prefix: '/api/v1/workflows' })

// Error handler
fastify.setErrorHandler((error, request, reply) => {
  fastify.log.error(error)
  
  if (error.validation) {
    return reply.status(400).send({
      statusCode: 400,
      error: 'Validation Error',
      message: error.message,
    })
  }
  
  return reply.status(error.statusCode || 500).send({
    statusCode: error.statusCode || 500,
    error: error.name,
    message: error.message,
  })
})

// Start server
const start = async () => {
  try {
    await prisma.$connect()
    fastify.log.info('Database connected')
    
    await fastify.listen({ port: 3001, host: '0.0.0.0' })
    fastify.log.info('Server running at http://localhost:3001')
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

// Handle shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect()
  await fastify.close()
  process.exit(0)
})

start()

declare module 'fastify' {
  interface FastifyInstance {
    prisma: PrismaClient
  }
}
