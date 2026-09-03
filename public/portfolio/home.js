const nav = document.querySelector('.home-nav');
let ticking = false;

const render = () => {
  nav?.classList.toggle('is-scrolled', scrollY > 18);
  renderSystem();
  ticking = false;
};

const requestRender = () => {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(render);
};

const viviUniverse = document.querySelector('.vivi-universe');
const viviInput = viviUniverse?.querySelector('#vivi-question');
const viviForm = viviUniverse?.querySelector('[data-vivi-form]');
const viviResultsSection = viviUniverse?.querySelector('[data-vivi-results-section]');
const viviResults = viviUniverse?.querySelector('[data-vivi-results]');
const viviResponse = viviUniverse?.querySelector('[data-vivi-response]');
let viviTrigger = null;
let placeholderIndex = 0;
let placeholderTimer = null;

const viviPlaceholders = [
  'Tengo una idea, pero no sé cómo explicarla',
  'Estoy empezando y no sé por dónde seguir',
  'Mi comunicación está desordenada',
  'Quiero lanzar un proyecto',
  'Necesito mejorar mi posicionamiento'
];

const viviPaths = {
  idea: {
    prompt: 'Tengo una idea, pero no sé cómo explicarla',
    response: 'Primero hay que bajar la idea, encontrar su hilo y darle una forma que otra persona pueda entender.',
    cards: [
      ['Ejercicio', 'Que la imaginación no te paralice', 'Un método concreto para bajar la idea a tierra sin juzgarla.', 'que-la-imaginacion-no-te-paralice.html', 'Ir al artículo'],
      ['Servicio', 'Copywriting y arquitectura de contenidos', 'Para convertir una idea compleja en mensajes claros y conectados.', '#servicios', 'Ver el servicio'],
      ['Siguiente paso', 'Contarle la idea a Vicky', 'No necesitás llegar con un brief perfecto para empezar.', 'mailto:comunicaconvicky@gmail.com?subject=Tengo%20una%20idea%20y%20necesito%20darle%20forma', 'Escribirle a Vicky']
    ]
  },
  start: {
    prompt: 'Estoy empezando y no sé por dónde seguir',
    response: 'No necesitás resolver todo ahora. Empecemos por reconocer la idea, la prioridad y el próximo paso posible.',
    cards: [
      ['Sistema', 'Imaginar, construir, dirigir', 'Tres movimientos para pasar de una idea abierta a un sistema que se puede aplicar.', '#sistema', 'Conocer el sistema'],
      ['Ejercicio', 'La magia está en el trabajo que evitás', 'Una guía para detectar la tarea que está frenando el avance.', 'la-magia-esta-en-el-trabajo-que-evitas.html', 'Ir al artículo'],
      ['Orientación', 'Una primera conversación', 'Para ubicar en qué momento está el proyecto y qué necesita primero.', 'mailto:comunicaconvicky@gmail.com?subject=Estoy%20empezando%20y%20necesito%20orientaci%C3%B3n', 'Hablar con Vicky']
    ]
  },
  order: {
    prompt: 'Mi comunicación está desordenada',
    response: 'El problema no suele ser la falta de contenido, sino la falta de relación entre mensajes, públicos, canales y objetivos.',
    cards: [
      ['Servicio', 'Copywriting y arquitectura de contenidos', 'Ordenar la propuesta de valor, los mensajes clave y la función de cada contenido.', '#servicios', 'Ver el servicio'],
      ['Sistema', 'Construir', 'El movimiento que conecta mensajes, públicos, canales y objetivos.', '#sistema', 'Ver cómo funciona'],
      ['Caso', 'Cognition', 'Cómo se organizó una comunicación compleja de tecnología e inteligencia artificial.', 'cognition.html', 'Ver el caso']
    ]
  },
  launch: {
    prompt: 'Estoy por lanzar un proyecto',
    response: 'Un lanzamiento necesita una idea rectora, prioridades claras y criterios para que cada pieza trabaje en la misma dirección.',
    cards: [
      ['Servicio', 'Dirección creativa', 'Concepto rector, dirección de campaña y criterios para sostener el universo.', '#servicios', 'Ver el servicio'],
      ['Ejercicio', 'La magia está en el trabajo que evitás', 'Para detectar qué tarea crítica está postergando el lanzamiento.', 'la-magia-esta-en-el-trabajo-que-evitas.html', 'Ir al artículo'],
      ['Orientación', 'Preparar el lanzamiento', 'Revisar la idea, el momento y lo que hace falta ordenar antes de salir.', 'mailto:comunicaconvicky@gmail.com?subject=Estoy%20por%20lanzar%20un%20proyecto', 'Hablar con Vicky']
    ]
  },
  positioning: {
    prompt: 'Quiero mejorar mi posicionamiento',
    response: 'Posicionarse no es publicar más: es construir una percepción clara y sostenerla con mensajes y contenidos coherentes.',
    cards: [
      ['Servicio', 'Estrategia y posicionamiento orgánico', 'Contenido, SEO, ASO y distribución con un criterio común.', '#servicios', 'Ver el servicio'],
      ['Caso', 'Cognition', 'Un sistema reconocible para comunicar tecnología, productos y audiencias.', 'cognition.html', 'Ver el caso'],
      ['Orientación', 'Revisar tu posicionamiento', 'Detectar qué se entiende hoy y qué percepción necesitás construir.', 'mailto:comunicaconvicky@gmail.com?subject=Quiero%20mejorar%20mi%20posicionamiento', 'Hablar con Vicky']
    ]
  },
  direction: {
    prompt: 'Mi marca necesita una dirección clara',
    response: 'La dirección aparece cuando la identidad, el concepto y las decisiones creativas responden al mismo criterio.',
    cards: [
      ['Servicio', 'Dirección creativa', 'Definir un concepto rector y criterios claros para campañas, piezas y equipos.', '#servicios', 'Ver el servicio'],
      ['Caso', 'Dra. Marce Segura', 'Cómo una identidad, una voz y un sistema de contenidos convirtieron conocimiento médico en una marca clara.', 'dra-marce-segura.html', 'Ver el caso'],
      ['Orientación', 'Ordenar la dirección de marca', 'Una conversación para reconocer qué está disperso y por dónde empezar.', 'mailto:comunicaconvicky@gmail.com?subject=Mi%20marca%20necesita%20una%20direcci%C3%B3n%20clara', 'Hablar con Vicky']
    ]
  }
};

