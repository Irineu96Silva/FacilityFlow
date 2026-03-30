import { describe, expect, it } from "bun:test";
import { getPostLoginDestination } from "./loginRedirect";

describe("getPostLoginDestination", () => {
  it("retorna destino por role e ignora redirect informado", () => {
    const destination = getPostLoginDestination(
      "ADMIN_COMPANY",
      "/app/predial/supervisor",
    );
    expect(destination).toBe("/admin/predial/dashboard");
  });

  it("mantem fallback para role nao mapeada", () => {
    const destination = getPostLoginDestination("UNMAPPED_ROLE", "/qualquer");
    expect(destination).toBe("/app/predial/technician");
  });
});
