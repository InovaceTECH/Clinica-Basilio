import { z } from "zod";

export const appRoleSchema = z.enum(["MANAGER", "RECEPTIONIST"]);

export type AppRole = z.infer<typeof appRoleSchema>;

export const roleLabels: Record<AppRole, string> = {
  MANAGER: "Gestor",
  RECEPTIONIST: "Recepção",
};