const getViviContext = (question) => {
  const text = question.toLocaleLowerCase('es');
  const productMatch = question.match(/(?:vender|vendo|ofrecer|comercializar)\s+(?:(?:mis|una|un|las|los|la|el)\s+)?([^,.!?]+)/i);
  const product = productMatch?.[1]
    ?.replace(/\s+(?:en|por|para|con|desde)\s+.*$/i, '')
    .trim()
    .slice(0, 60);

  return {
    text,
    product,
    website: /p[aá]gina|web|sitio|e-?commerce|tienda online|landing/.test(text),
    sales: /vend|venta|compr|factur|cliente|revenue|roi|convert/.test(text)
  };
};

const buildViviGuidance = (pathName, question) => {
  const path = viviPaths[pathName] || viviPaths.idea;
  const context = getViviContext(question);
  let response = path.response;
  let cards = path.cards;

  if (pathName === 'launch' && context.website && context.sales) {
    response = `Para lanzar una página que venda ${context.product || 'tu propuesta'}, primero definí qué la vuelve elegible y para quién. Después ordená el recorrido de compra, los mensajes y la confianza.`;
    cards = [
      ['Servicio', 'Copywriting y arquitectura de contenidos', 'Para construir la propuesta, el recorrido y los textos de la página.', '#servicios', 'Ver el servicio'],
      ['Servicio', 'Estrategia y posicionamiento orgánico', 'Para conectar contenidos, búsqueda, distribución y visibilidad.', '#servicios', 'Ver el servicio'],
      ['Orientación', 'Diseñar el sistema de lanzamiento', 'Revisar la idea, la oferta y lo necesario para que la página pueda vender.', 'mailto:comunicaconvicky@gmail.com?subject=Quiero%20lanzar%20una%20p%C3%A1gina%20para%20vender', 'Hablar con Vicky']
    ];
  } else if (pathName === 'launch' && context.website) {
    response = 'Para lanzar esa página, primero hay que definir qué tiene que entender y hacer la persona que entra. Después se ordenan la arquitectura, los mensajes, la prueba y el recorrido; el diseño viene a darle forma a ese sistema.';
  }

  return { response, cards };
};

