import { db } from "../src/db";
import { clinics } from "../src/db/schema";

async function checkDatabase() {
  const result = await db.select({ id: clinics.id }).from(clinics).limit(1);

  if (!Array.isArray(result)) {
    throw new Error("A consulta de verificação do banco falhou.");
  }

  console.log("Conexão com o banco validada.");
}

void checkDatabase();
