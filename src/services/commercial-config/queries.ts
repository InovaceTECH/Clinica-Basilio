import "server-only";
import { and, eq } from "drizzle-orm";
import type { TenantContext } from "@/auth/tenant-context";
import { assertPermission } from "@/auth/authorization";
import { db } from "@/db";
import { commercialRules, objectionPlaybooks } from "@/db/schema";
export async function getAiCommercialContext(tenant: TenantContext, category: Parameters<typeof eq>[1]) { const [rules, playbook] = await Promise.all([db.select({ content: commercialRules.content }).from(commercialRules).where(and(eq(commercialRules.clinicId, tenant.clinicId),eq(commercialRules.active,true))), db.select({ title: objectionPlaybooks.title, objective: objectionPlaybooks.objective, guidelines: objectionPlaybooks.guidelines, suggestedQuestions: objectionPlaybooks.suggestedQuestions }).from(objectionPlaybooks).where(and(eq(objectionPlaybooks.clinicId,tenant.clinicId),eq(objectionPlaybooks.category,category as never),eq(objectionPlaybooks.active,true))).limit(1)]); return [...rules.map(rule=>rule.content), ...playbook.map(item=>`${item.title}: ${item.objective}. ${item.guidelines}. ${item.suggestedQuestions??""}`)]; }
export async function getCommercialRules(tenant: TenantContext) { assertPermission(tenant, "commercialRules.manage"); return db.select().from(commercialRules).where(eq(commercialRules.clinicId, tenant.clinicId)); }
export async function getPlaybooks(tenant: TenantContext) { assertPermission(tenant, "playbooks.read"); return db.select().from(objectionPlaybooks).where(eq(objectionPlaybooks.clinicId, tenant.clinicId)); }
