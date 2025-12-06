 <template>
   <section class="wrap">
     <TopTabs />
 
     <div class="grid">
       <!-- Selector de fecha -->
       <div class="card">
         <h2>Calendario de Medicamentos</h2>
         <p class="sub">Selecciona un día para ver los medicamentos programados</p>
         <input type="date" v-model="sel" class="date" />
       </div>
 
       <!-- Lista del día seleccionado -->
       <div class="card">
         <div class="row between center">
           <h3 class="title">{{ fechaBonita }}</h3>
           <div class="sub">{{ lista.length }} medicamento(s) programado(s)</div>
         </div>
 
         <ul class="list">
           <li
             v-for="m in lista"
             :key="m.id"
             class="item"
             :style="{ borderLeftColor: color(m.name) }"
           >
             <div>
               <div class="title">{{ m.name }}</div>
               <div class="sub">{{ m.dose || '—' }}</div>
               <div class="times">
                 <span v-for="t in (m.times || [])" :key="t" class="pill">
                   ⏱️ {{ t }}
                 </span>
               </div>
             </div>
 
             <div class="right">
               <span class="chip">{{ frecuencia(m) }}</span>
             </div>
           </li>
 
           <li v-if="!lista.length" class="sub">
             No hay medicamentos para este día.
           </li>
         </ul>
       </div>
     </div>
   </section>
 </template>
 
 <script setup>
 import { ref, computed } from 'vue'
 import { getMeds } from '../services/storage'
 
 const sel = ref(new Date().toISOString().slice(0, 10))
 const meds = ref(getMeds())
 
 const lista = computed(() =>
   meds.value.filter((m) => dentroDelPeriodo(m, sel.value))
 )
 
 const fechaBonita = computed(() =>
   new Date(sel.value).toLocaleDateString('es-MX', {
     weekday: 'long',
     year: 'numeric',
     month: 'long',
     day: 'numeric'
   })
 )
 
 function dentroDelPeriodo(m, ymd) {
   const d = new Date(ymd)
   const s = m.start ? new Date(m.start) : null
   const e = m.end ? new Date(m.end) : null
   if (s && d < s) return false
   if (e && d > e) return false
   return true
 }
 
 function frecuencia(m) {
   return m.frequency || '—'
 }
 
 function color(str) {
   // hash simple → color para el borde izquierdo
   let h = 0
   for (let i = 0; i < str.length; i++) h = str.charCodeAt(i) + ((h << 5) - h)
   const c = (h & 0x00ffffff).toString(16).toUpperCase().padStart(6, '0')
   return `#${c}`
 }
 </script>
 
 <style scoped>
 .wrap{max-width:1100px;margin:2rem auto;padding:0 1rem}
 .grid{display:grid;grid-template-columns:1fr 2fr;gap:1rem}
 .card{background:#fff;border:1px solid #e5e7eb;border-radius:16px;padding:1rem}
 .date{padding:.6rem .8rem;border:1px solid #e5e7eb;border-radius:10px;margin-top:.5rem}
 .list{list-style:none;padding:0;margin:0}
 .item{display:grid;grid-template-columns:1fr auto;gap:.25rem;border-left:4px solid #93c5fd;padding:.75rem;border-radius:10px;margin:.5rem 0;background:#f8fafc}
 .title{font-weight:600}
 .right{align-self:center}
 .pill{display:inline-block;border:1px solid #e5e7eb;border-radius:999px;padding:.25rem .6rem;margin-right:.35rem;margin-top:.25rem}
 .chip{background:#f1f5f9;border-radius:999px;padding:.25rem .6rem}
 .sub{color:#64748b;font-size:.9rem}
 .row{display:flex;align-items:center}
 .between{justify-content:space-between}
 @media (max-width:900px){ .grid{grid-template-columns:1fr} }
 </style>
 