const inferViviPath = (question) => {
  const { text, website, sales } = getViviContext(question);
  if (website && (sales || /lanz|crear|hacer|armar|necesit/.test(text))) return 'launch';
  if (/seo|aso|posicion|visib|alcance|seguidores|org[aá]nic/.test(text)) return 'positioning';
  if (/lanz|salir|publicar|presentar|campaña|campa[nñ]a/.test(text)) return 'launch';
  if (/desorden|mensaje|contenido|canal|estructura|clar/.test(text)) return 'order';
  if (/direcci|identidad|marca|equipo|criterio/.test(text)) return 'direction';
  if (/empez|inicio|arranc|primer paso|no s[eé] por d[oó]nde/.test(text)) return 'start';
  return 'idea';
};

const renderViviPath = (pathName, question) => {
  const guidance = buildViviGuidance(pathName, question || viviPaths[pathName]?.prompt || '');
  if (!viviResults || !viviResponse || !viviResultsSection) return;

  viviResponse.textContent = guidance.response;
  viviResults.replaceChildren(...guidance.cards.map(([type, title, description, href, label]) => {
    const article = document.createElement('article');
    article.className = 'vivi-result-card';
    article.innerHTML = `<p>${type}</p><h4>${title}</h4><span>${description}</span><a href="${href}" data-vivi-leave>${label} <b aria-hidden="true">↗</b></a>`;
    return article;
  }));
  viviResultsSection.hidden = false;
  requestAnimationFrame(() => viviResultsSection.scrollIntoView({ behavior: reducedMotion.matches ? 'auto' : 'smooth', block: 'start' }));
};

const cycleViviPlaceholder = () => {
  if (!viviInput || viviInput.value || document.activeElement === viviInput) return;
  placeholderIndex = (placeholderIndex + 1) % viviPlaceholders.length;
  viviInput.classList.add('is-changing');
  setTimeout(() => {
    viviInput.placeholder = viviPlaceholders[placeholderIndex];
    viviInput.classList.remove('is-changing');
  }, 160);
};

const openVivi = (event) => {
  if (!viviUniverse) return;
  viviTrigger = event?.currentTarget || null;
  const triggerRect = viviTrigger?.getBoundingClientRect();
  const originX = triggerRect ? triggerRect.left + (triggerRect.width / 2) : innerWidth * .78;
  const originY = triggerRect ? triggerRect.top + (triggerRect.height / 2) : innerHeight * .3;
  viviUniverse.style.setProperty('--vivi-origin-x', `${originX}px`);
  viviUniverse.style.setProperty('--vivi-origin-y', `${originY}px`);
  viviUniverse.classList.add('is-open');
  viviUniverse.setAttribute('aria-hidden', 'false');
  viviUniverse.removeAttribute('inert');
  viviTrigger?.setAttribute('aria-expanded', 'true');
  document.body.classList.add('is-vivi-open');
  clearInterval(placeholderTimer);
  placeholderTimer = setInterval(cycleViviPlaceholder, 3600);
  setTimeout(() => viviInput?.focus(), reducedMotion.matches ? 0 : 540);
};

const closeVivi = () => {
  viviUniverse?.classList.remove('is-open');
  viviUniverse?.setAttribute('aria-hidden', 'true');
  viviUniverse?.setAttribute('inert', '');
  viviTrigger?.setAttribute('aria-expanded', 'false');
  document.body.classList.remove('is-vivi-open');
  clearInterval(placeholderTimer);
  viviTrigger?.focus();
};

