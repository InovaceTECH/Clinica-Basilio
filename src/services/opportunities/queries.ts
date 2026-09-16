import "server-only";

import { and, count, desc, eq, ilike, or, sql } from "drizzle-orm";

import { assertPermission } from "@/auth/authorization";
import type { TenantContext } from "@/auth/tenant-context";
import { db } from "@/db";
import { opportunities, patients } from "@/db/schema";
import type { OpportunityListFilters } from "@/schemas/opportunity-list";

const opportunitySelection = {
  id: opportunities.id,
  patientId: opportunities.patientId,
  treatment: opportunities.treatment,
  budgetValue: opportunities.budgetValue,
  finalBudgetValue: opportunities.finalBudgetValue,
  budgetDate: opportunities.budgetDate,
  professionalName: opportunities.professionalName,
  leadSource: opportunities.leadSource,
  rawObjection: opportunities.rawObjection,
  notes: opportunities.notes,
  objectionCategory: opportunities.objectionCategory,
  priorityScore: opportunities.priorityScore,
  priority: opportunities.priority,
  status: opportunities.status,
  lastContactAt: opportunities.lastContactAt,
  nextFollowUpAt: opportunities.nextFollowUpAt,
  responsibleUserId: opportunities.responsibleUserId,
  createdAt: opportunities.createdAt,
  updatedAt: opportunities.updatedAt,
  patientName: patients.name,
  patientPhone: patients.phone,
  patientExternalReference: patients.externalReference,
};

export async function getTenantOpportunityById(
  tenant: TenantContext,
  opportunityId: string,
) {
  assertPermission(tenant, "opportunities.read");

  const [opportunity] = await db
    .select(opportunitySelection)
    .from(opportunities)
    .innerJoin(patients, eq(opportunities.patientId, patients.id))
    .where(
      and(
        eq(opportunities.id, opportunityId),
        eq(opportunities.clinicId, tenant.clinicId),
      ),
    )
    .limit(1);

  return opportunity ?? null;
}

const opportunityListPageSize = 20;

export async function getTenantOpportunities(
  tenant: TenantContext,
  filters: OpportunityListFilters,
) {
  assertPermission(tenant, "opportunities.read");

  const conditions = [eq(opportunities.clinicId, tenant.clinicId)];

  if (filters.query) {
    conditions.push(
      or(
        ilike(patients.name, `%${filters.query}%`),
        ilike(opportunities.treatment, `%${filters.query}%`),
      )!,
    );
  }

  if (filters.status) {
    conditions.push(eq(opportunities.status, filters.status));
  }

  if (filters.priority) {
    conditions.push(eq(opportunities.priority, filters.priority));
  }

  if (filters.objection) {
    conditions.push(eq(opportunities.objectionCategory, filters.objection));
  }

  const whereClause = and(...conditions);
  const [totals] = await db
    .select({ total: count() })
    .from(opportunities)
    .innerJoin(patients, eq(opportunities.patientId, patients.id))
    .where(whereClause);
  const total = totals?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / opportunityListPageSize));
  const page = Math.min(filters.page, totalPages);
  const offset = (page - 1) * opportunityListPageSize;
  const items = await db
    .select({
      id: opportunities.id,
      patientName: patients.name,
      treatment: opportunities.treatment,
      budgetValue: opportunities.budgetValue,
      rawObjection: opportunities.rawObjection,
      objectionCategory: opportunities.objectionCategory,
      priority: opportunities.priority,
      status: opportunities.status,
      lastContactAt: opportunities.lastContactAt,
      nextFollowUpAt: opportunities.nextFollowUpAt,
    })
    .from(opportunities)
    .innerJoin(patients, eq(opportunities.patientId, patients.id))
    .where(whereClause)
    .orderBy(sql`${opportunities.nextFollowUpAt} asc nulls last`, desc(opportunities.createdAt))
    .limit(opportunityListPageSize)
    .offset(offset);

  return {
    items,
    page,
    pageSize: opportunityListPageSize,
    total,
    totalPages,
  };
}
