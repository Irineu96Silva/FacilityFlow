import type { Role, TicketStatus, TicketPriority, TicketSource, WorkOrderOutcome, MediaKind, IntegrationType } from './types';
export interface BaseEntity {
    id: string;
    createdAt: Date | string;
    updatedAt?: Date | string;
}
export interface SoftDeletable {
    deletedAt?: Date | string | null;
    deletedBy?: string | null;
}
export interface Company extends BaseEntity {
    name: string;
    status: 'ACTIVE' | 'INACTIVE';
}
export interface User extends BaseEntity, SoftDeletable {
    companyId: string;
    name: string;
    email: string;
    role: Role;
    whatsappNumber?: string | null;
    status: 'ACTIVE' | 'INACTIVE';
}
export interface UserWithUnits extends User {
    units?: Unit[];
}
export interface Unit extends BaseEntity, SoftDeletable {
    companyId: string;
    name: string;
    address?: string | null;
    zipCode?: string | null;
    city?: string | null;
    state?: string | null;
    contact?: string | null;
    notes?: string | null;
    tags?: string | null;
    status: 'ACTIVE' | 'INACTIVE';
    trackingEnabled: boolean;
    geofenceEnabled: boolean;
    geofenceLat?: number | null;
    geofenceLng?: number | null;
    geofenceRadiusM?: number | null;
    geofenceMaxAccuracyM?: number | null;
}
export interface Ticket extends BaseEntity, SoftDeletable {
    companyId: string;
    unitId: string;
    source: TicketSource;
    externalSystem?: string | null;
    externalTicketId?: string | null;
    title?: string | null;
    description: string;
    category?: string | null;
    priority: TicketPriority;
    status: TicketStatus;
    requesterName?: string | null;
    requesterContact?: string | null;
    assignedToUserId?: string | null;
    assignedByUserId?: string | null;
    createdByUserId?: string | null;
    assignedAt?: Date | string | null;
    syncStatus?: string | null;
    lastSyncedAt?: Date | string | null;
    descriptionRaw?: string | null;
    descriptionAi?: string | null;
    descriptionAiStatus?: 'DISABLED' | 'PENDING' | 'DONE' | 'FAILED' | null;
    descriptionAiModel?: string | null;
    descriptionAiGeneratedAt?: Date | string | null;
}
export interface TicketWithRelations extends Ticket {
    unit?: Unit;
    assignedTo?: User | null;
    assignedBy?: User | null;
    createdBy?: User | null;
    workOrders?: WorkOrder[];
    workMedia?: WorkMedia[];
    messages?: TicketMessage[];
}
export interface WorkOrder extends BaseEntity {
    companyId: string;
    ticketId: string;
    technicianUserId: string;
    startedAt: Date | string;
    finishedAt?: Date | string | null;
    serviceDescription?: string | null;
    outcome?: WorkOrderOutcome | null;
}
export interface WorkOrderWithRelations extends WorkOrder {
    ticket?: Ticket;
    technician?: User;
    workMedia?: WorkMedia[];
}
export interface WorkMedia extends BaseEntity, SoftDeletable {
    companyId: string;
    ticketId: string;
    workOrderId?: string | null;
    kind: MediaKind;
    r2Key: string;
    mime: string;
    size: number;
    createdBy: string;
}
export interface WorkEvent extends BaseEntity {
    ticketId: string;
    companyId: string;
    unitId: string;
    actorUserId: string;
    type: WorkEventType;
    lat?: number | null;
    lng?: number | null;
    accuracy?: number | null;
    insideGeofence?: boolean | null;
    distanceM?: number | null;
    geofenceRadiusM?: number | null;
    exceptionReason?: string | null;
    payloadJson?: string | null;
    clientUserAgent?: string | null;
    traceId?: string | null;
}
export type WorkEventType = 'WORK_STARTED' | 'WORK_STARTED_OUTSIDE' | 'MEDIA_BEFORE_UPLOADED' | 'DESCRIPTION_ADDED' | 'MEDIA_AFTER_UPLOADED' | 'WORK_FINISHED' | 'WORK_FINISHED_OUTSIDE' | 'SIMPLE_FLOW_FINISHED';
export interface TicketMessage extends BaseEntity {
    companyId: string;
    ticketId: string;
    userId: string;
    message: string;
}
export interface TicketMessageWithUser extends TicketMessage {
    user?: User;
}
export interface Notification extends BaseEntity {
    companyId: string;
    userId: string;
    type: NotificationType;
    title: string;
    message: string;
    entityType?: string | null;
    entityId?: string | null;
    read: boolean;
    readAt?: Date | string | null;
}
export type NotificationType = 'TICKET_CREATED' | 'TICKET_ASSIGNED' | 'TICKET_FINISHED' | 'TICKET_REOPENED' | 'TICKET_CANCELLED';
export interface Integration extends BaseEntity {
    companyId: string;
    type: IntegrationType;
    name: string;
    configJson: string;
    status: 'ACTIVE' | 'INACTIVE';
}
export interface AIUsage extends BaseEntity {
    companyId: string;
    userId?: string | null;
    ticketId?: string | null;
    model: string;
    endpoint: string;
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
    costUSD: number;
    costBRL: number;
    success: boolean;
    errorMessage?: string | null;
    traceId?: string | null;
}
export interface TicketFilters {
    unitId?: string | null;
    status?: TicketStatus | null;
    priority?: TicketPriority | null;
    category?: string | null;
    source?: TicketSource | null;
    assignedToUserId?: string | null;
    createdByUserId?: string | null;
    startDate?: string | null;
    endDate?: string | null;
}
export interface UserFilters {
    role?: Role | null;
    status?: 'ACTIVE' | 'INACTIVE' | null;
    unitId?: string | null;
}
export interface AIUsageFilters {
    companyId: string;
    userId?: string | null;
    ticketId?: string | null;
    startDate?: string | null;
    endDate?: string | null;
    model?: string | null;
}
export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
}
export interface ApiError {
    code: string;
    message: string;
    trace_id?: string;
    details?: Record<string, unknown>;
}
export interface ApiResponse<T> {
    data?: T;
    error?: ApiError;
}
export interface BotOption {
    id: string;
    label: string;
    description?: string;
}
export interface BotTicketDetail {
    id: string;
    title?: string | null;
    description: string;
    status: TicketStatus;
    priority: TicketPriority;
    unitName: string;
    technicianName?: string | null;
    createdAt: string;
}
export interface ReportFilters {
    startDate?: string | null;
    endDate?: string | null;
    unitId?: string | null;
    technicianId?: string | null;
    category?: string | null;
}
export interface ReportSummary {
    total: number;
    byStatus: Record<TicketStatus, number>;
    byPriority: Record<TicketPriority, number>;
    avgResolutionTimeHours: number;
}
export interface TechnicianStats {
    technicianId: string;
    technicianName: string;
    totalTickets: number;
    completedTickets: number;
    inProgressTickets: number;
    pendingTickets: number;
    avgResolutionTimeHours: number;
}
export interface UnitStats {
    unitId: string;
    unitName: string;
    totalTickets: number;
    completedTickets: number;
    inProgressTickets: number;
    pendingTickets: number;
}
//# sourceMappingURL=interfaces.d.ts.map