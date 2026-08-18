const models = [
  { model: "Muse Spark 1.1", provider: "Muse", h1: 40.5, h2: 54.5, h3: 57.4 },
  { model: "Grok 4.6", provider: "xAI", h3: 53.2, isNew: true },
  { model: "Claude Opus 5", provider: "Anthropic", h3: 52.1, isNew: true },
  { model: "Claude Sonnet 5", provider: "Anthropic", h3: 46.2, isNew: true },
  { model: "GLM 5.2", provider: "Zhipu AI", h1: 36.1, h2: 48.0, h3: 51.0 },
  { model: "Claude Sonnet 4.6", provider: "Anthropic", h1: 41.8, h2: 48.2, h3: 51.0 },
  { model: "GPT-5.6 Sol", provider: "OpenAI", h1: 44.1, h2: 49.6, h3: 50.0 },
  { model: "GPT-5.6 Terra", provider: "OpenAI", h1: 36.5, h2: 48.0, h3: 49.1 },
  { model: "GLM 5.1", provider: "Zhipu AI", h1: 33.1, h2: 43.4, h3: 48.1 },
  { model: "GPT-5.6 Luna", provider: "OpenAI", h1: 34.0, h2: 46.3, h3: 48.1 },
  { model: "MiniMax M3", provider: "MiniMax", h1: 27.2, h2: 44.6, h3: 47.7 },
  { model: "GPT-5.5", provider: "OpenAI", h1: 34.6, h2: 43.1, h3: 47.5 },
  { model: "Claude Opus 4.8", provider: "Anthropic", h1: 35.5, h2: 44.8, h3: 47.1 },
  { model: "Kimi K2.6", provider: "Moonshot AI", h1: 27.8, h2: 35.2, h3: 43.5 },
  { model: "Gemini 3.5 Flash", provider: "Google", h1: 33.1, h2: 39.4, h3: 41.3 },
  { model: "Claude Haiku 4.5", provider: "Anthropic", h1: 26.0, h2: 25.9, h3: 37.6 },
  { model: "GPT-5.4 mini", provider: "OpenAI", h1: 19.8, h2: 24.1, h3: 33.8 },
  { model: "Inkling", provider: "Paper Instruments", h1: 20.9, h2: 22.5, h3: 32.8 },
  { model: "Gemini 3.1 Pro", provider: "Google", h1: 22.4, h2: 28.4, h3: 30.1 }
];

if (document.body.classList.contains("home-page")) {
  document.querySelector(".report-section")?.remove();
  document.querySelector(".plot-section")?.remove();
}

const labels = { h1: "H1 · Loop", h2: "H2 · Sandbox", h3: "H3 · Finance" };
const notes = {
  h1: "H1 Loop results over 150 tasks. New Grok 4.6, Claude Opus 5, and Claude Sonnet 5 runs are not available for this harness.",
  h2: "H2 Sandbox results over 150 tasks. New Grok 4.6, Claude Opus 5, and Claude Sonnet 5 runs are not available for this harness.",
  h3: "H3 Finance results. Every score is evaluated over all 150 tasks using GPT-5.5 as rubric judge."
};

function render(harness) {
  const body = document.querySelector("#leaderboard-body");
  if (!body) return;
  const rows = models.filter((m) => Number.isFinite(m[harness])).sort((a, b) => b[harness] - a[harness]);
  body.innerHTML = rows.map((m, index) => `
    <tr class="${index === 0 ? "top-row" : ""}" style="animation-delay:${index * 18}ms">
      <td class="rank-cell">${String(index + 1).padStart(2, "0")}</td>
      <td><span class="model-name">${m.model}</span>${m.isNew && harness === "h3" ? '<span class="new-pill">NEW</span>' : ""}</td>
      <td class="provider">${m.provider}</td>
      <td><span class="harness-chip">${labels[harness]}</span></td>
      <td class="score-cell"><div class="score-layout"><span class="bar-track"><span class="bar" style="width:${m[harness] / 60 * 100}%"></span></span><span class="score-number">${m[harness].toFixed(1)}</span></div></td>
      <td class="coverage">150 / 150</td>
    </tr>`).join("");
  document.querySelector("#table-note").textContent = notes[harness];
}

document.querySelectorAll(".tab").forEach((tab) => tab.addEventListener("click", () => {
  document.querySelectorAll(".tab").forEach((item) => { item.classList.remove("active"); item.setAttribute("aria-selected", "false"); });
  tab.classList.add("active"); tab.setAttribute("aria-selected", "true"); render(tab.dataset.harness);
}));

