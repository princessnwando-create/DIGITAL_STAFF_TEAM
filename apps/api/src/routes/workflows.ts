import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'

export async function workflowRoutes(fastify: FastifyInstance) {
  // Add authenticate middleware
  fastify.addHook('preHandler', async (request, reply) => {
    try {
      const decoded = await request.jwtVerify()
      ;(request as any).user = decoded
    } catch (err) {
      reply.status(401).send({ error: 'Unauthorized' })
    }
  })

  // List workflows
  fastify.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
    const { workspaceId, status } = request.query as any
    
    if (!workspaceId) {
      return reply.status(400).send({ error: 'workspaceId is required' })
    }
    
    const where: any = { workspaceId }
    if (status) {
      where.status = status
    }
    
    const workflows = await fastify.prisma.workflow.findMany({
      where,
      include: {
        triggers: true,
        _count: {
          select: { runs: true },
        },
      },
      orderBy: { updatedAt: 'desc' },
    })
    
    return workflows
  })
  
  // Get single workflow
  fastify.get('/:id', async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    const { id } = request.params
    
    const workflow = await fastify.prisma.workflow.findUnique({
      where: { id },
      include: {
        triggers: true,
        nodes: true,
        runs: {
          orderBy: { startedAt: 'desc' },
          take: 10,
          include: {
            logs: {
              orderBy: { createdAt: 'desc' },
              take: 20,
            },
          },
        },
      },
    })
    
    if (!workflow) {
      return reply.status(404).send({ error: 'Workflow not found' })
    }
    
    return workflow
  })
  
  // Create workflow
  fastify.post('/', async (request: FastifyRequest, reply: FastifyReply) => {
    const { workspaceId, name, description, definition } = request.body as any
    
    if (!workspaceId || !name) {
      return reply.status(400).send({ error: 'workspaceId and name are required' })
    }
    
    const workflow = await fastify.prisma.workflow.create({
      data: {
        workspaceId,
        name,
        description,
        definition: definition || { nodes: [], edges: [] },
      },
    })
    
    return reply.status(201).send(workflow)
  })
  
  // Update workflow
  fastify.patch('/:id', async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    const { id } = request.params
    const { name, description, definition, status } = request.body as any
    
    const workflow = await fastify.prisma.workflow.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(definition && { definition }),
        ...(status && { status }),
      },
    })
    
    return workflow
  })
  
  // Delete workflow
  fastify.delete('/:id', async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    const { id } = request.params
    
    await fastify.prisma.workflow.delete({
      where: { id },
    })
    
    return reply.status(204).send()
  })
  
  // Add trigger to workflow
  fastify.post('/:id/triggers', async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    const { id } = request.params
    const { type, config } = request.body as any
    
    if (!type || !config) {
      return reply.status(400).send({ error: 'type and config are required' })
    }
    
    const trigger = await fastify.prisma.workflowTrigger.create({
      data: {
        workflowId: id,
        type,
        config,
      },
    })
    
    return reply.status(201).send(trigger)
  })
  
  // Add node to workflow
  fastify.post('/:id/nodes', async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    const { id } = request.params
    const { type, name, config, position } = request.body as any
    
    if (!type || !name) {
      return reply.status(400).send({ error: 'type and name are required' })
    }
    
    const node = await fastify.prisma.workflowNode.create({
      data: {
        workflowId: id,
        type,
        name,
        config: config || {},
        position: position || { x: 0, y: 0 },
      },
    })
    
    return reply.status(201).send(node)
  })
  
  // Run workflow manually
  fastify.post('/:id/run', async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    const { id } = request.params
    const triggerData = request.body
    
    // Get workflow
    const workflow = await fastify.prisma.workflow.findUnique({
      where: { id },
      include: { nodes: true },
    })
    
    if (!workflow) {
      return reply.status(404).send({ error: 'Workflow not found' })
    }
    
    // Create run
    const run = await fastify.prisma.workflowRun.create({
      data: {
        workflowId: id,
        triggerData,
        status: 'RUNNING',
      },
    })
    
    // Log start
    await fastify.prisma.workflowLog.create({
      data: {
        runId: run.id,
        level: 'INFO',
        message: 'Workflow run started',
        data: { triggerData },
      },
    })
    
    // Update workflow stats
    await fastify.prisma.workflow.update({
      where: { id },
      data: {
        totalRuns: { increment: 1 },
        lastRunAt: new Date(),
      },
    })
    
    // TODO: Execute workflow nodes (async)
    // For now, simulate completion
    setTimeout(async () => {
      await fastify.prisma.workflowRun.update({
        where: { id: run.id },
        data: {
          status: 'COMPLETED',
          completedAt: new Date(),
        },
      })
      
      await fastify.prisma.workflowLog.create({
        data: {
          runId: run.id,
          level: 'INFO',
          message: 'Workflow run completed',
        },
      })
    }, 1000)
    
    return reply.status(201).send({ runId: run.id })
  })
  
  // Get workflow runs
  fastify.get('/:id/runs', async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    const { id } = request.params
    const { status } = request.query as any
    
    const where: any = { workflowId: id }
    if (status) {
      where.status = status
    }
    
    const runs = await fastify.prisma.workflowRun.findMany({
      where,
      orderBy: { startedAt: 'desc' },
      take: 50,
      include: {
        logs: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    })
    
    return runs
  })
  
  // Toggle workflow status
  fastify.post('/:id/toggle', async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    const { id } = request.params
    
    const workflow = await fastify.prisma.workflow.findUnique({
      where: { id },
    })
    
    if (!workflow) {
      return reply.status(404).send({ error: 'Workflow not found' })
    }
    
    const newStatus = workflow.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE'
    
    const updated = await fastify.prisma.workflow.update({
      where: { id },
      data: { status: newStatus },
    })
    
    return updated
  })
}
