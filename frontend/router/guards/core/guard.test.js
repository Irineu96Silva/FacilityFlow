import { beforeAll, describe, expect, it, mock } from "bun:test";

function createRoute(authType, fullPath, query = {}) {
  return {
    fullPath,
    meta: { authType },
    query,
  };
}

describe("createAuthGuard", () => {
  let mockedSession = { data: null, error: null };

  beforeAll(() => {
    globalThis.window = {
      environment: {
        baseUrl: "http://localhost:3000",
        socialLogin: {
          enabledProviders: [],
          googleClientId: "",
        },
      },
    };

    mock.module("@frontend/lib/core/auth", () => ({
      authClient: {
        getSession: async () => mockedSession,
      },
    }));
  });

  async function loadGuard() {
    const { createAuthGuard } = await import("./guard");
    return createAuthGuard;
  }

  it("permite acesso em /login quando sessao ausente", async () => {
    mockedSession = { data: null, error: null };
    const createAuthGuard = await loadGuard();
    const guard = createAuthGuard();
    const nextCalls = [];
    const next = (value) => nextCalls.push(value);

    await guard(createRoute("unauthenticated", "/login"), createRoute("public", "/"), next);

    expect(nextCalls).toEqual([undefined]);
  });

  it("redireciona autenticado em /login para dashboard por permissao", async () => {
    mockedSession = {
      data: {
        user: {
          predialRole: "ADMIN_COMPANY",
        },
      },
      error: null,
    };
    const createAuthGuard = await loadGuard();
    const guard = createAuthGuard();
    const nextCalls = [];
    const next = (value) => nextCalls.push(value);

    await guard(
      createRoute("unauthenticated", "/login", {
        redirect: "/alguma-rota",
      }),
      createRoute("public", "/"),
      next,
    );

    expect(nextCalls).toEqual(["/admin/predial/dashboard"]);
  });

  it("mantem branch authenticated exigindo sessao e redirect para login", async () => {
    mockedSession = { data: null, error: null };
    const createAuthGuard = await loadGuard();
    const guard = createAuthGuard();
    const nextCalls = [];
    const next = (value) => nextCalls.push(value);

    await guard(
      createRoute("authenticated", "/app/predial/supervisor"),
      createRoute("public", "/"),
      next,
    );

    expect(nextCalls).toEqual([
      {
        name: "login",
        query: { redirect: "/app/predial/supervisor" },
      },
    ]);
  });
});
