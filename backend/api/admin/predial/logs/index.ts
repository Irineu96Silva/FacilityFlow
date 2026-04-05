import { Hono } from "hono";
import type { AppContext } from "@backend/context";
import { dbClient } from "@packages/db";
import {
  auditLogs,
  errorLogs,
  aiLogs,
  aiUsage,
  users,
  tickets,
} from "@packages/schema";
import { eq, and, gte, lte, desc, count, sql } from "drizzle-orm";
import { requireAdminCompany } from "@backend/lib/predial/middleware/predialGuard";

const app = new Hono<AppContext>();

// ─── Helpers ─────────────────────────────────────────────────────────────────

function buildBom(csv: string) {
  return "\uFEFF" + csv;
}

function escape(v: string | null | undefined) {
  return `"${String(v ?? "").replace(/"/g, '""')}"`;
}

// ─── Error Logs ───────────────────────────────────────────────────────────────

app.get("/errors", async (c) => {
  const auth = requireAdminCompany(c);

  const startDate = c.req.query("startDate");
  const endDate = c.req.query("endDate");
  const statusCode = c.req.query("statusCode");
  const route = c.req.query("route");
  const traceId = c.req.query("traceId");

  const conditions: Parameters<typeof and>[0][] = [
    eq(errorLogs.companyId, auth.companyId),
  ];

  if (startDate) conditions.push(gte(errorLogs.createdAt, new Date(startDate)));
  if (endDate)
    conditions.push(lte(errorLogs.createdAt, new Date(endDate + "T23:59:59")));
  if (statusCode) conditions.push(eq(errorLogs.statusCode, parseInt(statusCode)));
  if (route) conditions.push(sql`${errorLogs.route} ILIKE ${"%" + route + "%"}`);
  if (traceId) conditions.push(sql`${errorLogs.traceId} ILIKE ${"%" + traceId + "%"}`);

  const logs = await dbClient
    .select()
    .from(errorLogs)
    .where(and(...conditions))
    .orderBy(desc(errorLogs.createdAt))
    .limit(500);

  return c.json(logs);
});

app.get("/errors/csv", async (c) => {
  const auth = requireAdminCompany(c);

  const startDate = c.req.query("startDate");
  const endDate = c.req.query("endDate");

  const conditions: Parameters<typeof and>[0][] = [
    eq(errorLogs.companyId, auth.companyId),
  ];
  if (startDate) conditions.push(gte(errorLogs.createdAt, new Date(startDate)));
  if (endDate)
    conditions.push(lte(errorLogs.createdAt, new Date(endDate + "T23:59:59")));

  const logs = await dbClient
    .select()
    .from(errorLogs)
    .where(and(...conditions))
    .orderBy(desc(errorLogs.createdAt))
    .limit(5000);

  const headers = [
    "ID",
    "Trace ID",
    "Rota",
    "Método",
    "Status",
    "Código do Erro",
    "Mensagem",
    "Data/Hora",
  ];

  const rows = logs.map((r) => [
    escape(r.id),
    escape(r.traceId),
    escape(r.route),
    escape(r.method),
    escape(String(r.statusCode)),
    escape(r.errorCode),
    escape(r.message),
    escape(new Date(r.createdAt).toLocaleString("pt-BR")),
  ]);

  const csv = buildBom([headers.join(","), ...rows.map((r) => r.join(","))].join("\n"));

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="error-logs-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
});

// ─── Audit Logs ───────────────────────────────────────────────────────────────

app.get("/audit", async (c) => {
  const auth = requireAdminCompany(c);

  const actorUserId = c.req.query("actorUserId");
  const action = c.req.query("action");
  const entityType = c.req.query("entityType");
  const entityId = c.req.query("entityId");
  const startDate = c.req.query("startDate");
  const endDate = c.req.query("endDate");

  const conditions: Parameters<typeof and>[0][] = [
    eq(auditLogs.companyId, auth.companyId),
  ];

  if (actorUserId) conditions.push(eq(auditLogs.actorUserId, actorUserId));
  if (action) conditions.push(eq(auditLogs.action, action));
  if (entityType) conditions.push(eq(auditLogs.entityType, entityType));
  if (entityId) conditions.push(sql`${auditLogs.entityId} ILIKE ${"%" + entityId + "%"}`);
  if (startDate) conditions.push(gte(auditLogs.createdAt, new Date(startDate)));
  if (endDate)
    conditions.push(lte(auditLogs.createdAt, new Date(endDate + "T23:59:59")));

  const logs = await dbClient
    .select({
      log: auditLogs,
      actor: {
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.predialRole,
      },
    })
    .from(auditLogs)
    .leftJoin(users, eq(auditLogs.actorUserId, users.id))
    .where(and(...conditions))
    .orderBy(desc(auditLogs.createdAt))
    .limit(500);

  return c.json(
    logs.map((row) => ({
      ...row.log,
      actor: row.actor?.id ? row.actor : null,
    })),
  );
});

