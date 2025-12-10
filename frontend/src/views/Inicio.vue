<template>
  <main class="home">
    <!-- HERO -->
    <section class="hero">
      <div class="hero-left">
        <span class="hero-pill">Tu asistente de salud personal</span>
        <h1>Medical Kit</h1>
        <p class="hero-subtitle">
          Gestiona tus medicamentos de forma sencilla y efectiva. Recibe recordatorios automáticos
          y mantén el control de tu tratamiento.
        </p>

        <div class="hero-actions">
          <button class="btn btn-primary" type="button" @click="goToMedicamentos">
            Comenzar ahora
            <span class="arrow">➜</span>
          </button>
        </div>

        <div class="hero-checks">
          <span>✓ Recordatorios inteligentes</span>
          <span>✓ Historial siempre disponible</span>
        </div>
      </div>

      <aside class="hero-card">
        <div class="card-badge">Próxima toma</div>
        <div class="card-time">09:00 a. m.</div>
        <h3 class="card-title">Ibuprofeno 200mg</h3>
        <p class="card-sub">
          Cada 8 horas · Después de los alimentos
        </p>
        <div class="card-status">
          <span class="status-dot"></span>
          <span>Recordatorio activado</span>
        </div>
      </aside>
    </section>

    <!-- CARACTERÍSTICAS PRINCIPALES -->
    <section class="features">
      <h2>Características principales</h2>
      <p class="features-sub">
        Todo lo que necesitas para mantener el control de tu salud en un solo lugar.
      </p>

      <div class="features-grid">
        <article class="feature-card">
          <div class="feature-icon">📅</div>
          <h3>Calendario inteligente</h3>
          <p>
            Visualiza todos tus medicamentos en un calendario claro, organizado y fácil de entender.
          </p>
        </article>

        <article class="feature-card">
          <div class="feature-icon">🔔</div>
          <h3>Recordatorios automáticos</h3>
          <p>
            Recibe alertas precisas para nunca olvidar una dosis importante de tu tratamiento.
          </p>
        </article>

        <article class="feature-card">
          <div class="feature-icon">⏱️</div>
          <h3>Horarios personalizados</h3>
          <p>
            Configura múltiples horarios de toma según las indicaciones de tu médico.
          </p>
        </article>

        <article class="feature-card">
          <div class="feature-icon">🔒</div>
          <h3>Datos seguros</h3>
          <p>
            Tu información médica se mantiene privada y protegida en todo momento.
          </p>
        </article>

        <article class="feature-card">
          <div class="feature-icon">❤️</div>
          <h3>Seguimiento de salud</h3>
          <p>
            Monitorea tu adherencia al tratamiento y detecta fácilmente si olvidas una toma.
          </p>
        </article>

        <article class="feature-card">
          <div class="feature-icon">📈</div>
          <h3>Estadísticas claras</h3>
          <p>
            Revisa tu progreso con visualizaciones simples y fáciles de entender.
          </p>
        </article>
      </div>
    </section>

    <!-- CÓMO FUNCIONA (con íconos nuevos) -->
    <section class="steps-section">
      <h2 class="section-title">¿Cómo funciona?</h2>
      <p class="section-subtitle">
        Tres pasos simples para comenzar a cuidar tu salud.
      </p>

      <div class="steps-grid">
        <article
          v-for="s in steps"
          :key="s.title"
          class="step-card"
        >
          <div class="step-icon">
            <component :is="s.icon" class="icon" />
          </div>

          <h3 class="step-title">{{ s.title }}</h3>
          <p class="step-desc">{{ s.desc }}</p>
        </article>
      </div>
    </section>

    <!-- POR QUÉ MEDICAL KIT -->
    <section class="why">
      <h2>¿Por qué deberías escogernos?</h2>
      <p class="why-sub">
        Diseñado pensando en tu bienestar y facilidad de uso.
      </p>

      <div class="why-grid">
        <div class="why-item">✔ Nunca olvides una dosis importante</div>
        <div class="why-item">✔ Gestiona múltiples tratamientos fácilmente</div>
        <div class="why-item">✔ Historial completo de medicamentos</div>
        <div class="why-item">✔ Interfaz intuitiva y fácil de usar</div>
        <div class="why-item">✔ Sincronización en tiempo real</div>
        <div class="why-item">✔ Sin costo, 100% gratuito</div>
      </div>
    </section>

    <!-- CTA FINAL -->
    <section class="cta">
      <div class="cta-card">
        <h2>Comienza a cuidar tu salud hoy</h2>
        <p>
          Únete a personas que confían en Medical Kit para gestionar sus medicamentos.
        </p>
        <button class="btn btn-primary" type="button" @click="goToMedicamentos">
          Empezar gratis
          <span class="arrow">➜</span>
        </button>
      </div>
    </section>
  </main>