const systemSection = document.querySelector('.system');
const systemHeader = systemSection?.querySelector('.system__header');
const systemRoutes = systemSection?.querySelector('.system__routes');
const systemRouteLeft = systemSection?.querySelector('.system-route--left');
const systemRouteCenter = systemSection?.querySelector('.system-route--center');
const systemRouteRight = systemSection?.querySelector('.system-route--right');
const systemMoves = [...(systemSection?.querySelectorAll('.system-move') || [])];
const systemFoundations = systemSection?.querySelector('.system__foundations');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');

const clamp01 = (value) => Math.min(1, Math.max(0, value));
const segment = (value, start, end) => clamp01((value - start) / (end - start));

const renderSystem = () => {
  if (!systemSection) return;

  const rect = systemSection.getBoundingClientRect();
  const start = innerHeight * .9;
  const end = innerHeight * .05;
  const progress = reducedMotion.matches ? 1 : clamp01((start - rect.top) / (start - end));
  const headerProgress = segment(progress, 0, .22);
  const trunkProgress = segment(progress, .14, .32);
  const routeProgress = segment(progress, .24, .58);
  const foundationProgress = segment(progress, .72, 1);

  if (systemHeader) {
    systemHeader.style.opacity = headerProgress;
    systemHeader.style.transform = `translateY(${24 * (1 - headerProgress)}px) scale(${.985 + (.015 * headerProgress)})`;
  }

  systemRoutes?.style.setProperty('--system-trunk-progress', trunkProgress);
  if (systemRouteLeft) systemRouteLeft.style.clipPath = `inset(0 0 0 ${(1 - routeProgress) * 100}%)`;
  if (systemRouteCenter) systemRouteCenter.style.clipPath = `inset(0 0 ${(1 - routeProgress) * 100}% 0)`;
  if (systemRouteRight) systemRouteRight.style.clipPath = `inset(0 ${(1 - routeProgress) * 100}% 0 0)`;

  systemMoves.forEach((move, index) => {
    const moveProgress = segment(progress, .44 + (index * .05), .72 + (index * .05));
    move.style.opacity = moveProgress;
    move.style.transform = `translateY(${18 * (1 - moveProgress)}px)`;
  });

  if (systemFoundations) {
    systemFoundations.style.opacity = foundationProgress;
    systemFoundations.style.transform = `translateY(${16 * (1 - foundationProgress)}px)`;
  }
};

if (systemSection) document.documentElement.classList.add('has-scroll-reveal');

document.querySelectorAll('[data-vivi-open]').forEach((button) => button.addEventListener('click', openVivi));
viviUniverse?.querySelector('[data-vivi-close]')?.addEventListener('click', closeVivi);
viviForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const question = viviInput?.value.trim() || viviInput?.placeholder || viviPlaceholders[0];
  if (viviInput && !viviInput.value) viviInput.value = question;
  renderViviPath(inferViviPath(question), question);
});
viviUniverse?.querySelectorAll('[data-vivi-prompt]').forEach((button) => {
  button.addEventListener('click', () => {
    const pathName = button.dataset.viviPrompt;
    const path = viviPaths[pathName];
    if (viviInput && path) viviInput.value = path.prompt;
    renderViviPath(pathName, path?.prompt || '');
  });
});
viviUniverse?.querySelector('[data-vivi-reset]')?.addEventListener('click', () => {
  if (viviInput) viviInput.value = '';
  if (viviResultsSection) viviResultsSection.hidden = true;
  viviInput?.focus();
});
viviUniverse?.addEventListener('click', (event) => {
  if (event.target.closest('[data-vivi-leave]')) closeVivi();
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && viviUniverse?.classList.contains('is-open')) closeVivi();
  if (event.key !== 'Tab' || !viviUniverse?.classList.contains('is-open')) return;
  const focusable = [...viviUniverse.querySelectorAll('button,input,a[href]')].filter((element) => !element.disabled && !element.closest('[hidden]'));
  const first = focusable[0];
  const last = focusable.at(-1);
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last?.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first?.focus();
  }
});

render();
addEventListener('scroll', requestRender, { passive: true });
addEventListener('resize', requestRender, { passive: true });