app.get("/audit/users", async (c) => {
  const auth = requireAdminCompany(c);

  const userList = await dbClient
    .select({ id: users.id, name: users.name, email: users.email })
    .from(users)
    .where(eq(users.companyId, auth.companyId))
    .orderBy(users.name);

  return c.json(userList);
});

app.get("/audit/csv", async (c) => {
  const auth = requireAdminCompany(c);

  const startDate = c.req.query("startDate");
  const endDate = c.req.query("endDate");
  const action = c.req.query("action");
  const entityType = c.req.query("entityType");

  const conditions: Parameters<typeof and>[0][] = [
    eq(auditLogs.companyId, auth.companyId),
  ];
  if (startDate) conditions.push(gte(auditLogs.createdAt, new Date(startDate)));
  if (endDate)
    conditions.push(lte(auditLogs.createdAt, new Date(endDate + "T23:59:59")));
  if (action) conditions.push(eq(auditLogs.action, action));
  if (entityType) conditions.push(eq(auditLogs.entityType, entityType));

  const logs = await dbClient
    .select({
      log: auditLogs,
      actorName: users.name,
      actorEmail: users.email,
    })
    .from(auditLogs)
    .leftJoin(users, eq(auditLogs.actorUserId, users.id))
    .where(and(...conditions))
    .orderBy(desc(auditLogs.createdAt))
    .limit(5000);

  const headers = [
    "ID",
    "Data/Hora",
    "Ação",
    "Tipo de Entidade",
    "ID da Entidade",
    "Ator",
    "Email do Ator",
    "IP",
  ];

  const rows = logs.map((r) => [
    escape(r.log.id),
    escape(new Date(r.log.createdAt).toLocaleString("pt-BR")),
    escape(r.log.action),
    escape(r.log.entityType),
    escape(r.log.entityId),
    escape(r.actorName),
    escape(r.actorEmail),
    escape(r.log.ip),
  ]);

  const csv = buildBom([headers.join(","), ...rows.map((r) => r.join(","))].join("\n"));

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="audit-logs-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
});

// ─── AI Logs (internal) ───────────────────────────────────────────────────────

app.get("/ai", async (c) => {
  const auth = requireAdminCompany(c);

  const action = c.req.query("action");
  const startDate = c.req.query("startDate");
  const endDate = c.req.query("endDate");

  const conditions: Parameters<typeof and>[0][] = [
    eq(aiLogs.companyId, auth.companyId),
  ];

  if (action) conditions.push(eq(aiLogs.action, action));
  if (startDate) conditions.push(gte(aiLogs.createdAt, new Date(startDate)));
  if (endDate)
    conditions.push(lte(aiLogs.createdAt, new Date(endDate + "T23:59:59")));

  const logs = await dbClient
    .select()
    .from(aiLogs)
    .where(and(...conditions))
    .orderBy(desc(aiLogs.createdAt))
    .limit(200);

  return c.json(logs);
});

// ─── AI Usage (costs) ─────────────────────────────────────────────────────────

app.get("/ai-usage", async (c) => {
  const auth = requireAdminCompany(c);

  const model = c.req.query("model");
  const endpoint = c.req.query("endpoint");
  const startDate = c.req.query("startDate");
  const endDate = c.req.query("endDate");

  const conditions: Parameters<typeof and>[0][] = [
    eq(aiUsage.companyId, auth.companyId),
  ];

  if (model) conditions.push(eq(aiUsage.model, model));
  if (endpoint) conditions.push(eq(aiUsage.endpoint, endpoint));
  if (startDate) conditions.push(gte(aiUsage.createdAt, new Date(startDate)));
  if (endDate)
    conditions.push(lte(aiUsage.createdAt, new Date(endDate + "T23:59:59")));

  const usages = await dbClient
    .select({
      usage: aiUsage,
      userName: users.name,
      ticketDesc: tickets.description,
    })
    .from(aiUsage)
    .leftJoin(users, eq(aiUsage.userId, users.id))
    .leftJoin(tickets, eq(aiUsage.ticketId, tickets.id))
    .where(and(...conditions))
    .orderBy(desc(aiUsage.createdAt))
    .limit(300);

  return c.json(
    usages.map((row) => ({
      ...row.usage,
      costUSD: Number(row.usage.costUSD) / 1_000_000,
      costBRL: Number(row.usage.costBRL) / 1_000_000,
      user: row.userName ? { name: row.userName } : null,
      ticket: row.usage.ticketId
        ? { id: row.usage.ticketId, description: row.ticketDesc }
        : null,
    })),
  );
});