</template>

<script setup>
import { useRouter } from 'vue-router'
import {
  PlusCircleIcon,
  BellAlertIcon,
  ChartBarIcon
} from '@heroicons/vue/24/outline'

const router = useRouter()

const steps = [
  {
    title: 'Agrega tus medicamentos',
    desc: 'Registra el nombre, dosis, frecuencia y horarios de cada medicamento.',
    icon: PlusCircleIcon
  },
  {
    title: 'Configura recordatorios',
    desc: 'Establece alertas personalizadas para cada toma de medicamento.',
    icon: BellAlertIcon
  },
  {
    title: 'Mantén el control',
    desc: 'Visualiza tu calendario, marca dosis tomadas y revisa tu historial.',
    icon: ChartBarIcon
  }
]

// 👉 Acción principal de los botones del hero y del CTA
function goToMedicamentos() {
  router.push({ path: '/medicamentos' })
}
</script>

<style scoped>
.home {
  max-width: 1120px;
  margin: 2.5rem auto 3.5rem;
  padding: 0 1rem 3rem;
}

/* HERO */
.hero {
  display: grid;
  grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr);
  gap: 2rem;
  align-items: center;
  margin-bottom: 3rem;
}

.hero-left h1 {
  font-size: clamp(2.2rem, 3vw, 2.6rem);
  font-weight: 800;
  margin-bottom: 0.8rem;
  color: #0f172a;
}

.hero-subtitle {
  color: #475569;
  max-width: 540px;
  line-height: 1.5;
  margin-bottom: 1.5rem;
}

.hero-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.85rem;
  padding: 0.35rem 0.8rem;
  border-radius: 999px;
  background: #eef2ff;
  color: #4338ca;
  margin-bottom: 0.75rem;
  font-weight: 500;
}

/* Botones */
.hero-actions {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.btn {
  border-radius: 999px;
  padding: 0.7rem 1.4rem;
  font-size: 0.95rem;
  font-weight: 500;
  border: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  transition: all 0.2s ease;
}

.btn-primary {
  background: #0f172a;
  color: #f9fafb;
  box-shadow: 0 12px 25px rgba(15, 23, 42, 0.35);
}

.btn-primary:hover {
  background: #020617;
  transform: translateY(-1px);
  box-shadow: 0 16px 30px rgba(15, 23, 42, 0.45);
}

.arrow {
  font-size: 1.1rem;
}

.hero-checks {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  font-size: 0.9rem;
  color: #64748b;
}

/* Tarjeta derecha */
.hero-card {
  background: #ffffff;
  border-radius: 22px;
  padding: 1.4rem 1.6rem;
  box-shadow: 0 24px 45px rgba(15, 23, 42, 0.12);
  border: 1px solid #e5e7eb;
  position: relative;
}

.card-badge {
  display: inline-block;
  padding: 0.25rem 0.7rem;
  border-radius: 999px;
  background: #eef2ff;
  color: #4338ca;
  font-size: 0.8rem;
  margin-bottom: 0.7rem;
}

.card-time {
  position: absolute;
  right: 1.4rem;
  top: 1.4rem;
  font-weight: 600;
  color: #0f172a;
}

.card-title {
  font-size: 1.1rem;
  font-weight: 700;
  margin-top: 0.3rem;
  margin-bottom: 0.2rem;
  color: #0f172a;
}

.card-sub {
  font-size: 0.9rem;
  color: #475569;
  margin-bottom: 1rem;
}

.card-status {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.85rem;
  color: #16a34a;
  padding: 0.35rem 0.7rem;
  border-radius: 999px;
  background: #dcfce7;
}

.status-dot {
  width: 8px;
  height: 8px;
  background: #22c55e;
  border-radius: 999px;
}

/* FEATURES */
.features {
  margin-top: 2.5rem;
  margin-bottom: 2.5rem;
  text-align: center;
}

.features h2 {
  font-size: 1.8rem;
  font-weight: 700;
  color: #0f172a;
}

.features-sub {
  color: #475569;
  margin-top: 0.4rem;
  margin-bottom: 2rem;
}

.features-grid {
  display: grid;
  gap: 1.5rem;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
}

.feature-card {
  background: #ffffffaa;
  backdrop-filter: blur(6px);
  border-radius: 20px;
  padding: 1.4rem 1.5rem;
  text-align: left;
  box-shadow: 0 18px 35px rgba(15, 23, 42, 0.06);
  border: 1px solid #e5e7eb;
}

.feature-icon {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: #f9fafb;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.9rem;
  font-size: 1.4rem;
}

.feature-card h3 {
  font-size: 1.05rem;
  font-weight: 600;
  margin-bottom: 0.4rem;
  color: #0f172a;
}

.feature-card p {
  font-size: 0.95rem;
  color: #4b5563;
}

/* CÓMO FUNCIONA */
.steps-section {
  margin-top: 3rem;
  text-align: center;
}

.section-title {
  font-size: 1.8rem;
  font-weight: 700;
  color: #0f172a;
}

.section-subtitle {
  color: #475569;
  margin-bottom: 2.5rem;
  font-size: 1rem;
}

.steps-grid {
  display: grid;
  gap: 1.5rem;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  padding: 0 1rem;
}

.step-card {
  background: #ffffffaa;
  backdrop-filter: blur(6px);
  border-radius: 20px;
  padding: 1.5rem 1.6rem;
  box-shadow: 0 18px 35px rgba(15, 23, 42, 0.06);
  border: 1px solid #e5e7eb;
  text-align: left;
}

.step-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: #f4f4f5;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
}

