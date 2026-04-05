import { z } from 'zod';
// Auth
// Schema compatível com formato antigo (email) e novo (identifier)
// Aceita tanto { email, password } quanto { identifier, password }
export const loginSchema = z.object({
    email: z.string().email().optional(),
    identifier: z.string().min(1).optional(),
    password: z.string().min(6),
}).refine((data) => {
    // Garantir que pelo menos um dos campos (email ou identifier) está presente
    return !!(data.email || data.identifier);
}, {
    message: 'Email ou identificador é obrigatório',
    path: ['email'], // Mostrar erro no campo email
});
// Units
export const createUnitSchema = z.object({
    name: z.string().min(1),
    address: z.string().optional(),
    zipCode: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    contact: z.string().optional(),
    notes: z.string().optional(),
    tags: z.array(z.string()).optional(),
});
export const updateUnitSchema = createUnitSchema.partial();
// Users
export const createUserSchema = z.object({
    name: z.string().min(1),
    email: z.string().email(),
    password: z.string().min(6),
    role: z.enum(['ADMIN_COMPANY', 'SUPERVISOR', 'TECHNICIAN', 'REQUESTER']),
    whatsappNumber: z.string().optional(),
    unitIds: z.array(z.string()).optional(),
    serviceTypeIds: z.array(z.string()).optional(),
});
export const updateUserSchema = z.object({
    name: z.string().min(1).optional(),
    email: z.string().email().optional(),
    role: z.enum(['ADMIN_COMPANY', 'SUPERVISOR', 'TECHNICIAN', 'REQUESTER']).optional(),
    whatsappNumber: z.string().optional(),
    unitIds: z.array(z.string()).optional(),
    serviceTypeIds: z.array(z.string()).optional(),
    status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
});
// Tickets
export const createTicketSchema = z.object({
    unitId: z.string(),
    title: z.string().optional(),
    description: z.string().min(1),
    category: z.string().optional(),
    priority: z.enum(['LOW', 'MED', 'HIGH', 'URGENT']).optional(),
    requesterName: z.string().optional(),
    requesterContact: z.string().optional(),
    serviceTypeId: z.string().optional(),
});
export const assignTicketSchema = z.object({
    technicianId: z.string(),
});
export const reopenTicketSchema = z.object({
    reason: z.string().min(10),
});
export const cancelTicketSchema = z.object({
    reason: z.string().min(10),
});
// Work Orders
export const finishWorkOrderSchema = z.object({
    serviceDescription: z.string().min(20),
    outcome: z.enum(['OK', 'NEEDS_FOLLOWUP']).optional(),
});
// Media
export const confirmMediaSchema = z.object({
    r2Key: z.string(),
    ticketId: z.string(),
    workOrderId: z.string().optional(),
    kind: z.enum(['BEFORE', 'AFTER', 'OTHER']),
    mime: z.string(),
    size: z.number(),
});
// Reports
export const generateReportSchema = z.object({
    startDate: z.string(),
    endDate: z.string(),
    unitId: z.string().optional(),
    technicianId: z.string().optional(),
    category: z.string().optional(),
});
// Integrations
export const createIntegrationSchema = z.object({
    type: z.enum(['CSV', 'API', 'WEBHOOK']),
    name: z.string().min(1),
    config: z.record(z.any()),
});
export const csvImportSchema = z.object({
    file: z.string(), // Conteúdo CSV como string
    mapping: z.object({
        externalTicketId: z.string(), // Nome da coluna no CSV
        description: z.string(), // Nome da coluna no CSV
        unitId: z.string().optional(), // Nome da coluna (ID da unidade)
        unitName: z.string().optional(), // Nome da coluna (nome da unidade)
        title: z.string().optional(),
        category: z.string().optional(),
        priority: z.string().optional(),
        requesterName: z.string().optional(),
        requesterContact: z.string().optional(),
        externalSystem: z.string().optional(),
    }),
});
//# sourceMappingURL=schemas.js.map