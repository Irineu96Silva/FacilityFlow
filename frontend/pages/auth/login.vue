<template>
  <q-layout view="lHh Lpr fff">
    <q-page-container>
      <q-page class="login-page">
        <!-- Background claro -->
        <div class="login-background">
          <div class="pattern-overlay" />
        </div>

        <!-- Login Container -->
        <div class="login-container shadow-24">
          <!-- Left Side - Branding (Desktop Only) -->
          <div class="login-branding gt-sm">
            <div class="branding-content">
              <div class="logo-wrapper">
                <img
                  src="/logos/logo_oficial.png"
                  alt="FacilityFlow"
                  class="logo-image-desktop"
                />
              </div>
              <h1 class="branding-title">
                Facility<span class="text-weight-light">Flow</span>
              </h1>
              <p class="branding-subtitle">
                Assuma o controle total da sua operação. O fim do achismo começa
                aqui.
              </p>

              <div class="features-list">
                <div class="feature-item">
                  <q-icon
                    name="mdi-check-circle"
                    size="20px"
                    class="text-white opacity-80"
                  />
                  <span>Abertura de chamados via WhatsApp</span>
                </div>
                <div class="feature-item">
                  <q-icon
                    name="mdi-check-circle"
                    size="20px"
                    class="text-white opacity-80"
                  />
                  <span>Check-in com GPS travado</span>
                </div>
                <div class="feature-item">
                  <q-icon
                    name="mdi-check-circle"
                    size="20px"
                    class="text-white opacity-80"
                  />
                  <span>SLA e Dashboards em tempo real</span>
                </div>
                <div class="feature-item">
                  <q-icon
                    name="mdi-check-circle"
                    size="20px"
                    class="text-white opacity-80"
                  />
                  <span>Histórico imutável de manutenção</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Side - Login Form -->
          <div class="login-form-section">
            <div class="login-card">
              <!-- Mobile Logo -->
              <div class="mobile-logo lt-md">
                <img
                  src="/logos/logo_oficial.png"
                  alt="FacilityFlow"
                  class="logo-image-mobile"
                />
                <h2 class="mobile-title text-dark">
                  Facility<span class="text-primary text-weight-regular"
                    >Flow</span
                  >
                </h2>
              </div>

              <!-- Welcome Text -->
              <div class="welcome-text">
                <h2 class="welcome-title text-dark">Bem-vindo de volta</h2>
                <p class="welcome-subtitle text-grey-7">
                  Faça login para acessar o painel de comando
                </p>
              </div>

              <!-- Login Form -->
              <q-form
                ref="form"
                class="login-form"
                @submit.prevent="handleLogin"
              >
                <div class="form-group">
                  <label class="form-label text-grey-8"
                    >E-mail Corporativo</label
                  >
                  <q-input
                    v-model="email"
                    outlined
                    placeholder="voce@empresa.com.br"
                    lazy-rules
                    :rules="[
                      (val) =>
                        (val && val.length > 0) ||
                        'Por favor digite seu e-mail',
                    ]"
                    class="form-input"
                    bg-color="grey-1"
                  >
                    <template v-slot:prepend>
                      <q-icon name="mdi-account-outline" color="grey-6" />
                    </template>
                  </q-input>
                </div>

                <div class="form-group">
                  <label class="form-label text-grey-8">Senha de Acesso</label>
                  <q-input
                    v-model="password"
                    :type="showPassword ? 'text' : 'password'"
                    outlined
                    placeholder="••••••••"
                    lazy-rules
                    :rules="[
                      (val) =>
                        (val && val.length > 0) || 'Por favor digite sua senha',
                    ]"
                    class="form-input"
                    bg-color="grey-1"
                  >
                    <template v-slot:prepend>
                      <q-icon name="mdi-lock-outline" color="grey-6" />
                    </template>
                    <template v-slot:append>
                      <q-icon
                        :name="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                        class="cursor-pointer"
                        color="grey-6"
                        @click="showPassword = !showPassword"
                      />
                    </template>
                  </q-input>
                </div>

                <!-- Forgot Password Link -->
                <div class="forgot-password-row flex justify-end">
                  <router-link
                    :to="{ name: 'forgot-password' }"
                    class="forgot-link text-primary text-weight-bold"
                  >
                    Esqueceu a senha?
                  </router-link>
                </div>

                <!-- Submit Button -->
                <q-btn
                  type="submit"
                  color="primary"
                  class="login-btn full-width q-mt-md"
                  :loading="loading"
                  unelevated
                  no-caps
                  size="lg"
                >
                  <span class="text-weight-bold tracking-wide"
                    >Acessar Sistema</span
                  >
                  <q-icon name="mdi-arrow-right" class="q-ml-sm" />
                </q-btn>
              </q-form>

              <!-- Footer -->
              <div class="login-footer q-mt-xl text-center">
                <p class="text-caption text-grey-6 q-mb-xs">
                  Ambiente Seguro SSL • Versão 3.1.0
                </p>
                <router-link
                  to="/terms"
                  class="text-caption text-grey-5 hover-primary"
                  style="text-decoration: none"
                >
                  Termos de Uso e LGPD
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@frontend/stores/predial/auth";
import { useQuasar } from "quasar";
import { getPostLoginDestination } from "./loginRedirect";

const router = useRouter();
const authStore = useAuthStore();
const $q = useQuasar();

const email = ref("");
const password = ref("");
const loading = ref(false);
const showPassword = ref(false);

