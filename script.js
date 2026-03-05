// Simple utility to add a CSS class when elements enter viewport
function setupScrollReveal() {
  const revealEls = document.querySelectorAll(
    '.section, .card, .prototype-item, .gallery-item, .result-card, .contact-card'
  );

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
    }
  );

  revealEls.forEach(el => {
    el.classList.add('reveal');
    observer.observe(el);
  });
}

// Mobile navigation toggle
function setupNavToggle() {
  const toggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (!toggle || !navLinks) return;

  toggle.addEventListener('click', () => {
    toggle.classList.toggle('open');
    navLinks.classList.toggle('open');
  });

  // Close menu on link click (mobile)
  navLinks.addEventListener('click', event => {
    if (event.target.tagName.toLowerCase() === 'a') {
      toggle.classList.remove('open');
      navLinks.classList.remove('open');
    }
  });
}

// Lightweight chart drawing using Canvas 2D (no external chart library)
function drawFloodRiseChart() {
  const canvas = document.getElementById('floodRiseChart');
  if (!canvas || !canvas.getContext) return;
  const ctx = canvas.getContext('2d');

  const labels = ['Aug', 'Sep', 'Oct', 'Nov'];
  const data = [0.6, 0.9, 1.1, 0.8]; // example relative water rise (m)

  const padding = 30;
  const w = canvas.width;
  const h = canvas.height;
  ctx.clearRect(0, 0, w, h);

  // Axes
  ctx.strokeStyle = '#7c98a0';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(padding, padding / 2);
  ctx.lineTo(padding, h - padding);
  ctx.lineTo(w - padding / 2, h - padding);
  ctx.stroke();

  const maxVal = Math.max(...data) * 1.2;
  const stepX = (w - padding * 2) / (labels.length - 1 || 1);
  const baseY = h - padding;

  // Line
  ctx.beginPath();
  data.forEach((val, i) => {
    const x = padding + stepX * i;
    const y = baseY - ((h - padding * 1.7) * val) / maxVal;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.strokeStyle = '#1f8bb6';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Fill
  const gradient = ctx.createLinearGradient(0, padding, 0, baseY);
  gradient.addColorStop(0, 'rgba(31, 139, 182, 0.4)');
  gradient.addColorStop(1, 'rgba(45, 166, 107, 0.02)');
  ctx.lineTo(padding + stepX * (data.length - 1), baseY);
  ctx.lineTo(padding, baseY);
  ctx.closePath();
  ctx.fillStyle = gradient;
  ctx.fill();

  // Points and labels
  ctx.fillStyle = '#10323f';
  ctx.font = '10px Inter, system-ui, sans-serif';
  data.forEach((val, i) => {
    const x = padding + stepX * i;
    const y = baseY - ((h - padding * 1.7) * val) / maxVal;
    ctx.beginPath();
    ctx.arc(x, y, 3, 0, Math.PI * 2);
    ctx.fillStyle = '#2da66b';
    ctx.fill();

    ctx.fillStyle = '#5c6f7a';
    ctx.fillText(labels[i], x - 10, baseY + 12);
  });
}

function drawFloodCausesChart() {
  const canvas = document.getElementById('floodCausesChart');
  if (!canvas || !canvas.getContext) return;
  const ctx = canvas.getContext('2d');

  const slices = [
    { label: 'Intense Rainfall', value: 40, color: '#1f8bb6' },
    { label: 'Poor Drainage', value: 25, color: '#2da66b' },
    { label: 'Backwater Inflow', value: 20, color: '#f6a623' },
    { label: 'Land-Use Change', value: 15, color: '#c76cdd' },
  ];

  const total = slices.reduce((sum, s) => sum + s.value, 0);
  const cx = canvas.width / 2 - 10;
  const cy = canvas.height / 2;
  const radius = Math.min(canvas.width, canvas.height) / 2 - 10;

  let startAngle = -Math.PI / 2;
  slices.forEach(slice => {
    const angle = (slice.value / total) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, radius, startAngle, startAngle + angle);
    ctx.closePath();
    ctx.fillStyle = slice.color;
    ctx.fill();
    startAngle += angle;
  });

  // Simple legend
  const legendX = canvas.width - 80;
  let legendY = 16;
  ctx.font = '9px Inter, system-ui, sans-serif';
  slices.forEach(slice => {
    ctx.fillStyle = slice.color;
    ctx.fillRect(legendX, legendY - 8, 10, 10);
    ctx.fillStyle = '#465b63';
    ctx.fillText(slice.label, legendX + 14, legendY + 1);
    legendY += 14;
  });
}

function drawSurveyChart() {
  const canvas = document.getElementById('surveyChart');
  if (!canvas || !canvas.getContext) return;
  const ctx = canvas.getContext('2d');

  const labels = ['Crop Loss', 'Soil Degradation', 'Interested in Floating System'];
  const data = [78, 65, 72]; // percentage of respondents

  const padding = 30;
  const w = canvas.width;
  const h = canvas.height;
  ctx.clearRect(0, 0, w, h);

  const maxVal = 100;
  const barWidth = (w - padding * 2) / (labels.length * 1.8);
  const gap = barWidth * 0.8;

  ctx.strokeStyle = '#7c98a0';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(padding, padding / 2);
  ctx.lineTo(padding, h - padding);
  ctx.lineTo(w - padding / 2, h - padding);
  ctx.stroke();

  data.forEach((val, i) => {
    const x = padding + i * (barWidth + gap) + gap / 2;
    const barHeight = ((h - padding * 1.7) * val) / maxVal;
    const y = h - padding - barHeight;

    const gradient = ctx.createLinearGradient(0, y, 0, y + barHeight);
    gradient.addColorStop(0, '#1f8bb6');
    gradient.addColorStop(1, '#2da66b');

    ctx.fillStyle = gradient;
    ctx.fillRect(x, y, barWidth, barHeight);

    ctx.fillStyle = '#10323f';
    ctx.font = '10px Inter, system-ui, sans-serif';
    ctx.fillText(`${val}%`, x + barWidth / 2 - 10, y - 4);

    ctx.fillStyle = '#5c6f7a';
    const label = labels[i];
    const words = label.split(' ');
    words.forEach((word, index) => {
      ctx.fillText(word, x - 4, h - padding + 12 + index * 9);
    });
  });
}

// QR code generator
function setupQrGenerator() {
  const form = document.getElementById('qrForm');
  const input = document.getElementById('qrUrl');
  const container = document.getElementById('qrCodeContainer');

  if (!form || !input || !container || typeof QRCode === 'undefined') return;

  let qr;

  function generate(url) {
    container.innerHTML = '';
    qr = new QRCode(container, {
      text: url,
      width: 160,
      height: 160,
      colorDark: '#10323f',
      colorLight: '#ffffff',
      correctLevel: QRCode.CorrectLevel.H,
    });
  }

  // Pre-fill with current location if served via HTTP/HTTPS
  try {
    if (window.location.protocol.startsWith('http')) {
      input.value = window.location.href;
      generate(window.location.href);
    }
  } catch {
    // ignore
  }

  form.addEventListener('submit', event => {
    event.preventDefault();
    const url = input.value.trim();
    if (!url) return;
    generate(url);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  setupScrollReveal();
  setupNavToggle();

  // Allow canvas to use actual pixel width/height from layout
  ['floodRiseChart', 'floodCausesChart', 'surveyChart'].forEach(id => {
    const canvas = document.getElementById(id);
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = 210 * window.devicePixelRatio;
      const ctx = canvas.getContext('2d');
      if (ctx) ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    }
  });

  drawFloodRiseChart();
  drawFloodCausesChart();
  drawSurveyChart();
  setupQrGenerator();

  // Redraw charts on resize (debounced)
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      ['floodRiseChart', 'floodCausesChart', 'surveyChart'].forEach(id => {
        const canvas = document.getElementById(id);
        if (canvas) {
          const rect = canvas.getBoundingClientRect();
          canvas.width = rect.width * window.devicePixelRatio;
          canvas.height = 210 * window.devicePixelRatio;
          const ctx = canvas.getContext('2d');
          if (ctx) ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        }
      });
      drawFloodRiseChart();
      drawFloodCausesChart();
      drawSurveyChart();
    }, 250);
  });
});