if (document.querySelector("#leaderboard-body")) render("h3");

const costSeries = [
  { name:"GLM 5.2", color:"#292a25", points:[[.46,36.1,"H1"],[.14,48.0,"H2"],[.15,51.0,"H3"]] },
  { name:"GLM 5.1", color:"#d45c46", points:[[.52,33.1,"H1"],[.38,43.4,"H2"],[.21,48.1,"H3"]] },
  { name:"MiniMax M3", color:"#5079ca", points:[[.12,27.2,"H1"],[.09,44.6,"H2"],[.06,47.7,"H3"]] },
  { name:"Kimi K2.6", color:"#5f8a61", points:[[.69,27.8,"H1"],[.39,35.2,"H2"],[.15,43.5,"H3"]] },
  { name:"Inkling", color:"#bf893f", points:[[.09,20.9,"H1"],[.15,22.5,"H2"],[.14,32.8,"H3"]] },
  { name:"Grok 4.6", color:"#111111", points:[[.839,53.2,"H3"]] },
  { name:"Claude Opus 5", color:"#9c63a8", points:[[1.019,52.1,"H3"]] }
];

function drawCostPlot(){
  const svg=document.querySelector("#cost-plot"); if(!svg) return;
  const w=1000,h=540,p={l:88,r:48,t:64,b:120}; const x=v=>p.l+(v/1.2)*(w-p.l-p.r); const y=v=>h-p.b-((v-15)/45)*(h-p.t-p.b);
  let out=`<g class="axes">`;
  [20,30,40,50,60].forEach(v=>out+=`<line x1="${p.l}" x2="${w-p.r}" y1="${y(v)}" y2="${y(v)}" stroke="#d9dbd1"/><text x="${p.l-18}" y="${y(v)+4}" text-anchor="end">${v}</text>`);
  [0,.20,.40,.60,.80,1.00,1.20].forEach(v=>out+=`<text x="${x(v)}" y="${h-88}" text-anchor="middle">$${v.toFixed(2)}</text>`);
  out+=`<text x="${p.l}" y="28">RUBRIC SCORE</text><text x="${w/2}" y="${h-30}" text-anchor="middle">ESTIMATED MEAN COST / TASK</text></g>`;
  costSeries.forEach(s=>{const pts=s.points.map(q=>`${x(q[0])},${y(q[1])}`).join(" ");out+=`<polyline points="${pts}" fill="none" stroke="${s.color}" stroke-width="2"/>`;s.points.forEach(q=>{if(q[2]==='H3')out+=`<circle cx="${x(q[0])}" cy="${y(q[1])}" r="9" fill="none" stroke="${s.color}" stroke-width="1.5" pointer-events="none"/>`;out+=`<circle class="plot-point" tabindex="0" data-model="${s.name}" data-harness="${q[2]}" data-score="${q[1].toFixed(1)}" data-cost="${q[0].toFixed(2)}" cx="${x(q[0])}" cy="${y(q[1])}" r="6" fill="${q[2]==='H1'?'#fbfcf7':s.color}" fill-opacity="${q[2]==='H2'?'.42':'1'}" stroke="${s.color}" stroke-width="2"/>`})});
  svg.setAttribute("viewBox",`0 0 ${w} ${h}`);svg.innerHTML=out;
  const tip=svg.parentElement.querySelector(".plot-tooltip");
  const labels={H1:"H1 · Loop",H2:"H2 · Sandbox",H3:"H3 · Finance"};
  svg.querySelectorAll(".plot-point").forEach(point=>{
    const show=()=>{const box=svg.getBoundingClientRect(),pbox=point.getBoundingClientRect();tip.innerHTML=`<b>${point.dataset.model}</b><span>${labels[point.dataset.harness]}</span><dl><div><dt>Rubric score</dt><dd>${point.dataset.score}</dd></div><div><dt>Est. cost / task</dt><dd>$${point.dataset.cost}</dd></div></dl>`;tip.style.left=`${pbox.left-box.left+pbox.width/2}px`;tip.style.top=`${pbox.top-box.top}px`;tip.classList.add("visible")};
    const hide=()=>tip.classList.remove("visible");point.addEventListener("mouseenter",show);point.addEventListener("mouseleave",hide);point.addEventListener("focus",show);point.addEventListener("blur",hide);
  });
}
drawCostPlot();
