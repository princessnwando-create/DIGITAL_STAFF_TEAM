import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'

const createWorkspaceSchema = z.object({
  name: z.string().min(1),
})

export async function workspaceRoutes(fastify: FastifyInstance) {
  // Add authenticate middleware
  fastify.addHook('preHandler', async (request, reply) => {
    try {
      const decoded = await request.jwtVerify()
      ;(request as any).user = decoded
    } catch (err) {
      reply.status(401).send({ error: 'Unauthorized' })
    }
  })

  // List workspaces for current user
  fastify.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
    const userId = (request as any).user.id
    
    const memberships = await fastify.prisma.workspaceMember.findMany({
      where: { userId },
      include: {
        workspace: {
          include: {
            _count: {
              select: {
                members: true,
                aiEmployees: true,
                departments: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })
    
    return memberships.map((m) => ({
      id: m.workspace.id,
      name: m.workspace.name,
      slug: m.workspace.slug,
      logo: m.workspace.logo,
      plan: m.workspace.plan,
      role: m.role,
      stats: {
        members: m.workspace._count.members,
        aiEmployees: m.workspace._count.aiEmployees,
        departments: m.workspace._count.departments,
      },
      createdAt: m.workspace.createdAt,
    }))
  })
  
  // Get single workspace
  fastify.get('/:id', async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    const { id } = request.params
    const userId = (request as any).user.id
    
    // Verify membership
    const membership = await fastify.prisma.workspaceMember.findFirst({
      where: { workspaceId: id, userId },
    })
    
    if (!membership) {
      return reply.status(403).send({ error: 'Access denied' })
    }
    
    const workspace = await fastify.prisma.workspace.findUnique({
      where: { id },
      include: {
        members: {
          include: {
            user: {
              select: { id: true, email: true, firstName: true, lastName: true, avatar: true },
            },
          },
        },
        departments: {
          orderBy: { order: 'asc' },
        },
        aiEmployees: {
          select: {
            id: true,
            name: true,
            role: true,
            status: true,
            department: true,
          },
        },
        _count: {
          select: {
            members: true,
            aiEmployees: true,
            departments: true,
            workflows: true,
          },
        },
      },
    })
    
    if (!workspace) {
      return reply.status(404).send({ error: 'Workspace not found' })
    }
    
    return {
      ...workspace,
      userRole: membership.role,
    }
  })
  
  // Create workspace
  fastify.post('/', async (request: FastifyRequest, reply: FastifyReply) => {
    const body = createWorkspaceSchema.parse(request.body)
    const userId = (request as any).user.id
    
    const slug = body.name.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now()
    
    const workspace = await fastify.prisma.workspace.create({
      data: {
        name: body.name,
        slug,
        members: {
          create: {
            userId,
            role: 'OWNER',
          },
        },
      },
    })
    
    // Create default departments
    const defaultDepartments = [
      'Human Resources',
      'Finance',
      'Sales',
      'Marketing',
      'Customer Support',
      'IT',
    ]
    
    for (let i = 0; i < defaultDepartments.length; i++) {
      await fastify.prisma.department.create({
        data: {
          workspaceId: workspace.id,
          name: defaultDepartments[i],
          order: i,
        },
      })
    }
    
    // Create default AI employees
    await fastify.prisma.aIEmployee.createMany({
      data: [
        {
          workspaceId: workspace.id,
          name: 'HR Assistant',
          role: 'AI HR Assistant',
          departmentId: (await fastify.prisma.department.findFirst({ where: { workspaceId: workspace.id, name: 'Human Resources' } }))?.id,
          description: 'Helps with HR tasks including recruitment and employee management',
          skills: ['Resume Screening', 'Interview Scheduling', 'Employee Onboarding'],
          tools: ['Email', 'Calendar', 'HRIS'],
        },
        {
          workspaceId: workspace.id,
          name: 'Finance Analyst',
          role: 'AI Finance Analyst',
          departmentId: (await fastify.prisma.department.findFirst({ where: { workspaceId: workspace.id, name: 'Finance' } }))?.id,
          description: 'Assists with financial analysis, reporting, and expense management',
          skills: ['Financial Analysis', 'Report Generation', 'Expense Tracking'],
          tools: ['Accounting Software', 'Spreadsheet', 'Email'],
        },
      ],
    })
    
    return reply.status(201).send(workspace)
  })
  
  // Update workspace
  fastify.patch('/:id', async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    const { id } = request.params
    const { name, logo, brandColor, settings } = request.body as any
    const userId = (request as any).user.id
    
    // Verify admin access
    const membership = await fastify.prisma.workspaceMember.findFirst({
      where: { workspaceId: id, userId, role: { in: ['OWNER', 'ADMIN'] } },
    })
    
    if (!membership) {
      return reply.status(403).send({ error: 'Admin access required' })
    }
    
    const workspace = await fastify.prisma.workspace.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(logo !== undefined && { logo }),
        ...(brandColor && { brandColor }),
        ...(settings && { settings }),
      },
    })
    
    return workspace
  })
  
  // List workspace members
  fastify.get('/:id/members', async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    const { id } = request.params
    
    const members = await fastify.prisma.workspaceMember.findMany({
      where: { workspaceId: id },
      include: {
        user: {
          select: { id: true, email: true, firstName: true, lastName: true, avatar: true },
        },
      },
    })
    
    return members
  })
  
  // List departments
  fastify.get('/:id/departments', async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    const { id } = request.params
    
    const departments = await fastify.prisma.department.findMany({
      where: { workspaceId: id },
      include: {
        _count: {
          select: { aiEmployees: true },
        },
      },
      orderBy: { order: 'asc' },
    })
    
    return departments
  })
  
  // Create department
  fastify.post('/:id/departments', async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    const { id } = request.params
    const { name, description, parentId, color } = request.body as any
    
    if (!name) {
      return reply.status(400).send({ error: 'name is required' })
    }
    
    const department = await fastify.prisma.department.create({
      data: {
        workspaceId: id,
        name,
        description,
        parentId,
        color,
      },
    })
    
    return reply.status(201).send(department)
  })
}
