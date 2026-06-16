/* ================================================================
   CORESTACK — DOCUMENT EDITOR  v4
   · Edición WYSIWYG (click en cualquier texto)
   · Eliminar / duplicar bloques con botones ✕ ⧉
   · Eliminar / duplicar PÁGINAS completas
   · Deshacer con Ctrl+Z o botón toast
   · Exportar PDF
   ================================================================ */

(function () {
  'use strict';

  // ── Selectores ────────────────────────────────────────────────────
  const EDITABLE_SELECTORS = [
    '.cover-eyebrow', '.cover-title', '.cover-subtitle',
    '.cover-meta-value', '.cover-footer-brand', '.cover-footer-contact',
    '.content h1', '.content h2', '.content h3',
    '.content p', '.content li', '.content td', '.content th',
    '.card-title', '.card-body', '.card-tag',
    '.kpi-val', '.kpi-label', '.kpi-sub',
    '.tl-date', '.tl-title', '.tl-body',
    '.callout-title', '.callout p', '.callout-body p',
    '.highlight p', '.hl-eyebrow',
    '.sig-name', '.sig-role', '.sig-company',
    '.scope-title', '.scope-box li',
    '.toc-label', '.toc-num', '.toc-pg',
    '.arch-layer-title', '.chip', '.badge',
    '.exec-col p', '.exec-list li',
    '.page-header-doc', '.page-header-sub',
    '.party-name', '.party-detail',
    '.clause-num', '.clause p', '.clause li',
    'table td', 'table th',
    '.lp-name', '.lp-specs', '.lp-use', '.logo-label',
    '.swatch-name', '.swatch-use',
    '.type-meta', '.sig-name-val', '.sig-sub', '.sig-name-label',
  ].join(', ');

  // Bloques que se pueden eliminar completos
  const DELETABLE_SELECTORS = [
    '.card', '.kpi', '.tl-item', '.toc-item',
    '.callout', '.highlight', '.clause',
    '.sig', '.scope-box',
    'tbody tr', '.arch-layer',
    '.card-grid', '.kpi-grid',
    '.lp-card', '.icon-card', '.logo-box',
    '.swatch', '.type-sample',
    '.cover-meta-item',
    '.content h2', '.content h3', '.content p',
    '.content li', '.two-col > div', '.col-6040 > div',
    '.do-box', '.dont-box',
  ].join(', ');

  let editMode = false;
  let editableEls = [];
  const undoStack = []; // { el, parent, nextSibling }
  let draggedPage = null;

  // ── Estilos ────────────────────────────────────────────────────────
  const style = document.createElement('style');
  style.textContent = `
    /* FAB container */
    #cs-edit-fab {
      position: fixed;
      bottom: 1.5rem; right: 1.5rem;
      z-index: 9999;
      display: flex; flex-direction: column;
      align-items: flex-end; gap: 0.5rem;
    }
    @media print { #cs-edit-fab, #cs-edit-banner, #cs-toast { display: none !important; } }

    .cs-fab-btn {
      border: none; border-radius: 28px;
      font-family: 'Inter', system-ui, sans-serif;
      font-size: 9pt; font-weight: 700; cursor: pointer;
      padding: 0.6rem 1.2rem;
      display: flex; align-items: center; gap: 0.45rem;
      box-shadow: 0 4px 20px rgba(0,0,0,0.3);
      transition: all 0.18s; white-space: nowrap;
    }
    #cs-btn-edit   { background: #00AEEF; color: #fff; }
    #cs-btn-edit:hover   { background: #0099D6; transform: translateY(-1px); }
    #cs-btn-edit.active  { background: #F97316; }
    #cs-btn-edit.active:hover { background: #e86305; }
    #cs-btn-print  { background: #0D1321; color: #fff; border: 1px solid rgba(0,174,239,0.3); }
    #cs-btn-print:hover  { background: #162030; transform: translateY(-1px); }

    /* Texto editable */
    .cs-editable-on [contenteditable="true"] {
      outline: none; border-radius: 3px;
      transition: background 0.15s, box-shadow 0.15s;
      cursor: text;
    }
    .cs-editable-on [contenteditable="true"]:hover {
      background: rgba(0,174,239,0.08) !important;
      box-shadow: 0 0 0 1.5px rgba(0,174,239,0.35);
    }
    .cs-editable-on [contenteditable="true"]:focus {
      background: rgba(0,174,239,0.12) !important;
      box-shadow: 0 0 0 2px #00AEEF;
      position: relative; z-index: 10;
    }

    /* Bloques eliminables */
    .cs-editable-on .cs-deletable {
      position: relative;
    }
    .cs-editable-on .cs-deletable:hover > .cs-del-btn {
      opacity: 1; pointer-events: all;
    }

    /* Botones de acción sobre bloques */
    .cs-block-actions {
      position: absolute;
      top: -10px; right: -8px;
      display: flex; gap: 4px;
      z-index: 50;
      opacity: 0; pointer-events: none;
      transition: opacity 0.15s;
    }
    .cs-editable-on .cs-deletable:hover > .cs-block-actions {
      opacity: 1; pointer-events: all;
    }

    .cs-del-btn, .cs-dup-btn {
      width: 22px; height: 22px;
      border: 2px solid #fff;
      border-radius: 50%;
      font-size: 10px; font-weight: 900;
      cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      transition: transform 0.15s;
      box-shadow: 0 2px 8px rgba(0,0,0,0.25);
      line-height: 1; color: #fff;
    }
    .cs-del-btn { background: #EF4444; }
    .cs-del-btn:hover { transform: scale(1.15); background: #DC2626; }
    .cs-dup-btn { background: #00AEEF; }
    .cs-dup-btn:hover { transform: scale(1.15); background: #0099D6; }

    /* Eliminación animada */
    .cs-removing {
      animation: cs-fadeout 0.2s ease forwards;
    }
    @keyframes cs-fadeout {
      to { opacity: 0; transform: scale(0.97); }
    }

    /* Banner de modo edición */
    #cs-edit-banner {
      position: fixed; top: 0; left: 0; right: 0;
      background: #F97316; color: #fff;
      text-align: center;
      font-family: 'Inter', system-ui, sans-serif;
      font-size: 8.5pt; font-weight: 700;
      padding: 0.35rem; z-index: 9997;
      letter-spacing: 0.05em; display: none;
    }
    #cs-edit-banner.visible { display: block; }

    /* Toast (deshacer) */
    #cs-toast {
      position: fixed; bottom: 6rem; right: 1.5rem;
      background: #1E293B; color: #fff;
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 10px; padding: 0.65rem 1rem;
      font-family: 'Inter', system-ui, sans-serif;
      font-size: 8.5pt; z-index: 9998;
      display: flex; align-items: center; gap: 0.75rem;
      box-shadow: 0 8px 24px rgba(0,0,0,0.3);
      transform: translateY(8px); opacity: 0;
      transition: all 0.2s; pointer-events: none;
    }
    #cs-toast.show { transform: translateY(0); opacity: 1; pointer-events: all; }
    #cs-toast button {
      background: #00AEEF; color: #fff; border: none;
      border-radius: 5px; padding: 3px 10px;
      font-size: 8pt; font-weight: 700; cursor: pointer;
    }
    #cs-toast button:hover { background: #0099D6; }

    /* Acciones de página completa */
    .cs-editable-on .page { position: relative; }
    .cs-page-actions {
      position: absolute;
      top: 10px; right: 10px;
      display: flex; gap: 6px;
      z-index: 200;
      opacity: 0; pointer-events: none;
      transition: opacity 0.15s;
    }
    .cs-editable-on .page:hover > .cs-page-actions {
      opacity: 1; pointer-events: all;
    }
    .cs-page-btn {
      border: none; border-radius: 8px;
      font-family: 'Inter', system-ui, sans-serif;
      font-size: 7.5pt; font-weight: 700; cursor: pointer;
      padding: 5px 10px;
      display: flex; align-items: center; gap: 4px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.3);
      transition: all 0.15s; color: #fff; white-space: nowrap;
    }
    .cs-page-drag-btn { background: rgba(100,116,139,0.88); cursor: grab; }
    .cs-page-drag-btn:hover { background: #64748B; transform: scale(1.04); }
    .cs-page-drag-btn:active { cursor: grabbing; }
    .cs-page-dup-btn { background: rgba(0,174,239,0.88); }
    .cs-page-dup-btn:hover { background: #00AEEF; transform: scale(1.04); }
    .cs-page-del-btn { background: rgba(239,68,68,0.88); }
    .cs-page-del-btn:hover { background: #EF4444; transform: scale(1.04); }
    @media print { .cs-page-actions { display: none !important; } }

    /* Reordenar páginas por arrastre */
    .cs-editable-on .page.cs-dragging { opacity: 0.35; }
    .cs-editable-on .page.cs-drop-before,
    .cs-editable-on .page.cs-drop-after { position: relative; }
    .cs-editable-on .page.cs-drop-before::before,
    .cs-editable-on .page.cs-drop-after::after {
      content: '';
      position: absolute;
      left: 0; right: 0;
      height: 5px;
      background: #00AEEF;
      z-index: 300;
      box-shadow: 0 0 14px 2px rgba(0,174,239,0.7);
      pointer-events: none;
    }
    .cs-editable-on .page.cs-drop-before::before { top: 0; }
    .cs-editable-on .page.cs-drop-after::after { bottom: 0; }

    /* Tooltip */
    .cs-tooltip {
      position: fixed; bottom: 8rem; right: 1.5rem;
      background: #081A2E; border: 1px solid rgba(0,174,239,0.25);
      border-radius: 10px; padding: 0.85rem 1rem;
      font-family: 'Inter', system-ui, sans-serif;
      font-size: 8pt; color: rgba(255,255,255,0.7);
      width: 260px; box-shadow: 0 8px 32px rgba(0,0,0,0.3);
      z-index: 9998; line-height: 1.65; display: none;
    }
    .cs-tooltip.visible { display: block; }
    .cs-tooltip strong { color: #00AEEF; }
  `;
  document.head.appendChild(style);

  // ── DOM ────────────────────────────────────────────────────────────
  const fab = document.createElement('div');
  fab.id = 'cs-edit-fab';
  fab.innerHTML = `
    <div class="cs-tooltip" id="cs-tooltip">
      <strong>Modo edición activo</strong><br/>
      • Clic en <strong>cualquier texto</strong> para editar<br/>
      • Hover en bloque → <strong style="color:#00AEEF">⧉</strong> duplicar · <strong style="color:#EF4444">✕</strong> eliminar<br/>
      • Hover en <strong>página</strong> → botones en esquina sup. derecha<br/>
      • <strong>Ctrl+Z</strong> para deshacer · <strong>Escape</strong> para salir
    </div>
    <button class="cs-fab-btn" id="cs-btn-print">⬇ Exportar PDF</button>
    <button class="cs-fab-btn" id="cs-btn-edit">✏️ Editar documento</button>
  `;
  document.body.appendChild(fab);

  const banner = document.createElement('div');
  banner.id = 'cs-edit-banner';
  banner.textContent = '✏️  MODO EDICIÓN — Clic en texto · Hover en bloque o página → ⧉ duplicar · ✕ eliminar · Ctrl+Z deshacer · Escape salir';
  document.body.appendChild(banner);

  const toast = document.createElement('div');
  toast.id = 'cs-toast';
  toast.innerHTML = `<span id="cs-toast-msg">Bloque eliminado</span><button id="cs-toast-undo">↩ Deshacer</button>`;
  document.body.appendChild(toast);

  let toastTimer = null;

  const btnEdit  = document.getElementById('cs-btn-edit');
  const btnPrint = document.getElementById('cs-btn-print');
  const tooltip  = document.getElementById('cs-tooltip');
  const toastMsg = document.getElementById('cs-toast-msg');

  // ── Activar / desactivar modo edición ─────────────────────────────
  function enableEdit() {
    // Texto editable
    editableEls = Array.from(document.querySelectorAll(EDITABLE_SELECTORS));
    editableEls.forEach(el => {
      el.setAttribute('contenteditable', 'true');
      el.setAttribute('spellcheck', 'false');
    });

    // Bloques eliminables / duplicables
    document.querySelectorAll(DELETABLE_SELECTORS).forEach(el => {
      if (el.closest('#cs-edit-fab, #cs-edit-banner, #cs-toast')) return;
      el.classList.add('cs-deletable');
      if (!el.querySelector(':scope > .cs-block-actions')) {
        addBlockActions(el);
      }
    });

    // Páginas completas
    document.querySelectorAll('.pages .page').forEach(page => {
      if (!page.querySelector(':scope > .cs-page-actions')) {
        addPageActions(page);
      }
    });

    document.body.classList.add('cs-editable-on');
    editMode = true;
    btnEdit.textContent = '✓ Desactivar edición';
    btnEdit.classList.add('active');
    banner.classList.add('visible');
    tooltip.classList.add('visible');
    setTimeout(() => tooltip.classList.remove('visible'), 5000);
  }

  function disableEdit() {
    editableEls.forEach(el => {
      el.removeAttribute('contenteditable');
      el.blur();
    });
    document.querySelectorAll('.cs-deletable').forEach(el => {
      el.classList.remove('cs-deletable');
    });
    document.querySelectorAll('.cs-block-actions').forEach(btn => btn.remove());
    document.querySelectorAll('.cs-page-actions').forEach(el => el.remove());
    document.querySelectorAll('.cs-dragging').forEach(el => el.classList.remove('cs-dragging'));
    clearDropMarkers();
    stopAutoScroll();
    draggedPage = null;

    document.body.classList.remove('cs-editable-on');
    editMode = false;
    btnEdit.textContent = '✏️ Editar documento';
    btnEdit.classList.remove('active');
    banner.classList.remove('visible');
    tooltip.classList.remove('visible');
  }

  // ── Crear botones de acción en un bloque ─────────────────────────
  function addBlockActions(el) {
    const wrap = document.createElement('div');
    wrap.className = 'cs-block-actions';

    const dupBtn = document.createElement('button');
    dupBtn.className = 'cs-dup-btn';
    dupBtn.title = 'Duplicar bloque';
    dupBtn.textContent = '⧉';
    dupBtn.addEventListener('click', e => { e.stopPropagation(); duplicateBlock(el); });

    const delBtn = document.createElement('button');
    delBtn.className = 'cs-del-btn';
    delBtn.title = 'Eliminar bloque';
    delBtn.textContent = '✕';
    delBtn.addEventListener('click', e => { e.stopPropagation(); deleteBlock(el); });

    wrap.appendChild(dupBtn);
    wrap.appendChild(delBtn);
    el.appendChild(wrap);
  }

  // ── Crear botones de acción en una página completa ────────────────
  function addPageActions(page) {
    const wrap = document.createElement('div');
    wrap.className = 'cs-page-actions';

    const dragBtn = document.createElement('button');
    dragBtn.className = 'cs-page-btn cs-page-drag-btn';
    dragBtn.title = 'Arrastrar para reordenar';
    dragBtn.textContent = '⠿ Mover';
    dragBtn.setAttribute('draggable', 'true');
    dragBtn.addEventListener('dragstart', e => {
      draggedPage = page;
      page.classList.add('cs-dragging');
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', 'cs-page'); // requerido por Firefox
    });
    dragBtn.addEventListener('dragend', () => {
      page.classList.remove('cs-dragging');
      clearDropMarkers();
      stopAutoScroll();
      draggedPage = null;
    });

    const dupBtn = document.createElement('button');
    dupBtn.className = 'cs-page-btn cs-page-dup-btn';
    dupBtn.title = 'Duplicar página completa';
    dupBtn.textContent = '⧉ Duplicar página';
    dupBtn.addEventListener('click', e => { e.stopPropagation(); duplicatePage(page); });

    const delBtn = document.createElement('button');
    delBtn.className = 'cs-page-btn cs-page-del-btn';
    delBtn.title = 'Eliminar página completa';
    delBtn.textContent = '✕ Eliminar página';
    delBtn.addEventListener('click', e => { e.stopPropagation(); deletePage(page); });

    wrap.appendChild(dragBtn);
    wrap.appendChild(dupBtn);
    wrap.appendChild(delBtn);
    page.appendChild(wrap);
  }

  // ── Reordenar páginas por arrastre ─────────────────────────────────
  function clearDropMarkers() {
    document.querySelectorAll('.cs-drop-before, .cs-drop-after').forEach(el => {
      el.classList.remove('cs-drop-before', 'cs-drop-after');
    });
  }

  // Auto-scroll: si el cursor se acerca al borde superior/inferior de la
  // ventana mientras se arrastra, la página se desplaza sola para poder
  // alcanzar hojas que no entran en pantalla.
  const SCROLL_EDGE = 130;      // px desde el borde donde se activa el scroll
  const SCROLL_MAX_SPEED = 22;  // px por frame en el punto más cercano al borde
  let lastDragClientY = null;
  let autoScrollRAF = null;

  function autoScrollStep() {
    if (!draggedPage || lastDragClientY === null) {
      autoScrollRAF = null;
      return;
    }
    const vh = window.innerHeight;
    let dy = 0;

    if (lastDragClientY < SCROLL_EDGE) {
      const intensity = (SCROLL_EDGE - lastDragClientY) / SCROLL_EDGE;
      dy = -Math.ceil(intensity * SCROLL_MAX_SPEED);
    } else if (lastDragClientY > vh - SCROLL_EDGE) {
      const intensity = (lastDragClientY - (vh - SCROLL_EDGE)) / SCROLL_EDGE;
      dy = Math.ceil(intensity * SCROLL_MAX_SPEED);
    }

    if (dy !== 0) window.scrollBy(0, dy);
    autoScrollRAF = requestAnimationFrame(autoScrollStep);
  }

  function startAutoScroll() {
    if (autoScrollRAF === null) autoScrollRAF = requestAnimationFrame(autoScrollStep);
  }

  function stopAutoScroll() {
    if (autoScrollRAF !== null) {
      cancelAnimationFrame(autoScrollRAF);
      autoScrollRAF = null;
    }
    lastDragClientY = null;
  }

  function setupPageReorder() {
    const container = document.querySelector('.pages');
    if (!container) return;

    // Seguimiento de posición a nivel documento — funciona sin importar
    // qué elemento esté justo debajo del cursor (toolbar, hueco entre
    // páginas, etc.), para que el auto-scroll sea confiable.
    document.addEventListener('dragover', e => {
      if (!draggedPage) return;
      lastDragClientY = e.clientY;
      startAutoScroll();
    });

    container.addEventListener('dragover', e => {
      if (!draggedPage) return;
      const targetPage = e.target.closest('.page');
      if (!targetPage || targetPage === draggedPage) return;
      e.preventDefault();

      clearDropMarkers();
      const rect = targetPage.getBoundingClientRect();
      const before = (e.clientY - rect.top) < rect.height / 2;
      targetPage.classList.add(before ? 'cs-drop-before' : 'cs-drop-after');
    });

    container.addEventListener('drop', e => {
      if (!draggedPage) return;
      const targetPage = e.target.closest('.page');
      if (!targetPage || targetPage === draggedPage) return;
      e.preventDefault();

      const rect = targetPage.getBoundingClientRect();
      const before = (e.clientY - rect.top) < rect.height / 2;
      targetPage.parentNode.insertBefore(draggedPage, before ? targetPage : targetPage.nextSibling);

      clearDropMarkers();
      stopAutoScroll();
      renumberPages();
      showToast('Página reordenada');
    });
  }

  // ── Duplicar página completa ───────────────────────────────────────
  function duplicatePage(page) {
    const clone = page.cloneNode(true);
    // Limpiar residuos de editor del clon antes de reinsertar
    clone.querySelectorAll('.cs-page-actions, .cs-block-actions').forEach(el => el.remove());
    clone.querySelectorAll('.cs-deletable').forEach(el => el.classList.remove('cs-deletable'));
    clone.querySelectorAll('[contenteditable]').forEach(el => el.removeAttribute('contenteditable'));
    clone.classList.remove('cs-removing');

    page.parentNode.insertBefore(clone, page.nextSibling);

    if (editMode) {
      clone.querySelectorAll(EDITABLE_SELECTORS).forEach(el => {
        el.setAttribute('contenteditable', 'true');
        el.setAttribute('spellcheck', 'false');
        editableEls.push(el);
      });
      clone.querySelectorAll(DELETABLE_SELECTORS).forEach(el => {
        if (el.closest('#cs-edit-fab, #cs-edit-banner, #cs-toast')) return;
        el.classList.add('cs-deletable');
        if (!el.querySelector(':scope > .cs-block-actions')) addBlockActions(el);
      });
      addPageActions(clone);
    }

    clone.style.transition = 'opacity 0.3s, transform 0.3s';
    clone.style.opacity = '0';
    clone.style.transform = 'translateY(-12px)';
    requestAnimationFrame(() => {
      clone.style.opacity = '1';
      clone.style.transform = '';
    });

    renumberPages();
    showToast('Página duplicada');
  }

  // ── Eliminar página completa ───────────────────────────────────────
  function deletePage(page) {
    undoStack.push({
      el: page,
      parent: page.parentNode,
      nextSibling: page.nextSibling,
    });

    page.classList.add('cs-removing');
    setTimeout(() => {
      page.remove();
      renumberPages();
      showToast('Página eliminada');
    }, 200);
  }

  // ── Renumerar páginas automáticamente ─────────────────────────────
  function renumberPages() {
    const pages = Array.from(document.querySelectorAll('.pages .page'));
    let num = 1;
    pages.forEach(page => {
      if (page.classList.contains('cover')) { num++; return; }
      const footer = page.querySelector('.page-footer');
      if (footer) {
        const spans = Array.from(footer.querySelectorAll(':scope > span'));
        const pgSpan = spans[spans.length - 1];
        if (pgSpan) pgSpan.textContent = `Pág. ${num}`;
      }
      num++;
    });
  }

  // ── Duplicar bloque ────────────────────────────────────────────────
  function duplicateBlock(el) {
    const clone = el.cloneNode(true);
    // Quitar botones duplicados del clon para re-crearlos limpios
    clone.querySelectorAll('.cs-block-actions').forEach(b => b.remove());
    clone.classList.remove('cs-removing');

    // Insertar después del original
    el.parentNode.insertBefore(clone, el.nextSibling);

    // Agregar botones de acción al clon si seguimos en modo edición
    if (editMode) {
      clone.classList.add('cs-deletable');
      addBlockActions(clone);
      // Hacer editables los textos internos del clon
      clone.querySelectorAll(EDITABLE_SELECTORS).forEach(child => {
        child.setAttribute('contenteditable', 'true');
        child.setAttribute('spellcheck', 'false');
        editableEls.push(child);
      });
    }

    // Animación de entrada
    clone.style.transition = 'opacity 0.25s, transform 0.25s';
    clone.style.opacity = '0';
    clone.style.transform = 'translateY(-6px)';
    requestAnimationFrame(() => {
      clone.style.opacity = '1';
      clone.style.transform = '';
    });

    showToast('Bloque duplicado');
  }

  // ── Eliminar bloque ────────────────────────────────────────────────
  function deleteBlock(el) {
    undoStack.push({
      el,
      parent: el.parentNode,
      nextSibling: el.nextSibling,
    });

    el.classList.add('cs-removing');
    setTimeout(() => {
      el.remove();
      showToast('Bloque eliminado');
    }, 200);
  }

  // ── Deshacer ────────────────────────────────────────────────────────
  function undoDelete() {
    const last = undoStack.pop();
    if (!last) return;
    const { el, parent, nextSibling } = last;
    el.classList.remove('cs-removing');
    el.style.opacity = '';
    el.style.transform = '';
    parent.insertBefore(el, nextSibling);

    // Re-agregar botones si seguimos en modo edición
    if (editMode) {
      if (el.classList.contains('page')) {
        // Es una página completa — re-aplicar todo el modo edición
        if (!el.querySelector(':scope > .cs-page-actions')) addPageActions(el);
        el.querySelectorAll(EDITABLE_SELECTORS).forEach(child => {
          child.setAttribute('contenteditable', 'true');
          child.setAttribute('spellcheck', 'false');
          if (!editableEls.includes(child)) editableEls.push(child);
        });
        el.querySelectorAll(DELETABLE_SELECTORS).forEach(child => {
          if (child.closest('#cs-edit-fab, #cs-edit-banner, #cs-toast')) return;
          child.classList.add('cs-deletable');
          if (!child.querySelector(':scope > .cs-block-actions')) addBlockActions(child);
        });
      } else if (!el.querySelector(':scope > .cs-block-actions')) {
        el.classList.add('cs-deletable');
        addBlockActions(el);
      }
    }

    renumberPages();
    if (undoStack.length === 0) hideToast();
    else showToast(`${undoStack.length} eliminación${undoStack.length > 1 ? 'es' : ''} pendiente${undoStack.length > 1 ? 's' : ''}`);
  }

  // ── Toast ────────────────────────────────────────────────────────────
  function showToast(msg) {
    toastMsg.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(hideToast, 4000);
  }

  function hideToast() {
    toast.classList.remove('show');
  }

  // ── Guardar HTML autocontenido ────────────────────────────────────
  async function saveDocument() {
    btnSave.textContent = '⏳ Guardando...';
    btnSave.disabled = true;

    try {
      const wasEditing = editMode;
      if (wasEditing) disableEdit();

      // Clonar DOM
      const clone = document.documentElement.cloneNode(true);

      // Limpiar elementos del editor del clon
      ['#cs-edit-fab', '#cs-edit-banner', '#cs-toast'].forEach(sel => {
        clone.querySelector(sel)?.remove();
      });
      clone.querySelectorAll('.cs-block-actions').forEach(el => el.remove());
      clone.querySelectorAll('[contenteditable]').forEach(el => el.removeAttribute('contenteditable'));
      clone.querySelectorAll('script[src="editor.js"]').forEach(el => el.remove());
      clone.querySelectorAll('.cs-removing').forEach(el => el.remove());

      // Quitar clases del editor
      clone.querySelector('body')?.classList.remove('cs-editable-on');

      // Inline shared.css
      const cssLink = clone.querySelector('link[href="shared.css"]');
      if (cssLink) {
        try {
          const resp = await fetch('shared.css');
          const css  = await resp.text();
          const tag  = document.createElement('style');
          tag.textContent = css;
          cssLink.replaceWith(tag);
        } catch (_) {}
      }

      // Inline imágenes <img> como base64
      const imgs = Array.from(clone.querySelectorAll('img'));
      await Promise.all(imgs.map(async img => {
        if (!img.src || img.src.startsWith('data:')) return;
        try {
          const resp = await fetch(img.src);
          const blob = await resp.blob();
          img.src   = await blobToDataURL(blob);
        } catch (_) {}
      }));

      // Inline background-image en CSS (patrones)
      const styleTags = Array.from(clone.querySelectorAll('style'));
      await Promise.all(styleTags.map(async tag => {
        const urlRe = /url\(['"]?((?!data:)[^'")\s]+)['"]?\)/g;
        let css = tag.textContent;
        const matches = [...css.matchAll(urlRe)];
        await Promise.all(matches.map(async m => {
          try {
            const absUrl = new URL(m[1], location.href).href;
            const resp   = await fetch(absUrl);
            const blob   = await resp.blob();
            const dataUrl = await blobToDataURL(blob);
            css = css.replace(m[0], `url("${dataUrl}")`);
          } catch (_) {}
        }));
        tag.textContent = css;
      }));

      // Agregar botón de impresión simple
      const printDiv = clone.ownerDocument.createElement('div');
      printDiv.style.cssText = 'position:fixed;bottom:1.5rem;right:1.5rem;z-index:9999';
      printDiv.innerHTML = `<button onclick="window.print()" style="background:#00AEEF;color:#fff;border:none;border-radius:28px;padding:.6rem 1.2rem;font-size:9pt;font-weight:700;cursor:pointer;box-shadow:0 4px 20px rgba(0,0,0,.3);font-family:Arial,sans-serif">⬇ Exportar PDF</button>`;
      clone.querySelector('body').appendChild(printDiv);

      // Descargar
      const html = '<!DOCTYPE html>\n' + clone.outerHTML;
      const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
      const a    = document.createElement('a');
      a.href     = URL.createObjectURL(blob);
      const docTitle = document.title.replace(/[^a-zA-Z0-9\s]/g, '').trim().replace(/\s+/g, '-').toLowerCase();
      const date     = new Date().toISOString().slice(0, 10);
      a.download = `${docTitle}-${date}.html`;
      a.click();
      URL.revokeObjectURL(a.href);

      if (wasEditing) enableEdit();

    } finally {
      btnSave.textContent = '💾 Guardar HTML';
      btnSave.disabled = false;
    }
  }

  function blobToDataURL(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload  = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  // ── Eventos ─────────────────────────────────────────────────────────
  btnEdit.addEventListener('click', () => {
    if (editMode) disableEdit(); else enableEdit();
  });

  btnPrint.addEventListener('click', () => {
    if (editMode) disableEdit();
    window.print();
  });


  document.getElementById('cs-toast-undo').addEventListener('click', undoDelete);

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && editMode) disableEdit();
    if ((e.ctrlKey || e.metaKey) && e.key === 'z' && undoStack.length) {
      e.preventDefault();
      undoDelete();
    }
  });

  // ── Logo oficial en headers de páginas interiores ────────────────────
  document.querySelectorAll('.page-header-logo').forEach(logo => {
    if (logo.closest('.page-header-brand')) return; // ya aplicado
    const wrapper = document.createElement('div');
    wrapper.className = 'page-header-brand';
    logo.parentNode.insertBefore(wrapper, logo);
    wrapper.appendChild(logo);
    const text = document.createElement('div');
    text.innerHTML = `
      <div class="page-header-brand-name">CORESTACK SOLUTIONS</div>
      <div class="page-header-brand-sub">Convertimos tus procesos en software: operación visible en tiempo real.</div>
    `;
    wrapper.appendChild(text);
  });

  // ── Numeración inicial de páginas ────────────────────────────────────
  renumberPages();
  setupPageReorder();

  // ── Fechas automáticas ───────────────────────────────────────────────
  document.querySelectorAll('#cover-date').forEach(el => {
    el.textContent = new Date().toLocaleDateString('es-MX', {
      day: 'numeric', month: 'long', year: 'numeric',
    });
  });
  document.querySelectorAll('.year, #cover-year').forEach(el => {
    el.textContent = new Date().getFullYear();
  });

})();
