const metrics = {
  totalCases: 48199,
  chartData: [
    { m:'Ene', v:3800 }, { m:'Feb', v:4200 }, { m:'Mar', v:3900 },
    { m:'Abr', v:4500 }, { m:'May', v:4100 }, { m:'Jun', v:4300 },
    { m:'Jul', v:3700 }, { m:'Ago', v:4000 }, { m:'Sep', v:4400 },
    { m:'Oct', v:3900 }, { m:'Nov', v:4200 }, { m:'Dic', v:4200 }
  ],
  distribution: [
    { r:'0-2h', c:8500, color:'#22c55e' },
    { r:'2-4h', c:12000, color:'#3b82f6' },
    { r:'4-8h', c:15200, color:'#f59e0b' },
    { r:'8-24h', c:9500, color:'#f97316' },
    { r:'+24h', c:3000, color:'#dc2626' }
  ],
  categories: [
    { n:'Hardware', t:12500, r:11800, time:'3.2h', color:'#a855f7' },
    { n:'Software', t:18200, r:17100, time:'4.5h', color:'#3b82f6' },
    { n:'Red', t:8900, r:8200, time:'5.1h', color:'#06b6d4' },
    { n:'Seguridad', t:4200, r:3900, time:'6.8h', color:'#dc2626' },
    { n:'Usuario', t:4400, r:4200, time:'2.1h', color:'#22c55e' }
  ],
  technicians: [
    { n:'Carlos Méndez', c:342, t:'3.2h', s:4.8, e:95 },
    { n:'Laura Sánchez', c:298, t:'3.8h', s:4.7, e:92 },
    { n:'Pedro Ramírez', c:276, t:'4.1h', s:4.6, e:88 },
    { n:'Ana Martínez', c:251, t:'4.5h', s:4.5, e:85 },
    { n:'Jorge López', c:234, t:'4.8h', s:4.4, e:82 }
  ]
};

document.getElementById('totalCases').textContent =
  metrics.totalCases.toLocaleString();

/* SVG Chart */
const svg = document.getElementById('trendChart');
metrics.chartData.forEach((d,i)=>{
  const h = (d.v / 4500) * 150;
  svg.innerHTML += `
    <rect x="${i*50+10}" y="${180-h}" width="30" height="${h}" fill="#3b82f6" rx="4"/>
    <text x="${i*50+25}" y="195" font-size="10" text-anchor="middle">${d.m}</text>
  `;
});

/* Distribución */
const dist = document.getElementById('timeDistribution');
metrics.distribution.forEach(d=>{
  dist.innerHTML += `
    <p>${d.r} (${d.c})</p>
    <div class="bar"><div style="width:${(d.c/15200)*100}%;background:${d.color}"></div></div>
  `;
});

/* Categorías */
const cat = document.getElementById('categoryTable');
metrics.categories.forEach(c=>{
  cat.innerHTML += `
    <tr>
      <td>${c.n}</td>
      <td>${c.t}</td>
      <td>${c.r}</td>
      <td>${((c.r/c.t)*100).toFixed(1)}%</td>
      <td>${c.time}</td>
      <td><div class="bar"><div style="width:${(c.t/18200)*100}%;background:${c.color}"></div></div></td>
    </tr>
  `;
});

/* Técnicos */
const tech = document.getElementById('technicians');
metrics.technicians.forEach(t=>{
  tech.innerHTML += `
    <div class="tech">
      <strong>${t.n}</strong>
      <p>Casos: ${t.c}</p>
      <p>Tiempo: ${t.t}</p>
      <p>⭐ ${t.s}</p>
      <div class="bar"><div style="width:${t.e}%;background:#16a34a"></div></div>
    </div>
  `;
});

function setPeriod(p){
  document.querySelectorAll('.periods button').forEach(b=>b.classList.remove('active'));
  event.target.classList.add('active');
}