async function handleLogin() {
  if (!email.value || !password.value) {
    $q.notify({
      color: "negative",
      textColor: "white",
      icon: "mdi-alert",
      message: "Por favor, preencha todos os campos.",
      position: "top",
    });
    return;
  }

  loading.value = true;

  try {
    const result = await authStore.login(email.value, password.value);

    if (result.error) {
      throw result.error;
    }

    $q.notify({
      color: "positive",
      textColor: "white",
      icon: "mdi-check-circle",
      message: "Bem-vindo ao FacilityFlow!",
      position: "top",
    });

    const role = result.user?.predialRole || authStore.role;
    const destination = getPostLoginDestination(role, null);
    router.push(destination);
  } catch (err: any) {
    const errorMessage = err?.message || "Erro ao fazer login";
    $q.notify({
      color: "negative",
      textColor: "white",
      icon: "mdi-alert-circle",
      message: errorMessage,
      position: "top",
    });
    console.error("Erro no login:", err);
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped lang="scss">
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  position: relative;
  overflow: hidden;
  background-color: #f5f7fa; /* Fundo Cinza Claro */
}

/* Background Claro Sutil */
.pattern-overlay {
  position: absolute;
  inset: 0;
  background-size: 40px 40px;
  background-image:
    linear-gradient(to right, rgba(0, 0, 0, 0.03) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(0, 0, 0, 0.03) 1px, transparent 1px);
}

/* Container Misto: Esquerda Brand (Primary), Direita Glass White */
.login-container {
  position: relative;
  z-index: 1;
  display: flex;
  max-width: 1000px;
  width: 100%;
  min-height: 600px;
  background: white;
  border: 1px solid rgba(0, 0, 0, 0.05);
  border-radius: 24px;
  overflow: hidden;
  align-items: stretch;
}

/* Branding Section (Desktop Side) - Usa a cor primary (Azul) */
.login-branding {
  flex: 1;
  background: var(--q-primary);
  background: linear-gradient(135deg, var(--q-primary) 0%, #1550b8 100%);
  padding: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  color: white;
}

.login-branding::before {
  content: "";
  position: absolute;
  top: -30%;
  left: -20%;
  width: 150%;
  height: 150%;
  background: radial-gradient(
    circle,
    rgba(255, 255, 255, 0.1) 0%,
    transparent 60%
  );
  pointer-events: none;
}

.branding-content {
  position: relative;
  z-index: 1;
  text-align: left;
  max-width: 400px;
}

.logo-wrapper {
  margin-bottom: 2.5rem;
  display: flex;
  justify-content: center;
  width: 100%;
}

.logo-image-desktop {
  height: 70px;
  max-width: 100%;
  object-fit: contain;
  filter: drop-shadow(0 10px 15px rgba(0, 0, 0, 0.2));
}

.branding-title {
  font-size: 2.5rem;
  font-weight: 800;
  margin: 0 0 0.5rem;
  letter-spacing: -0.02em;
}

.branding-subtitle {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.8);
  margin: 0 0 2.5rem;
  line-height: 1.6;
}

.features-list {
  text-align: left;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  margin-bottom: 1.2rem;
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.95);
  font-weight: 500;
}

/* Form Section */
.login-form-section {
  flex: 1.2;
  padding: 3rem 4rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
}

.login-card {
  width: 100%;
  max-width: 400px;
}

/* Mobile Logo */
.mobile-title {
  font-size: 1.8rem;
  font-weight: 800;
  margin: 0;
  letter-spacing: -1px;
}

.logo-image-mobile {
  height: 56px;
  max-width: 100%;
  object-fit: contain;
  margin-bottom: 1rem;
}

/* Welcome Text */
.welcome-text {
  margin-bottom: 2.5rem;
  text-align: left;
}
.lt-md .welcome-text {
  text-align: center;
}

.welcome-title {
  font-size: 1.8rem;
  font-weight: 800;
  margin: 0 0 0.3rem;
  letter-spacing: -0.02em;
}

/* Form Layout */
.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: block;
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 0.4rem;
}

/* Override inputs */
.form-input :deep(.q-field__control) {
  border-radius: 8px;
  height: 52px;
  border: 1px solid rgba(0, 0, 0, 0.08); /* Borda cinza sutil */
}

.form-input.q-field--focused :deep(.q-field__control) {
  border-color: var(--q-primary);
  box-shadow: 0 0 0 3px rgba(var(--q-primary), 0.15);
}

.forgot-password-row {
  margin-bottom: 1.5rem;
}

.forgot-link {
  font-size: 0.9rem;
  text-decoration: none;
  transition: all 0.2s;
}

.forgot-link:hover {
  text-decoration: underline;
}

.login-btn {
  height: 54px;
  border-radius: 8px;
  box-shadow: 0 4px 14px rgba(var(--q-primary), 0.3) !important;
  transition: all 0.2s;
}
.login-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(var(--q-primary), 0.4) !important;
}

.hover-primary:hover {
  color: var(--q-primary) !important;
}
.opacity-80 {
  opacity: 0.8;
}
.tracking-wide {
  letter-spacing: 0.05em;
}

/* Mobile Responsive */
@media (max-width: 1023px) {
  .login-container {
    flex-direction: column;
    max-width: 460px;
    min-height: auto;
  }
  .login-form-section {
    padding: 3rem 2rem;
  }
  .mobile-logo {
    text-align: center;
    margin-bottom: 2rem;
  }
}

@media (max-width: 599px) {
  .login-form-section {
    padding: 2.5rem 1.5rem;
  }
}
</style>
