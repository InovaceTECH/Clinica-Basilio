import { z } from "zod";
import { AuthorizationError } from "@/auth/authorization";
import { requirePermission } from "@/auth/current-authorization";
import { db } from "@/db";
import { commercialRules, objectionPlaybooks } from "@/db/schema";
import { commercialConfigSchema as schema } from "@/schemas/commercial-config";
export async function POST(request:Request){try{const data=schema.parse(await request.json());const tenant=await requirePermission(data.type==="rule"?"commercialRules.manage":"playbooks.manage");if(data.type==="rule"){const [item]=await db.insert(commercialRules).values({clinicId:tenant.clinicId,title:data.title,content:data.content}).returning();return Response.json(item,{status:201});}const [item]=await db.insert(objectionPlaybooks).values({clinicId:tenant.clinicId,...data,suggestedQuestions:data.suggestedQuestions||null}).returning();return Response.json(item,{status:201});}catch(error){if(error instanceof AuthorizationError)return Response.json({message:"Apenas gestores podem alterar estas configurações."},{status:403});if(error instanceof z.ZodError)return Response.json({message:"Revise os campos informados."},{status:400});return Response.json({message:"Não foi possível salvar."},{status:500});}}