.step-icon .icon {
  width: 26px;
  height: 26px;
  color: #111827;
}

.step-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #0f172a;
  margin-bottom: 0.5rem;
}

.step-desc {
  color: #475569;
  font-size: 0.95rem;
  line-height: 1.4;
}

/* POR QUÉ */
.why {
  margin-top: 3rem;
  text-align: center;
}

.why-sub {
  color: #475569;
  margin-bottom: 1.75rem;
}

.why-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 0.9rem;
}

.why-item {
  background: #ffffff;
  border: 1px solid #d1d5db;
  color: #111827;
  border-radius: 12px;
  padding: 0.7rem 1.1rem;
  font-size: 0.95rem;
  text-align: left;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.05);
  font-weight: 500;
}

/* CTA FINAL */
.cta {
  margin-top: 3rem;
}

.cta-card {
  background: #ffffff;
  border-radius: 22px;
  padding: 2rem 1.5rem;
  text-align: center;
  color: #111827;
  border: 1px solid #e5e7eb;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.07);
}

.cta-card h2 {
  font-size: 1.6rem;
  margin-bottom: 0.4rem;
  font-weight: 700;
  color: #111827;
}

.cta-card p {
  margin-bottom: 1rem;
  color: #374151;
}

/* RESPONSIVE */
@media (max-width: 880px) {
  .hero {
    grid-template-columns: 1fr;
  }

  .hero-card {
    order: -1;
  }

  .home {
    margin-top: 1.5rem;
  }
}

/* Mobile optimizations */
@media (max-width: 640px) {
  .home {
    margin: 1rem auto 2rem;
    padding: 0 1rem 1rem;
  }

  /* Hero */
  .hero {
    gap: 1.5rem;
    margin-bottom: 2rem;
  }

  .hero-left h1 {
    font-size: 1.8rem;
  }

  .hero-subtitle {
    font-size: 0.95rem;
  }

  .hero-pill {
    font-size: 0.8rem;
    padding: 0.3rem 0.7rem;
  }

  .hero-actions {
    flex-direction: column;
    width: 100%;
  }

  .btn {
    width: 100%;
    justify-content: center;
  }

  .hero-checks {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  /* Features */
  .features {
    margin-top: 2rem;
    margin-bottom: 2rem;
  }

  .features h2 {
    font-size: 1.5rem;
  }

  .features-grid {
    gap: 1rem;
    grid-template-columns: 1fr;
  }

  .feature-card {
    padding: 1.2rem;
  }

  /* Steps */
  .steps-section {
    margin-top: 2rem;
  }

  .section-title {
    font-size: 1.5rem;
  }

  .steps-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
    padding: 0;
  }

  .step-card {
    padding: 1.2rem;
  }

  /* Why */
  .why {
    margin-top: 2rem;
  }

  .why h2 {
    font-size: 1.5rem;
  }

  .why-grid {
    grid-template-columns: 1fr;
    gap: 0.7rem;
  }

  .why-item {
    padding: 0.6rem 1rem;
    font-size: 0.9rem;
  }

  /* CTA */
  .cta {
    margin-top: 2rem;
  }

  .cta-card {
    padding: 1.5rem 1.2rem;
  }

  .cta-card h2 {
    font-size: 1.4rem;
  }

  .cta-card p {
    font-size: 0.95rem;
  }
}
</style>
