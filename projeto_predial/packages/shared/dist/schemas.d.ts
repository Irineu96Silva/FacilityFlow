import { z } from 'zod';
export declare const loginSchema: z.ZodEffects<z.ZodObject<{
    email: z.ZodOptional<z.ZodString>;
    identifier: z.ZodOptional<z.ZodString>;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    password: string;
    email?: string | undefined;
    identifier?: string | undefined;
}, {
    password: string;
    email?: string | undefined;
    identifier?: string | undefined;
}>, {
    password: string;
    email?: string | undefined;
    identifier?: string | undefined;
}, {
    password: string;
    email?: string | undefined;
    identifier?: string | undefined;
}>;
export declare const createUnitSchema: z.ZodObject<{
    name: z.ZodString;
    address: z.ZodOptional<z.ZodString>;
    zipCode: z.ZodOptional<z.ZodString>;
    city: z.ZodOptional<z.ZodString>;
    state: z.ZodOptional<z.ZodString>;
    contact: z.ZodOptional<z.ZodString>;
    notes: z.ZodOptional<z.ZodString>;
    tags: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    name: string;
    address?: string | undefined;
    zipCode?: string | undefined;
    city?: string | undefined;
    state?: string | undefined;
    contact?: string | undefined;
    notes?: string | undefined;
    tags?: string[] | undefined;
}, {
    name: string;
    address?: string | undefined;
    zipCode?: string | undefined;
    city?: string | undefined;
    state?: string | undefined;
    contact?: string | undefined;
    notes?: string | undefined;
    tags?: string[] | undefined;
}>;
export declare const updateUnitSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    address: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    zipCode: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    city: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    state: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    contact: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    notes: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    tags: z.ZodOptional<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
}, "strip", z.ZodTypeAny, {
    name?: string | undefined;
    address?: string | undefined;
    zipCode?: string | undefined;
    city?: string | undefined;
    state?: string | undefined;
    contact?: string | undefined;
    notes?: string | undefined;
    tags?: string[] | undefined;
}, {
    name?: string | undefined;
    address?: string | undefined;
    zipCode?: string | undefined;
    city?: string | undefined;
    state?: string | undefined;
    contact?: string | undefined;
    notes?: string | undefined;
    tags?: string[] | undefined;
}>;
export declare const createUserSchema: z.ZodObject<{
    name: z.ZodString;
    email: z.ZodString;
    password: z.ZodString;
    role: z.ZodEnum<["ADMIN_COMPANY", "SUPERVISOR", "TECHNICIAN", "REQUESTER"]>;
    whatsappNumber: z.ZodOptional<z.ZodString>;
    unitIds: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    serviceTypeIds: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
    name: string;
    role: "ADMIN_COMPANY" | "SUPERVISOR" | "TECHNICIAN" | "REQUESTER";
    whatsappNumber?: string | undefined;
    unitIds?: string[] | undefined;
    serviceTypeIds?: string[] | undefined;
}, {
    email: string;
    password: string;
    name: string;
    role: "ADMIN_COMPANY" | "SUPERVISOR" | "TECHNICIAN" | "REQUESTER";
    whatsappNumber?: string | undefined;
    unitIds?: string[] | undefined;
    serviceTypeIds?: string[] | undefined;
}>;
export declare const updateUserSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    email: z.ZodOptional<z.ZodString>;
    role: z.ZodOptional<z.ZodEnum<["ADMIN_COMPANY", "SUPERVISOR", "TECHNICIAN", "REQUESTER"]>>;
    whatsappNumber: z.ZodOptional<z.ZodString>;
    unitIds: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    serviceTypeIds: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    status: z.ZodOptional<z.ZodEnum<["ACTIVE", "INACTIVE"]>>;
}, "strip", z.ZodTypeAny, {
    email?: string | undefined;
    status?: "ACTIVE" | "INACTIVE" | undefined;
    name?: string | undefined;
    role?: "ADMIN_COMPANY" | "SUPERVISOR" | "TECHNICIAN" | "REQUESTER" | undefined;
    whatsappNumber?: string | undefined;
    unitIds?: string[] | undefined;
    serviceTypeIds?: string[] | undefined;
}, {
    email?: string | undefined;
    status?: "ACTIVE" | "INACTIVE" | undefined;
    name?: string | undefined;
    role?: "ADMIN_COMPANY" | "SUPERVISOR" | "TECHNICIAN" | "REQUESTER" | undefined;
    whatsappNumber?: string | undefined;
    unitIds?: string[] | undefined;
    serviceTypeIds?: string[] | undefined;
}>;
export declare const createTicketSchema: z.ZodObject<{
    unitId: z.ZodString;
    title: z.ZodOptional<z.ZodString>;
    description: z.ZodString;
    category: z.ZodOptional<z.ZodString>;
    priority: z.ZodOptional<z.ZodEnum<["LOW", "MED", "HIGH", "URGENT"]>>;
    requesterName: z.ZodOptional<z.ZodString>;
    requesterContact: z.ZodOptional<z.ZodString>;
    serviceTypeId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    unitId: string;
    description: string;
    title?: string | undefined;
    category?: string | undefined;
    priority?: "LOW" | "MED" | "HIGH" | "URGENT" | undefined;
    requesterName?: string | undefined;
    requesterContact?: string | undefined;
    serviceTypeId?: string | undefined;
}, {
    unitId: string;
    description: string;
    title?: string | undefined;
    category?: string | undefined;
    priority?: "LOW" | "MED" | "HIGH" | "URGENT" | undefined;
    requesterName?: string | undefined;
    requesterContact?: string | undefined;
    serviceTypeId?: string | undefined;
}>;
export declare const assignTicketSchema: z.ZodObject<{
    technicianId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    technicianId: string;
}, {
    technicianId: string;
}>;
export declare const reopenTicketSchema: z.ZodObject<{
    reason: z.ZodString;
}, "strip", z.ZodTypeAny, {
    reason: string;
}, {
    reason: string;
}>;
export declare const cancelTicketSchema: z.ZodObject<{
    reason: z.ZodString;
}, "strip", z.ZodTypeAny, {
    reason: string;
}, {
    reason: string;
}>;
export declare const finishWorkOrderSchema: z.ZodObject<{
    serviceDescription: z.ZodString;
    outcome: z.ZodOptional<z.ZodEnum<["OK", "NEEDS_FOLLOWUP"]>>;
}, "strip", z.ZodTypeAny, {
    serviceDescription: string;
    outcome?: "OK" | "NEEDS_FOLLOWUP" | undefined;
}, {
    serviceDescription: string;
    outcome?: "OK" | "NEEDS_FOLLOWUP" | undefined;
}>;
export declare const confirmMediaSchema: z.ZodObject<{
    r2Key: z.ZodString;
    ticketId: z.ZodString;
    workOrderId: z.ZodOptional<z.ZodString>;
    kind: z.ZodEnum<["BEFORE", "AFTER", "OTHER"]>;
    mime: z.ZodString;
    size: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    r2Key: string;
    ticketId: string;
    kind: "BEFORE" | "AFTER" | "OTHER";
    mime: string;
    size: number;
    workOrderId?: string | undefined;
}, {
    r2Key: string;
    ticketId: string;
    kind: "BEFORE" | "AFTER" | "OTHER";
    mime: string;
    size: number;
    workOrderId?: string | undefined;
}>;
export declare const generateReportSchema: z.ZodObject<{
    startDate: z.ZodString;
    endDate: z.ZodString;
    unitId: z.ZodOptional<z.ZodString>;
    technicianId: z.ZodOptional<z.ZodString>;
    category: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    startDate: string;
    endDate: string;
    unitId?: string | undefined;
    category?: string | undefined;
    technicianId?: string | undefined;
}, {
    startDate: string;
    endDate: string;
    unitId?: string | undefined;
    category?: string | undefined;
    technicianId?: string | undefined;
}>;
export declare const createIntegrationSchema: z.ZodObject<{
    type: z.ZodEnum<["CSV", "API", "WEBHOOK"]>;
    name: z.ZodString;
    config: z.ZodRecord<z.ZodString, z.ZodAny>;
}, "strip", z.ZodTypeAny, {
    type: "CSV" | "API" | "WEBHOOK";
    name: string;
    config: Record<string, any>;
}, {
    type: "CSV" | "API" | "WEBHOOK";
    name: string;
    config: Record<string, any>;
}>;
export declare const csvImportSchema: z.ZodObject<{
    file: z.ZodString;
    mapping: z.ZodObject<{
        externalTicketId: z.ZodString;
        description: z.ZodString;
        unitId: z.ZodOptional<z.ZodString>;
        unitName: z.ZodOptional<z.ZodString>;
        title: z.ZodOptional<z.ZodString>;
        category: z.ZodOptional<z.ZodString>;
        priority: z.ZodOptional<z.ZodString>;
        requesterName: z.ZodOptional<z.ZodString>;
        requesterContact: z.ZodOptional<z.ZodString>;
        externalSystem: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        description: string;
        externalTicketId: string;
        unitId?: string | undefined;
        title?: string | undefined;
        category?: string | undefined;
        priority?: string | undefined;
        requesterName?: string | undefined;
        requesterContact?: string | undefined;
        unitName?: string | undefined;
        externalSystem?: string | undefined;
    }, {
        description: string;
        externalTicketId: string;
        unitId?: string | undefined;
        title?: string | undefined;
        category?: string | undefined;
        priority?: string | undefined;
        requesterName?: string | undefined;
        requesterContact?: string | undefined;
        unitName?: string | undefined;
        externalSystem?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    file: string;
    mapping: {
        description: string;
        externalTicketId: string;
        unitId?: string | undefined;
        title?: string | undefined;
        category?: string | undefined;
        priority?: string | undefined;
        requesterName?: string | undefined;
        requesterContact?: string | undefined;
        unitName?: string | undefined;
        externalSystem?: string | undefined;
    };
}, {
    file: string;
    mapping: {
        description: string;
        externalTicketId: string;
        unitId?: string | undefined;
        title?: string | undefined;
        category?: string | undefined;
        priority?: string | undefined;
        requesterName?: string | undefined;
        requesterContact?: string | undefined;
        unitName?: string | undefined;
        externalSystem?: string | undefined;
    };
}>;
//# sourceMappingURL=schemas.d.ts.map