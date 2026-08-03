import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { authenticate } from './auth.js'

const createAIEmployeeSchema = z.object({
  name: z.string().min(1),
  role: z.string().min(1),
  departmentId: z.string().optional(),
  description: z.string().optional(),
  skills: z.array(z.string()).optional(),
  tools: z.array(z.string()).optional(),
  permissions: z.array(z.string()).optional(),
  communicationStyle: z.string().optional(),
  managerId: z.string().optional(),
  approvalLimit: z.number().optional(),
})

const updateAIEmployeeSchema = createAIEmployeeSchema.partial()

export async function aiEmployeeRoutes(fastify: FastifyInstance) {
  // Add authenticate middleware
  fastify.addHook('preHandler', async (request, reply) => {
    try {
      const decoded = await request.jwtVerify()
      ;(request as any).user = decoded
    } catch (err) {
      reply.status(401).send({ error: 'Unauthorized' })
    }
  })

  // List AI Employees
  fastify.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
    const { workspaceId, search, departmentId, status } = request.query as any
    
    if (!workspaceId) {
      return reply.status(400).send({ error: 'workspaceId is required' })
    }
    
    const where: any = { workspaceId }
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { role: { contains: search, mode: 'insensitive' } },
      ]
    }
    
    if (departmentId) {
      where.departmentId = departmentId
    }
    
    if (status) {
      where.status = status
    }
    
    const aiEmployees = await fastify.prisma.aIEmployee.findMany({
      where,
      include: {
        department: true,
        manager: {
          select: { id: true, name: true, role: true },
        },
        _count: {
          select: { conversations: true, tasks: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    })
    
    return aiEmployees
  })
  
  // Get single AI Employee
  fastify.get('/:id', async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    const { id } = request.params
    
    const aiEmployee = await fastify.prisma.aIEmployee.findUnique({
      where: { id },
      include: {
        department: true,
        manager: {
          select: { id: true, name: true, role: true },
        },
        subordinates: {
          select: { id: true, name: true, role: true },
        },
        conversations: {
          orderBy: { updatedAt: 'desc' },
          take: 10,
          include: {
            messages: {
              orderBy: { createdAt: 'desc' },
              take: 1,
            },
          },
        },
        _count: {
          select: { conversations: true, tasks: true },
        },
      },
    })
    
    if (!aiEmployee) {
      return reply.status(404).send({ error: 'AI Employee not found' })
    }
    
    return aiEmployee
  })
  
  // Create AI Employee
  fastify.post('/', async (request: FastifyRequest, reply: FastifyReply) => {
    const body = createAIEmployeeSchema.parse(request.body)
    const userId = (request as any).user.id
    
    // Verify workspace access (for now, just check user exists)
    const user = await fastify.prisma.user.findUnique({ where: { id: userId } })
    if (!user) {
      return reply.status(401).send({ error: 'Unauthorized' })
    }
    
    // Get first workspace for demo
    const membership = await fastify.prisma.workspaceMember.findFirst({
      where: { userId },
    })
    
    if (!membership) {
      return reply.status(403).send({ error: 'No workspace access' })
    }
    
    const aiEmployee = await fastify.prisma.aIEmployee.create({
      data: {
        workspaceId: membership.workspaceId,
        name: body.name,
        role: body.role,
        departmentId: body.departmentId,
        description: body.description,
        skills: body.skills || [],
        tools: body.tools || [],
        permissions: body.permissions || [],
        communicationStyle: body.communicationStyle || 'professional',
        managerId: body.managerId,
        approvalLimit: body.approvalLimit,
      },
      include: {
        department: true,
      },
    })
    
    return reply.status(201).send(aiEmployee)
  })
  
  // Update AI Employee
  fastify.patch('/:id', async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    const { id } = request.params
    const body = updateAIEmployeeSchema.parse(request.body)
    
    const aiEmployee = await fastify.prisma.aIEmployee.update({
      where: { id },
      data: body,
      include: {
        department: true,
      },
    })
    
    return aiEmployee
  })
  
  // Delete AI Employee
  fastify.delete('/:id', async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    const { id } = request.params
    
    await fastify.prisma.aIEmployee.delete({
      where: { id },
    })
    
    return reply.status(204).send()
  })
  
  // Chat with AI Employee
  fastify.post('/:id/chat', async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    const { id } = request.params
    const { message, conversationId } = request.body as any
    
    if (!message) {
      return reply.status(400).send({ error: 'message is required' })
    }
    
    // Get AI Employee
    const aiEmployee = await fastify.prisma.aIEmployee.findUnique({
      where: { id },
    })
    
    if (!aiEmployee) {
      return reply.status(404).send({ error: 'AI Employee not found' })
    }
    
    // Get or create conversation
    let conversation
    if (conversationId) {
      conversation = await fastify.prisma.aIConversation.findUnique({
        where: { id: conversationId },
      })
    }
    
    if (!conversation) {
      conversation = await fastify.prisma.aIConversation.create({
        data: {
          aiEmployeeId: id,
          userId: (request as any).user.id,
        },
      })
    }
    
    // Add user message
    await fastify.prisma.aIMessage.create({
      data: {
        conversationId: conversation.id,
        role: 'USER',
        content: message,
      },
    })
    
    // TODO: Integrate with OpenAI/Claude for actual AI response
    // For now, return a mock response
    const response = `This is a simulated response from ${aiEmployee.name}. In production, this would call the AI model with the configured prompt and context.`
    
    // Add assistant message
    const assistantMessage = await fastify.prisma.aIMessage.create({
      data: {
        conversationId: conversation.id,
        role: 'ASSISTANT',
        content: response,
      },
    })
    
    return {
      message: assistantMessage,
      conversationId: conversation.id,
    }
  })
  
  // Get AI Employee conversations
  fastify.get('/:id/conversations', async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    const { id } = request.params
    
    const conversations = await fastify.prisma.aIConversation.findMany({
      where: { aiEmployeeId: id },
      orderBy: { updatedAt: 'desc' },
      take: 50,
      include: {
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    })
    
    return conversations
  })
  
  // Get AI Employee tasks
  fastify.get('/:id/tasks', async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    const { id } = request.params
    const { status } = request.query as any
    
    const where: any = { aiEmployeeId: id }
    if (status) {
      where.status = status
    }
    
    const tasks = await fastify.prisma.aITask.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 50,
    })
    
    return tasks
  })
  
  // Update AI Employee memory
  fastify.post('/:id/memory', async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    const { id } = request.params
    const { memory } = request.body as any
    
    if (!memory) {
      return reply.status(400).send({ error: 'memory content is required' })
    }
    
    const aiEmployee = await fastify.prisma.aIEmployee.findUnique({
      where: { id },
    })
    
    if (!aiEmployee) {
      return reply.status(404).send({ error: 'AI Employee not found' })
    }
    
    const currentMemory = aiEmployee.memory as string[]
    const updatedMemory = [...currentMemory, memory]
    
    const updated = await fastify.prisma.aIEmployee.update({
      where: { id },
      data: { memory: updatedMemory },
    })
    
    return updated
  })
}