app.get("/ai-usage/stats", async (c) => {
  const auth = requireAdminCompany(c);

  const model = c.req.query("model");
  const endpoint = c.req.query("endpoint");
  const startDate = c.req.query("startDate");
  const endDate = c.req.query("endDate");

  const conditions: Parameters<typeof and>[0][] = [
    eq(aiUsage.companyId, auth.companyId),
  ];

  if (model) conditions.push(eq(aiUsage.model, model));
  if (endpoint) conditions.push(eq(aiUsage.endpoint, endpoint));
  if (startDate) conditions.push(gte(aiUsage.createdAt, new Date(startDate)));
  if (endDate)
    conditions.push(lte(aiUsage.createdAt, new Date(endDate + "T23:59:59")));

  const [totals, byModel, byEndpoint] = await Promise.all([
    dbClient
      .select({
        totalRequests: count(),
        totalPromptTokens: sql<number>`COALESCE(SUM(${aiUsage.promptTokens}), 0)::int`,
        totalCompletionTokens: sql<number>`COALESCE(SUM(${aiUsage.completionTokens}), 0)::int`,
        totalTokens: sql<number>`COALESCE(SUM(${aiUsage.totalTokens}), 0)::int`,
        totalCostUSD: sql<number>`COALESCE(SUM(${aiUsage.costUSD}), 0)::bigint`,
        totalCostBRL: sql<number>`COALESCE(SUM(${aiUsage.costBRL}), 0)::bigint`,
        successCount: sql<number>`COUNT(*) FILTER (WHERE ${aiUsage.success} = true)::int`,
        failedCount: sql<number>`COUNT(*) FILTER (WHERE ${aiUsage.success} = false)::int`,
      })
      .from(aiUsage)
      .where(and(...conditions)),

    dbClient
      .select({
        model: aiUsage.model,
        cnt: count(),
        tokens: sql<number>`COALESCE(SUM(${aiUsage.totalTokens}), 0)::int`,
        costUSD: sql<number>`COALESCE(SUM(${aiUsage.costUSD}), 0)::bigint`,
      })
      .from(aiUsage)
      .where(and(...conditions))
      .groupBy(aiUsage.model),

    dbClient
      .select({
        endpoint: aiUsage.endpoint,
        cnt: count(),
        tokens: sql<number>`COALESCE(SUM(${aiUsage.totalTokens}), 0)::int`,
        costUSD: sql<number>`COALESCE(SUM(${aiUsage.costUSD}), 0)::bigint`,
      })
      .from(aiUsage)
      .where(and(...conditions))
      .groupBy(aiUsage.endpoint),
  ]);

  const t = totals[0];
  const MICRO = 1_000_000;

  const byModelMap: Record<string, { count: number; tokens: number; costUSD: number }> = {};
  byModel.forEach((r) => {
    byModelMap[r.model] = {
      count: Number(r.cnt),
      tokens: Number(r.tokens),
      costUSD: Number(r.costUSD) / MICRO,
    };
  });

  const byEndpointMap: Record<string, { count: number; tokens: number; costUSD: number }> = {};
  byEndpoint.forEach((r) => {
    byEndpointMap[r.endpoint] = {
      count: Number(r.cnt),
      tokens: Number(r.tokens),
      costUSD: Number(r.costUSD) / MICRO,
    };
  });

  return c.json({
    totalRequests: Number(t?.totalRequests ?? 0),
    successfulRequests: Number(t?.successCount ?? 0),
    failedRequests: Number(t?.failedCount ?? 0),
    totalPromptTokens: Number(t?.totalPromptTokens ?? 0),
    totalCompletionTokens: Number(t?.totalCompletionTokens ?? 0),
    totalTokens: Number(t?.totalTokens ?? 0),
    totalCostUSD: Number(t?.totalCostUSD ?? 0) / MICRO,
    totalCostBRL: Number(t?.totalCostBRL ?? 0) / MICRO,
    byModel: byModelMap,
    byEndpoint: byEndpointMap,
  });
});

export default app;
