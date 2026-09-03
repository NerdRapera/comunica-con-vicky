const nav = document.querySelector('.nav');
const onScroll = () => nav?.classList.toggle('scrolled', window.scrollY > 24);
onScroll();
addEventListener('scroll', onScroll, { passive: true });

const systemSection = document.querySelector('#pilares');
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
const updateSystemFlow = () => {
  if (!systemSection) return;
  if (reduceMotion.matches) {
    systemSection.style.setProperty('--system-progress', '1');
    systemSection.classList.add('is-unfolding');
    return;
  }
  const rect = systemSection.getBoundingClientRect();
  const viewport = innerHeight || document.documentElement.clientHeight;
  const start = viewport * .52;
  const distance = Math.max(480, Math.min(900, rect.height * .58));
  const progress = Math.max(0, Math.min(1, (start - rect.top) / distance));
  systemSection.style.setProperty('--system-progress', progress.toFixed(3));
  systemSection.classList.toggle('is-unfolding', progress > 0);
};
updateSystemFlow();
addEventListener('scroll', updateSystemFlow, { passive:true });
addEventListener('resize', updateSystemFlow, { passive:true });
reduceMotion.addEventListener?.('change', updateSystemFlow);

const layoutEditor = (() => {
  const toggle = document.querySelector('#layout-editor-toggle');
  const panel = document.querySelector('#layout-editor-panel');
  const scaleInput = document.querySelector('#layout-editor-scale');
  const scaleValue = document.querySelector('#layout-editor-scale-value');
  const textControls = document.querySelector('#layout-editor-text-controls');
  const textInput = document.querySelector('#layout-editor-text');
  const fontInput = document.querySelector('#layout-editor-font');
  const fontSizeInput = document.querySelector('#layout-editor-font-size');
  const fontSizeValue = document.querySelector('#layout-editor-font-size-value');
  const weightInput = document.querySelector('#layout-editor-weight');
  const trackingInput = document.querySelector('#layout-editor-tracking');
  const trackingValue = document.querySelector('#layout-editor-tracking-value');
  const uppercaseInput = document.querySelector('#layout-editor-uppercase');
  const coralControls = document.querySelector('#layout-editor-coral-controls');
  const sizeControls = document.querySelector('#layout-editor-size-controls');
  const boxWidthInput = document.querySelector('#layout-editor-box-width');
  const boxWidthValue = document.querySelector('#layout-editor-box-width-value');
  const boxHeightInput = document.querySelector('#layout-editor-box-height');
  const boxHeightValue = document.querySelector('#layout-editor-box-height-value');
  const opacityInput = document.querySelector('#layout-editor-opacity');
  const opacityValue = document.querySelector('#layout-editor-opacity-value');
  const widthInput = document.querySelector('#layout-editor-width');
  const widthValue = document.querySelector('#layout-editor-width-value');
  const heightInput = document.querySelector('#layout-editor-height');
  const heightValue = document.querySelector('#layout-editor-height-value');
  const rotateInput = document.querySelector('#layout-editor-rotate');
  const rotateValue = document.querySelector('#layout-editor-rotate-value');
  const lockRatioInput = document.querySelector('#layout-editor-lock-ratio');
  const reset = document.querySelector('#layout-editor-reset');
  const hide = document.querySelector('#layout-editor-hide');
  const done = document.querySelector('#layout-editor-done');
  const status = document.querySelector('#layout-editor-status');
  const storageKey = 'ccv-hero-layout-v1';
  const definitions = [
    ['nav-brand', '.nav__brand', 'Marca del menú', 'text'],
    ['nav-links', '.nav__links', 'Enlaces del menú'],
    ['identity', '.hero-identity', 'Identidad'],
    ['brand', '.hero-brand', 'Comunica con Vicky', 'text'],
    ['specialty', '.hero-specialty', 'Especialidad', 'text'],
    ['headline', '#hero-title', 'Titular', 'headline'],
    ['audience', '.hero-original-copy .lead', 'Audiencia', 'text'],
    ['actions', '.hero-actions', 'Botones'],
    ['vivi', '.hero-original-visual', 'Vivi'],
    ['coral', '.pillars-coral-image', 'Coral completo', 'coral'],
    ['coral-imagine', '.coral-branch--imagine', 'Rama: Imaginar', 'text'],
    ['coral-build', '.coral-branch--build', 'Rama: Construir', 'text'],
    ['coral-direct', '.coral-branch--direct', 'Rama: Dirigir', 'text'],
    ['system-title', '.system-intro__copy .kicker', 'Título: Mi sistema', 'text'],
    ['system-transition', '.system-transition', 'Frase de transición', 'text'],
    ['pillar-imagination', '.pillar-grid--editorial .pillar:nth-child(1)', 'Ficha: Imaginación'],
    ['pillar-strategy', '.pillar-grid--editorial .pillar:nth-child(2)', 'Ficha: Estrategia'],
    ['pillar-adaptation', '.pillar-grid--editorial .pillar:nth-child(3)', 'Ficha: Adaptación'],
    ['root-imagination', '.pillar-root--imagination', 'Raíz: Imaginación', 'coral'],
    ['root-strategy', '.pillar-root--strategy', 'Raíz: Estrategia', 'coral'],
    ['root-adaptation', '.pillar-root--adaptation', 'Raíz: Adaptación', 'coral'],
    ['imagination-title', '.pillar-grid--editorial .pillar:nth-child(1) h3', 'Texto: Imaginación', 'text'],
    ['strategy-title', '.pillar-grid--editorial .pillar:nth-child(2) h3', 'Texto: Estrategia', 'text'],
    ['adaptation-title', '.pillar-grid--editorial .pillar:nth-child(3) h3', 'Texto: Adaptación', 'text'],
    ['imagination-copy', '.pillar-grid--editorial .pillar:nth-child(1) p', 'Descripción: Imaginación', 'text'],
    ['strategy-copy', '.pillar-grid--editorial .pillar:nth-child(2) p', 'Descripción: Estrategia', 'text'],
    ['adaptation-copy', '.pillar-grid--editorial .pillar:nth-child(3) p', 'Descripción: Adaptación', 'text'],
    ['imagination-number', '.pillar-grid--editorial .pillar:nth-child(1) .pillar__number', 'Número 01', 'text'],
    ['strategy-number', '.pillar-grid--editorial .pillar:nth-child(2) .pillar__number', 'Número 02', 'text'],
    ['adaptation-number', '.pillar-grid--editorial .pillar:nth-child(3) .pillar__number', 'Número 03', 'text'],
    ['imagination-verb', '.pillar-grid--editorial .pillar:nth-child(1) .pillar__verb', 'Verbo: Imaginar', 'text'],
    ['strategy-verb', '.pillar-grid--editorial .pillar:nth-child(2) .pillar__verb', 'Verbo: Construir', 'text'],
    ['adaptation-verb', '.pillar-grid--editorial .pillar:nth-child(3) .pillar__verb', 'Verbo: Dirigir', 'text'],
    ['work-heading', '.work .section-head h2', 'Título de proyectos', 'text'],
    ['work-intro', '.work .section-head > p', 'Introducción de proyectos', 'text'],
    ['case-cognition', '.case-feature', 'Caso Cognition'],
    ['case-marcela', '.case-mini:nth-child(1)', 'Caso Marcela Segura'],
    ['case-klauss', '.case-mini:nth-child(2)', 'Caso Klauss'],
    ['about-heading', '.about h2', 'Título sobre mí', 'text'],
    ['about-photo', '.about figure', 'Fotografía de Vicky'],
    ['about-copy', '.about__copy > p:not(.kicker)', 'Descripción sobre mí', 'text'],
    ['about-links', '.about__links', 'Enlaces sobre mí'],
    ['contact-heading', '.contact h2', 'Título de contacto', 'text'],
    ['contact-lead', '.contact__lead', 'Texto de contacto', 'text'],
    ['contact-actions', '.contact__actions', 'Acciones de contacto'],
    ['footer', '.footer__inner', 'Pie de página']
  ];

  if (!toggle || !panel || !scaleInput) return;

  const items = new Map();
  let selected = null;
  let editing = false;
  let drag = null;

  const readSaved = () => {
    try { return JSON.parse(localStorage.getItem(storageKey) || '{}'); }
    catch { return {}; }
  };

  let saved = readSaved();

  const applyItem = (id) => {
    const item = items.get(id);
    const value = saved[id] || { x: 0, y: 0, scale: 100 };
    if (value.text !== undefined) {
      if (id === 'headline') {
        const lines = String(value.text).split('\n').filter(Boolean);
        item.replaceChildren(...lines.map((line) => {
          const span = document.createElement('span');
          span.textContent = line;
          return span;
        }));
      } else {
        item.textContent = value.text;
      }
    }
    item.style.translate = `${value.x || 0}px ${value.y || 0}px`;
    item.style.scale = `${(value.scale || 100) / 100}`;
    const mainCoralScale = value.proportionalScale || value.scaleX || value.scaleY || 100;
    const scaleX = id === 'coral' ? mainCoralScale : (value.scaleX || 100);
    const scaleY = id === 'coral' ? mainCoralScale : (value.scaleY || 100);
    item.style.setProperty('--editor-scale-x', `${scaleX / 100}`);
    item.style.setProperty('--editor-scale-y', `${scaleY / 100}`);
    item.style.rotate = value.rotate ? `${value.rotate}deg` : '';
    item.style.fontFamily = value.fontFamily || '';
    item.style.fontSize = value.fontSize ? `${value.fontSize}px` : '';
    item.style.fontWeight = value.fontWeight || '';
    item.style.letterSpacing = value.tracking !== undefined ? `${value.tracking}px` : '';
    item.style.textTransform = value.uppercase ? 'uppercase' : '';
    item.style.width = value.boxWidth ? `${value.boxWidth}%` : '';
    item.style.height = value.boxHeight ? `${value.boxHeight}px` : '';
    item.style.opacity = value.opacity !== undefined ? `${value.opacity / 100}` : '';
    item.style.visibility = value.hidden ? 'hidden' : '';
  };

  const persist = () => localStorage.setItem(storageKey, JSON.stringify(saved));

  definitions.forEach(([id, selector, label, editType]) => {
    const item = document.querySelector(selector);
    if (!item) return;
    item.dataset.layoutId = id;
    item.dataset.layoutLabel = label;
    if (editType) item.dataset.layoutText = editType;
    items.set(id, item);
    applyItem(id);
  });

  const currentText = (item) => {
    if (item.dataset.layoutText === 'headline') {
      return [...item.querySelectorAll(':scope > span')].map((span) => span.textContent).join('\n');
    }
    return item.textContent.trim();
  };

  const choose = (item) => {
    selected?.classList.remove('layout-selected');
    selected = item;
    selected.classList.add('layout-selected');
    const id = selected.dataset.layoutId;
    const value = saved[id] || { x: 0, y: 0, scale: 100 };
    scaleInput.value = value.scale || 100;
    scaleValue.textContent = `${scaleInput.value}%`;
    status.textContent = `${selected.dataset.layoutLabel}: arrastrá para mover`;
    const canEditText = Boolean(selected.dataset.layoutText);
    const isCoral = selected.dataset.layoutText === 'coral';
    textControls.hidden = !canEditText || isCoral;
    coralControls.hidden = !isCoral;
    sizeControls.hidden = false;
    boxWidthInput.value = value.boxWidth || 100;
    boxWidthValue.textContent = value.boxWidth ? `${value.boxWidth}%` : 'Automático';
    boxHeightInput.value = value.boxHeight || Math.max(40, Math.min(900, Math.round(selected.getBoundingClientRect().height)));
    boxHeightValue.textContent = value.boxHeight ? `${value.boxHeight}px` : 'Automática';
    opacityInput.value = value.opacity ?? 100;
    opacityValue.textContent = `${opacityInput.value}%`;
    hide.textContent = value.hidden ? 'Mostrar elemento' : 'Ocultar elemento';
    if (isCoral) {
      const mainCoralScale = value.proportionalScale || value.scaleX || value.scaleY || 100;
      lockRatioInput.checked = id === 'coral' ? true : value.lockRatio !== false;
      lockRatioInput.disabled = id === 'coral';
      widthInput.value = id === 'coral' ? mainCoralScale : (value.scaleX || 100);
      widthValue.textContent = `${widthInput.value}%`;
      heightInput.value = id === 'coral' ? mainCoralScale : (value.scaleY || 100);
      heightValue.textContent = `${heightInput.value}%`;
      rotateInput.value = value.rotate || 0;
      rotateValue.textContent = `${rotateInput.value}°`;
    }
    if (canEditText && !isCoral) {
      const computed = getComputedStyle(selected);
      textInput.value = value.text !== undefined ? value.text : currentText(selected);
      fontInput.value = value.fontFamily || '';
      fontSizeInput.value = value.fontSize || Math.round(parseFloat(computed.fontSize));
      fontSizeValue.textContent = `${fontSizeInput.value}px`;
      weightInput.value = value.fontWeight || '';
      trackingInput.value = value.tracking !== undefined ? value.tracking : Math.max(-4, Math.min(12, parseFloat(computed.letterSpacing) || 0));
      trackingValue.textContent = `${trackingInput.value}px`;
      uppercaseInput.checked = Boolean(value.uppercase);
    }
  };

  const setEditing = (next) => {
    editing = next;
    document.body.classList.toggle('layout-editing', editing);
    panel.hidden = !editing;
    toggle.textContent = editing ? 'Ocultar editor' : 'Editar diseño';
    toggle.setAttribute('aria-expanded', String(editing));
    if (!editing) {
      selected?.classList.remove('layout-selected');
      selected = null;
      textControls.hidden = true;
      coralControls.hidden = true;
      sizeControls.hidden = true;
    }
  };

  toggle.addEventListener('click', () => setEditing(!editing));
  done.addEventListener('click', () => setEditing(false));

  items.forEach((item) => {
    item.addEventListener('pointerdown', (event) => {
      if (!editing) return;
      event.preventDefault();
      event.stopPropagation();
      choose(item);
      const id = item.dataset.layoutId;
      const value = saved[id] || { x: 0, y: 0, scale: 100 };
      drag = { id, pointerId: event.pointerId, startX: event.clientX, startY: event.clientY, x: value.x || 0, y: value.y || 0 };
      item.setPointerCapture(event.pointerId);
    });

    item.addEventListener('pointermove', (event) => {
      if (!editing || !drag || drag.pointerId !== event.pointerId) return;
      const value = saved[drag.id] || { scale: 100 };
      value.x = Math.round(drag.x + event.clientX - drag.startX);
      value.y = Math.round(drag.y + event.clientY - drag.startY);
      saved[drag.id] = value;
      applyItem(drag.id);
    });

    const finishDrag = (event) => {
      if (!drag || drag.pointerId !== event.pointerId) return;
      persist();
      drag = null;
      status.textContent = `${item.dataset.layoutLabel}: posición guardada`;
    };
    item.addEventListener('pointerup', finishDrag);
    item.addEventListener('pointercancel', finishDrag);
  });

  scaleInput.addEventListener('input', () => {
    if (!selected) {
      status.textContent = 'Primero seleccioná un elemento';
      return;
    }
    const id = selected.dataset.layoutId;
    const value = saved[id] || { x: 0, y: 0 };
    value.scale = Number(scaleInput.value);
    saved[id] = value;
    applyItem(id);
    persist();
    scaleValue.textContent = `${value.scale}%`;
    status.textContent = `${selected.dataset.layoutLabel}: ${value.scale}%`;
  });

  const updateBox = (property, value) => {
    if (!selected) return;
    const id = selected.dataset.layoutId;
    const itemValue = saved[id] || { x:0, y:0, scale:100 };
    itemValue[property] = value;
    saved[id] = itemValue;
    applyItem(id);
    persist();
  };
  boxWidthInput.addEventListener('input', () => {
    boxWidthValue.textContent = `${boxWidthInput.value}%`;
    updateBox('boxWidth', Number(boxWidthInput.value));
  });
  boxHeightInput.addEventListener('input', () => {
    boxHeightValue.textContent = `${boxHeightInput.value}px`;
    updateBox('boxHeight', Number(boxHeightInput.value));
  });
  opacityInput.addEventListener('input', () => {
    opacityValue.textContent = `${opacityInput.value}%`;
    updateBox('opacity', Number(opacityInput.value));
  });
  hide.addEventListener('click', () => {
    if (!selected) {
      status.textContent = 'Primero seleccioná un elemento';
      return;
    }
    const id = selected.dataset.layoutId;
    const itemValue = saved[id] || { x:0, y:0, scale:100 };
    itemValue.hidden = !itemValue.hidden;
    saved[id] = itemValue;
    applyItem(id);
    persist();
    hide.textContent = itemValue.hidden ? 'Mostrar elemento' : 'Ocultar elemento';
    status.textContent = itemValue.hidden ? 'Elemento oculto. Podés recuperarlo con Restablecer.' : 'Elemento visible';
  });

  const updateTextStyle = (property, value) => {
    if (!selected || !selected.dataset.layoutText) return;
    const id = selected.dataset.layoutId;
    const itemValue = saved[id] || { x: 0, y: 0, scale: 100 };
    itemValue[property] = value;
    saved[id] = itemValue;
    applyItem(id);
    persist();
  };

  textInput.addEventListener('input', () => updateTextStyle('text', textInput.value));
  fontInput.addEventListener('change', () => updateTextStyle('fontFamily', fontInput.value));
  fontSizeInput.addEventListener('input', () => {
    fontSizeValue.textContent = `${fontSizeInput.value}px`;
    updateTextStyle('fontSize', Number(fontSizeInput.value));
  });
  weightInput.addEventListener('change', () => updateTextStyle('fontWeight', weightInput.value));
  trackingInput.addEventListener('input', () => {
    trackingValue.textContent = `${trackingInput.value}px`;
    updateTextStyle('tracking', Number(trackingInput.value));
  });
  uppercaseInput.addEventListener('change', () => updateTextStyle('uppercase', uppercaseInput.checked));
  const updateCoral = (property, value) => {
    if (!selected || selected.dataset.layoutText !== 'coral') return;
    const id = selected.dataset.layoutId;
    const itemValue = saved[id] || { x: 0, y: 0, scale: 100 };
    const isDimension = property === 'scaleX' || property === 'scaleY';
    if (isDimension && (id === 'coral' || lockRatioInput.checked)) {
      itemValue.proportionalScale = value;
      itemValue.scaleX = value;
      itemValue.scaleY = value;
      widthInput.value = value;
      heightInput.value = value;
      widthValue.textContent = `${value}%`;
      heightValue.textContent = `${value}%`;
    } else {
      itemValue[property] = value;
    }
    saved[id] = itemValue;
    applyItem(id);
    persist();
  };
  widthInput.addEventListener('input', () => {
    widthValue.textContent = `${widthInput.value}%`;
    updateCoral('scaleX', Number(widthInput.value));
  });
  heightInput.addEventListener('input', () => {
    heightValue.textContent = `${heightInput.value}%`;
    updateCoral('scaleY', Number(heightInput.value));
  });
  rotateInput.addEventListener('input', () => {
    rotateValue.textContent = `${rotateInput.value}°`;
    updateCoral('rotate', Number(rotateInput.value));
  });
  lockRatioInput.addEventListener('change', () => {
    if (!selected || selected.dataset.layoutText !== 'coral') return;
    const id = selected.dataset.layoutId;
    const itemValue = saved[id] || { x:0, y:0, scale:100 };
    itemValue.lockRatio = lockRatioInput.checked;
    if (lockRatioInput.checked) {
      const value = Number(widthInput.value);
      itemValue.proportionalScale = value;
      itemValue.scaleX = value;
      itemValue.scaleY = value;
      heightInput.value = value;
      heightValue.textContent = `${value}%`;
    }
    saved[id] = itemValue;
    applyItem(id);
    persist();
  });

  reset.addEventListener('click', () => {
    saved = {};
    localStorage.removeItem(storageKey);
    items.forEach((_, id) => applyItem(id));
    items.get('brand').textContent = 'Comunica con Vicky';
    items.get('specialty').textContent = 'Dirección creativa & copywriting';
    items.get('headline').replaceChildren(
      Object.assign(document.createElement('span'), { textContent: 'Transformo ideas complejas' }),
      Object.assign(document.createElement('span'), { textContent: 'en sistemas coherentes.' })
    );
    items.get('audience').textContent = 'Para que tu audiencia te vea, te escuche y te entienda.';
    scaleInput.value = 100;
    scaleValue.textContent = '100%';
    textControls.hidden = true;
    sizeControls.hidden = true;
    status.textContent = 'Diseño original restablecido';
  });
})();
