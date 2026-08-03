import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  companyName: z.string().optional(),
})

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

export async function authRoutes(fastify: FastifyInstance) {
  
  // Register
  fastify.post('/register', async (request: FastifyRequest, reply: FastifyReply) => {
    const body = registerSchema.parse(request.body)
    
    // Check if user exists
    const existingUser = await fastify.prisma.user.findUnique({
      where: { email: body.email },
    })
    
    if (existingUser) {
      return reply.status(400).send({
        error: 'User already exists',
        message: 'An account with this email already exists',
      })
    }
    
    // Hash password
    const passwordHash = await bcrypt.hash(body.password, 12)
    
    // Create user
    const user = await fastify.prisma.user.create({
      data: {
        email: body.email,
        passwordHash,
        firstName: body.firstName,
        lastName: body.lastName,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        createdAt: true,
      },
    })
    
    // If company name provided, create workspace
    let workspace = null
    if (body.companyName) {
      const slug = body.companyName.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now()
      workspace = await fastify.prisma.workspace.create({
        data: {
          name: body.companyName,
          slug,
          members: {
            create: {
              userId: user.id,
              role: 'OWNER',
            },
          },
        },
      })
      
      // Create default HR department
      await fastify.prisma.department.create({
        data: {
          workspaceId: workspace.id,
          name: 'Human Resources',
          description: 'HR Department',
        },
      })
      
      // Create default AI Recruiter
      await fastify.prisma.aIEmployee.create({
        data: {
          workspaceId: workspace.id,
          name: 'AI Recruiter',
          role: 'AI Recruiter',
          description: 'Handles recruitment and hiring processes',
          status: 'ACTIVE',
          skills: ['Resume Screening', 'Interview Scheduling', 'Candidate Communication'],
          tools: ['Email', 'Calendar', 'CRM'],
        },
      })
    }
    
    // Generate JWT
    const token = fastify.jwt.sign({
      id: user.id,
      email: user.email,
    })
    
    return reply.status(201).send({
      user,
      workspace,
      token,
    })
  })
  
  // Login
  fastify.post('/login', async (request: FastifyRequest, reply: FastifyReply) => {
    const body = loginSchema.parse(request.body)
    
    const user = await fastify.prisma.user.findUnique({
      where: { email: body.email },
      include: {
        workspaceMemberships: {
          include: {
            workspace: true,
          },
        },
      },
    })
    
    if (!user) {
      return reply.status(401).send({
        error: 'Invalid credentials',
        message: 'Invalid email or password',
      })
    }
    
    const validPassword = await bcrypt.compare(body.password, user.passwordHash)
    if (!validPassword) {
      return reply.status(401).send({
        error: 'Invalid credentials',
        message: 'Invalid email or password',
      })
    }
    
    // Generate JWT
    const token = fastify.jwt.sign({
      id: user.id,
      email: user.email,
    })
    
    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        avatar: user.avatar,
      },
      workspaces: user.workspaceMemberships.map((m) => ({
        id: m.workspace.id,
        name: m.workspace.name,
        slug: m.workspace.slug,
        role: m.role,
      })),
      token,
    }
  })
  
  // Get current user
  fastify.get('/me', {
    preHandler: [fastify.authenticate],
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    const user = await fastify.prisma.user.findUnique({
      where: { id: (request as any).user.id },
      include: {
        workspaceMemberships: {
          include: {
            workspace: true,
          },
        },
      },
    })
    
    if (!user) {
      return reply.status(404).send({
        error: 'User not found',
      })
    }
    
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      avatar: user.avatar,
      workspaces: user.workspaceMemberships.map((m) => ({
        id: m.workspace.id,
        name: m.workspace.name,
        slug: m.workspace.slug,
        role: m.role,
      })),
    }
  })
}

// Extend FastifyInstance to include authenticate
declare module 'fastify' {
  interface FastifyInstance {
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>
  }
}

export async function authenticate(fastify: FastifyInstance) {
  return async function (request: FastifyRequest, reply: FastifyReply) {
    try {
      const decoded = await request.jwtVerify()
      ;(request as any).user = decoded
    } catch (err) {
      reply.status(401).send({ error: 'Unauthorized' })
    }
  }
}
