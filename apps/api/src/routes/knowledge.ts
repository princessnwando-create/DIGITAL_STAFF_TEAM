import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'

export async function knowledgeRoutes(fastify: FastifyInstance) {
  // Add authenticate middleware
  fastify.addHook('preHandler', async (request, reply) => {
    try {
      const decoded = await request.jwtVerify()
      ;(request as any).user = decoded
    } catch (err) {
      reply.status(401).send({ error: 'Unauthorized' })
    }
  })

  // List knowledge bases
  fastify.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
    const { workspaceId } = request.query as any
    
    if (!workspaceId) {
      return reply.status(400).send({ error: 'workspaceId is required' })
    }
    
    const knowledgeBases = await fastify.prisma.knowledgeBase.findMany({
      where: { workspaceId },
      include: {
        _count: {
          select: { entries: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    })
    
    return knowledgeBases
  })
  
  // Get single knowledge base
  fastify.get('/:id', async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    const { id } = request.params
    
    const knowledgeBase = await fastify.prisma.knowledgeBase.findUnique({
      where: { id },
      include: {
        entries: {
          orderBy: { createdAt: 'desc' },
          take: 100,
        },
      },
    })
    
    if (!knowledgeBase) {
      return reply.status(404).send({ error: 'Knowledge base not found' })
    }
    
    return knowledgeBase
  })
  
  // Create knowledge base
  fastify.post('/', async (request: FastifyRequest, reply: FastifyReply) => {
    const { workspaceId, name, description, type } = request.body as any
    
    if (!workspaceId || !name) {
      return reply.status(400).send({ error: 'workspaceId and name are required' })
    }
    
    const knowledgeBase = await fastify.prisma.knowledgeBase.create({
      data: {
        workspaceId,
        name,
        description,
        type: type || 'DOCUMENTS',
      },
    })
    
    return reply.status(201).send(knowledgeBase)
  })
  
  // Update knowledge base
  fastify.patch('/:id', async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    const { id } = request.params
    const { name, description, settings } = request.body as any
    
    const knowledgeBase = await fastify.prisma.knowledgeBase.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(settings && { settings }),
      },
    })
    
    return knowledgeBase
  })
  
  // Delete knowledge base
  fastify.delete('/:id', async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    const { id } = request.params
    
    await fastify.prisma.knowledgeBase.delete({
      where: { id },
    })
    
    return reply.status(204).send()
  })
  
  // Add entry to knowledge base
  fastify.post('/:id/entries', async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    const { id } = request.params
    const { title, content, source, sourceUrl, metadata, aiEmployeeId } = request.body as any
    
    if (!title || !content) {
      return reply.status(400).send({ error: 'title and content are required' })
    }
    
    // Verify knowledge base exists
    const knowledgeBase = await fastify.prisma.knowledgeBase.findUnique({
      where: { id },
    })
    
    if (!knowledgeBase) {
      return reply.status(404).send({ error: 'Knowledge base not found' })
    }
    
    const entry = await fastify.prisma.knowledgeEntry.create({
      data: {
        knowledgeBaseId: id,
        title,
        content,
        source,
        sourceUrl,
        metadata,
        aiEmployeeId,
      },
    })
    
    return reply.status(201).send(entry)
  })
  
  // Search knowledge base
  fastify.get('/:id/search', async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    const { id } = request.params
    const { q } = request.query as any
    
    if (!q) {
      return reply.status(400).send({ error: 'q (query) is required' })
    }
    
    // Simple text search (in production, use vector search)
    const entries = await fastify.prisma.knowledgeEntry.findMany({
      where: {
        knowledgeBaseId: id,
        OR: [
          { title: { contains: q, mode: 'insensitive' } },
          { content: { contains: q, mode: 'insensitive' } },
        ],
      },
      take: 20,
    })
    
    return entries
  })
  
  // Delete entry
  fastify.delete('/entries/:entryId', async (request: FastifyRequest<{ Params: { entryId: string } }>, reply: FastifyReply) => {
    const { entryId } = request.params
    
    await fastify.prisma.knowledgeEntry.delete({
      where: { id: entryId },
    })
    
    return reply.status(204).send()
  })
}
