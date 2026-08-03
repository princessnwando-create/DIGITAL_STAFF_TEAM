import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1'

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add auth token to requests
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token')
        window.location.href = '/'
      }
    }
    return Promise.reject(error)
  }
)

// Auth API
export const authApi = {
  register: (data: {
    email: string
    password: string
    firstName: string
    lastName: string
    companyName?: string
  }) => api.post('/auth/register', data),
  
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  
  me: () => api.get('/auth/me'),
}

// Workspace API
export const workspaceApi = {
  list: () => api.get('/workspaces'),
  
  get: (id: string) => api.get(`/workspaces/${id}`),
  
  create: (data: { name: string }) => api.post('/workspaces', data),
  
  update: (id: string, data: any) => api.patch(`/workspaces/${id}`, data),
  
  getMembers: (id: string) => api.get(`/workspaces/${id}/members`),
  
  getDepartments: (id: string) => api.get(`/workspaces/${id}/departments`),
  
  createDepartment: (id: string, data: any) =>
    api.post(`/workspaces/${id}/departments`, data),
}

// AI Employee API
export const aiEmployeeApi = {
  list: (params?: { workspaceId: string; search?: string; departmentId?: string; status?: string }) =>
    api.get('/ai-employees', { params }),
  
  get: (id: string) => api.get(`/ai-employees/${id}`),
  
  create: (data: any) => api.post('/ai-employees', data),
  
  update: (id: string, data: any) => api.patch(`/ai-employees/${id}`, data),
  
  delete: (id: string) => api.delete(`/ai-employees/${id}`),
  
  chat: (id: string, data: { message: string; conversationId?: string }) =>
    api.post(`/ai-employees/${id}/chat`, data),
  
  getConversations: (id: string) =>
    api.get(`/ai-employees/${id}/conversations`),
  
  getTasks: (id: string, params?: { status?: string }) =>
    api.get(`/ai-employees/${id}/tasks`, { params }),
  
  addMemory: (id: string, data: { memory: string }) =>
    api.post(`/ai-employees/${id}/memory`, data),
}

// Knowledge API
export const knowledgeApi = {
  list: (workspaceId: string) =>
    api.get('/knowledge', { params: { workspaceId } }),
  
  get: (id: string) => api.get(`/knowledge/${id}`),
  
  create: (data: { workspaceId: string; name: string; description?: string; type?: string }) =>
    api.post('/knowledge', data),
  
  update: (id: string, data: any) => api.patch(`/knowledge/${id}`, data),
  
  delete: (id: string) => api.delete(`/knowledge/${id}`),
  
  addEntry: (id: string, data: any) =>
    api.post(`/knowledge/${id}/entries`, data),
  
  search: (id: string, query: string) =>
    api.get(`/knowledge/${id}/search`, { params: { q: query } }),
}

// Workflow API
export const workflowApi = {
  list: (params?: { workspaceId: string; status?: string }) =>
    api.get('/workflows', { params }),
  
  get: (id: string) => api.get(`/workflows/${id}`),
  
  create: (data: { workspaceId: string; name: string; description?: string }) =>
    api.post('/workflows', data),
  
  update: (id: string, data: any) => api.patch(`/workflows/${id}`, data),
  
  delete: (id: string) => api.delete(`/workflows/${id}`),
  
  run: (id: string, data?: any) => api.post(`/workflows/${id}/run`, data),
  
  toggle: (id: string) => api.post(`/workflows/${id}/toggle`),
  
  getRuns: (id: string, params?: { status?: string }) =>
    api.get(`/workflows/${id}/runs`, { params }),
  
  addTrigger: (id: string, data: any) =>
    api.post(`/workflows/${id}/triggers`, data),
  
  addNode: (id: string, data: any) =>
    api.post(`/workflows/${id}/nodes`, data),
}
