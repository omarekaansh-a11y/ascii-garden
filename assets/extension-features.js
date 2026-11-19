// ASCII Animals - Chrome Extension Features
// Bookmarks bar, Chrome search integration, Voice input, Keyboard shortcuts

(() => {
  'use strict';

  // ------------------------------------------------------------
  // 1. Bookmarks Bar
  // ------------------------------------------------------------
  function initBookmarks() {
    const bar = document.getElementById('bookmarks-bar');
    const menu = document.getElementById('bm-menu');
    if (!bar || !menu) return;

    const api = (typeof chrome !== 'undefined' && chrome.bookmarks && chrome.bookmarks.getTree) ? chrome.bookmarks : null;

    const DEMO_BOOKMARKS = [
      { title: 'GitHub', url: 'https://github.com' },
      { title: 'YouTube', url: 'https://www.youtube.com' },
      { title: 'Reddit', url: 'https://www.reddit.com' },
      { title: 'X / Twitter', url: 'https://x.com' },
      { title: 'Development', children: [
        { title: 'MDN Web Docs', url: 'https://developer.mozilla.org' },
        { title: 'Chrome Extensions', url: 'https://developer.chrome.com/docs/extensions/' },
        { title: 'Web Store Dashboard', url: 'https://chrome.google.com/webstore/devconsole' }
      ]}
    ];

    const FOLDER_ICON = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"/></svg>`;

    let menuAnchor = null;
    let layoutBar = () => {};

    function hostOf(u) {
      try { return new URL(u).hostname.replace(/^www\./, ''); } catch(e) { return u || ''; }
    }

    function letterIcon(node) {
      const s = document.createElement('span');
      const host = hostOf(node.url);
      s.className = 'bm-ico';
      s.textContent = (node.title || host || '?').trim().charAt(0).toUpperCase();
      let h = 0;
      for (let i = 0; i < host.length; i++) h = (h * 31 + host.charCodeAt(i)) & 0xffffffff;
      s.style.backgroundColor = `hsl(${Math.abs(h) % 360}, 55%, 45%)`;
      return s;
    }

    function iconFor(node) {
      if (api && chrome.runtime && chrome.runtime.getURL && /^https?:/i.test(node.url || '')) {
        const img = document.createElement('img');
        img.alt = '';
        img.width = 16;
        img.height = 16;
        img.src = chrome.runtime.getURL('/_favicon/?pageUrl=' + encodeURIComponent(node.url) + '&size=32');
        img.addEventListener('error', () => img.replaceWith(letterIcon(node)), { once: true });
        return img;
      }
      return letterIcon(node);
    }

    function makeItem(node) {
      const isFolder = !node.url;
      const el = document.createElement(isFolder ? 'button' : 'a');
      el.className = 'bm-item' + (isFolder ? ' bm-folder' : '');
      if (isFolder) {
        el.type = 'button';
        el.innerHTML = FOLDER_ICON;
        el.addEventListener('click', (e) => {
          e.stopPropagation();
          if (menuAnchor === el && !menu.hidden) { closeMenu(); return; }
          openMenu(el, node.children || []);
        });
      } else {
        el.href = node.url;
        el.title = (node.title ? node.title + '\n' : '') + node.url;
        el.appendChild(iconFor(node));
      }
      const label = node.title || (isFolder ? 'Folder' : '');
      if (label) {
        const span = document.createElement('span');
        span.className = 'bm-title';
        span.textContent = label;
        el.appendChild(span);
      }
      return el;
    }

    function openMenu(anchor, nodes, stack = []) {
      if (menuAnchor) menuAnchor.classList.remove('open');
      menuAnchor = anchor;
      anchor.classList.add('open');
      menu.textContent = '';

      if (stack.length) {
        const back = document.createElement('button');
        back.type = 'button';
        back.className = 'bm-item bm-back';
        back.innerHTML = `<span>← Back</span>`;
        back.addEventListener('click', (e) => {
          e.stopPropagation();
          const prev = stack.slice(0, -1);
          openMenu(anchor, stack[stack.length - 1], prev);
        });
        menu.appendChild(back);
      }

      if (!nodes.length) {
        const empty = document.createElement('div');
        empty.className = 'bm-empty';
        empty.textContent = 'Empty folder';
        menu.appendChild(empty);
      }

      for (const n of nodes) {
        if (n.url) {
          menu.appendChild(makeItem(n));
        } else {
          const sub = makeItem(n);
          sub.addEventListener('click', (e) => {
            e.stopPropagation();
            openMenu(anchor, n.children || [], stack.concat([nodes]));
          });
          menu.appendChild(sub);
        }
      }

      menu.hidden = false;
      const r = anchor.getBoundingClientRect();
      const w = menu.offsetWidth;
      menu.style.left = Math.max(8, Math.min(r.left, window.innerWidth - w - 8)) + 'px';
      menu.style.top = (r.bottom + 4) + 'px';
    }

    function closeMenu() {
      menu.hidden = true;
      if (menuAnchor) menuAnchor.classList.remove('open');
      menuAnchor = null;
    }

    document.addEventListener('click', (e) => {
      if (!menu.hidden && !menu.contains(e.target) && (!menuAnchor || !menuAnchor.contains(e.target))) {
        closeMenu();
      }
    });

    function renderBar(items, other) {
      closeMenu();
      bar.textContent = '';
      const list = document.createElement('div');
      list.className = 'bm-list';

      const els = items.map(n => list.appendChild(makeItem(n)));

      const more = document.createElement('button');
      more.type = 'button';
      more.className = 'bm-item bm-more bm-folder';
      more.title = 'More bookmarks';
      more.textContent = '»';
      bar.append(list, more);

      if (other && other.length) {
        bar.appendChild(makeItem({ title: 'Other bookmarks', children: other }));
      }

      let hidden = [];
      more.addEventListener('click', (e) => {
        e.stopPropagation();
        if (menuAnchor === more && !menu.hidden) { closeMenu(); return; }
        openMenu(more, hidden);
      });

      layoutBar = () => {
        hidden = [];
        for (const e of els) e.style.display = '';
        const avail = list.clientWidth;
        for (let i = 0; i < els.length; i++) {
          if (els[i].offsetLeft + els[i].offsetWidth > avail) {
            hidden = items.slice(i);
            for (let j = i; j < els.length; j++) els[j].style.display = 'none';
            break;
          }
        }
        more.style.display = hidden.length ? '' : 'none';
      };

      layoutBar();
    }

    function loadBookmarks() {
      if (!api) {
        renderBar(DEMO_BOOKMARKS, []);
        return;
      }
      api.getTree((tree) => {
        const roots = (tree && tree[0] && tree[0].children) || [];
        const barNode = roots.find(n => n.id === '1') || roots[0];
        const otherNode = roots.find(n => n.id === '2');
        renderBar((barNode && barNode.children) || [], (otherNode && otherNode.children) || []);
      });
    }

    if (api) {
      for (const ev of ['onCreated', 'onRemoved', 'onChanged', 'onMoved', 'onChildrenReordered', 'onImportEnded']) {
        if (api[ev]) api[ev].addListener(() => loadBookmarks());
      }
    }

    window.addEventListener('resize', () => { closeMenu(); layoutBar(); });
    loadBookmarks();
  }

  // ------------------------------------------------------------
  // 2. Search Handling & File Attachments
  // ------------------------------------------------------------
  function executeSearch(raw, files = []) {
    let query = (raw || '').trim();

    // If an image or screenshot is attached, use native Google Lens upload (Chrome native feature)
    const imageFile = files.find(f => f.type.startsWith('image/'));
    if (imageFile) {
      if (query && navigator.clipboard) {
        try { navigator.clipboard.writeText(query).catch(() => {}); } catch (e) {}
      }

      // Native form POST to Google Lens v3 upload endpoint (same as Chrome search bar)
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = 'https://lens.google.com/v3/upload';
      form.enctype = 'multipart/form-data';
      form.style.display = 'none';

      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.name = 'encoded_image';

      const dt = new DataTransfer();
      dt.items.add(imageFile);
      fileInput.files = dt.files;
      form.appendChild(fileInput);

      if (query) {
        const textInput = document.createElement('input');
        textInput.type = 'hidden';
        textInput.name = 'ep';
        textInput.value = 'subb';
        form.appendChild(textInput);
      }

      document.body.appendChild(form);
      form.submit();
      return;
    }

    // For non-image files, synthesize query with file context
    if (files.length > 0) {
      const fileNames = files.map(f => f.name).join(' ');
      if (!query) {
        query = fileNames;
      } else if (!query.toLowerCase().includes(fileNames.toLowerCase())) {
        query = `${query} ${fileNames}`;
      }
    }

    if (!query) return;

    // Check if it's an explicit URL (only when no files attached)
    if (/^https?:\/\//i.test(query)) {
      location.href = query;
      return;
    }

    // Check if it's a domain name (e.g. google.com, localhost:3000)
    if (!/\s/.test(query) && /^[\w-]+(\.[\w-]+)+(:\d+)?(\/\S*)?$/.test(query)) {
      location.href = 'https://' + query;
      return;
    }

    // Use Chrome's search API if in extension context
    if (typeof chrome !== 'undefined' && chrome.search && chrome.search.query) {
      chrome.search.query({ text: query, disposition: 'CURRENT_TAB' });
      return;
    }

    // Fallback search engine
    location.href = 'https://www.google.com/search?q=' + encodeURIComponent(query);
  }

  function initSearch() {
    const composer = document.querySelector('.composer');
    if (!composer) return;

    const textarea = composer.querySelector('textarea');
    const sendBtn = composer.querySelector('.send');
    const pillBtn = composer.querySelector('.pill[aria-label="Add tabs or files"]');
    const attachmentsEl = document.getElementById('composer-attachments') || (() => {
      const el = document.createElement('div');
      el.className = 'composer-attachments';
      el.id = 'composer-attachments';
      el.hidden = true;
      composer.appendChild(el);
      return el;
    })();

    const fileInput = document.getElementById('composer-file-input') || (() => {
      const input = document.createElement('input');
      input.type = 'file';
      input.id = 'composer-file-input';
      input.multiple = true;
      input.style.display = 'none';
      composer.appendChild(input);
      return input;
    })();

    let attachedFiles = [];

    function formatBytes(bytes) {
      if (!bytes || bytes < 0) return '0 B';
      if (bytes < 1024) return bytes + ' B';
      if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(0) + ' KB';
      return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    }

    function renderAttachments() {
      attachmentsEl.innerHTML = '';

      if (attachedFiles.length === 0) {
        attachmentsEl.hidden = true;
        composer.classList.remove('has-files');
        if (sendBtn && textarea) {
          sendBtn.disabled = !textarea.value.trim();
        }
        return;
      }

      attachmentsEl.hidden = false;
      composer.classList.add('has-files');
      if (sendBtn) sendBtn.disabled = false;

      attachedFiles.forEach((file, index) => {
        const chip = document.createElement('div');
        chip.className = 'file-chip';
        chip.title = `${file.name} (${formatBytes(file.size)})`;

        if (file.type.startsWith('image/')) {
          const img = document.createElement('img');
          img.className = 'file-chip-thumb';
          img.alt = file.name;
          img.src = URL.createObjectURL(file);
          chip.appendChild(img);
        } else {
          const ico = document.createElement('span');
          ico.className = 'file-chip-icon';
          ico.innerHTML = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>';
          chip.appendChild(ico);
        }

        const nameSpan = document.createElement('span');
        nameSpan.className = 'file-chip-name';
        nameSpan.textContent = file.name;
        chip.appendChild(nameSpan);

        const sizeSpan = document.createElement('span');
        sizeSpan.className = 'file-chip-size';
        sizeSpan.textContent = formatBytes(file.size);
        chip.appendChild(sizeSpan);

        const removeBtn = document.createElement('button');
        removeBtn.type = 'button';
        removeBtn.className = 'file-chip-remove';
        removeBtn.title = 'Remove';
        removeBtn.setAttribute('aria-label', `Remove ${file.name}`);
        removeBtn.innerHTML = '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>';
        removeBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          attachedFiles.splice(index, 1);
          renderAttachments();
        });
        chip.appendChild(removeBtn);

        attachmentsEl.appendChild(chip);
      });
    }

    // 1. "Add tabs or files" pill button opens file explorer
    if (pillBtn && fileInput) {
      pillBtn.addEventListener('click', (e) => {
        if (pillBtn.tagName.toLowerCase() !== 'label') {
          e.preventDefault();
          fileInput.click();
        }
      });
      pillBtn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          fileInput.click();
        }
      });
    }

    // 2. File input change event
    fileInput.addEventListener('change', () => {
      if (fileInput.files && fileInput.files.length) {
        attachedFiles.push(...Array.from(fileInput.files));
        fileInput.value = '';
        renderAttachments();
      }
    });

    // 3. Global drag & drop prevention so dragging files into Chrome does not navigate away
    window.addEventListener('dragenter', (e) => {
      e.preventDefault();
    });
    window.addEventListener('dragover', (e) => {
      e.preventDefault();
      if (e.dataTransfer) e.dataTransfer.dropEffect = 'copy';
    });
    window.addEventListener('drop', (e) => {
      e.preventDefault();
    });

    // 4. Drag and Drop onto composer with glowing response, dotted border, and dynamic placeholder
    const defaultPlaceholder = 'Search the web or type a URL...';

    composer.addEventListener('dragenter', (e) => {
      e.preventDefault();
      composer.classList.add('drag-active');
      if (textarea) textarea.placeholder = 'Drag and drop a file to search';
    });

    composer.addEventListener('dragover', (e) => {
      e.preventDefault();
      if (e.dataTransfer) e.dataTransfer.dropEffect = 'copy';
      composer.classList.add('drag-active');
      if (textarea) textarea.placeholder = 'Drag and drop a file to search';
    });

    composer.addEventListener('dragleave', (e) => {
      e.preventDefault();
      if (!composer.contains(e.relatedTarget)) {
        composer.classList.remove('drag-active');
        if (textarea) textarea.placeholder = defaultPlaceholder;
      }
    });

    composer.addEventListener('drop', (e) => {
      e.preventDefault();
      e.stopPropagation();
      composer.classList.remove('drag-active');
      if (textarea) textarea.placeholder = defaultPlaceholder;

      if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length) {
        attachedFiles.push(...Array.from(e.dataTransfer.files));
        renderAttachments();
      }
    });

    // 5. Auto-close Tweaks when clicking or focusing the search bar
    const closeTweaksIfOpen = () => {
      if (typeof window.__closeTweaks === 'function') {
        window.__closeTweaks();
      } else {
        const tweaks = document.querySelector('.tweaks');
        const tweaksOpen = document.querySelector('.tweaks-open');
        if (tweaks && !tweaks.hidden) {
          tweaks.hidden = true;
          if (tweaksOpen) tweaksOpen.hidden = false;
          try { localStorage.setItem('ascii-animals:tweaks-open', '0'); } catch(e) {}
        }
      }
    };

    composer.addEventListener('pointerdown', () => closeTweaksIfOpen());
    if (textarea) {
      textarea.addEventListener('focus', () => closeTweaksIfOpen());
      textarea.addEventListener('pointerdown', () => closeTweaksIfOpen());
    }

    function doSubmit(text) {
      const currentFiles = [...attachedFiles];
      attachedFiles = [];
      renderAttachments();
      executeSearch(text, currentFiles);
    }

    // Stephen's code dispatches "chat:submit" on the composer form
    composer.addEventListener('chat:submit', (e) => {
      const text = (e.detail && e.detail.text) || (textarea ? textarea.value : '');
      doSubmit(text);
    });

    // Also handle direct form submit if needed
    composer.addEventListener('submit', (e) => {
      e.preventDefault();
      const val = textarea ? textarea.value.trim() : '';
      if (val || attachedFiles.length > 0) {
        doSubmit(val);
      }
    });

    // Send button click when files attached even if textarea is empty
    if (sendBtn) {
      sendBtn.addEventListener('click', (e) => {
        const val = textarea ? textarea.value.trim() : '';
        if (attachedFiles.length > 0 && !val) {
          e.preventDefault();
          doSubmit('');
        }
      });
    }

    // Voice recognition on mic button
    const voiceBtn = composer.querySelector('.icon-btn[aria-label="Voice input"]');
    if (voiceBtn && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
      const rec = new SpeechRec();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = navigator.language || 'en-US';

      rec.onresult = (evt) => {
        const transcript = evt.results[0][0].transcript;
        if (textarea) {
          textarea.value = transcript;
          textarea.dispatchEvent(new Event('input'));
          textarea.focus();
        }
      };

      voiceBtn.addEventListener('click', () => {
        try {
          voiceBtn.style.color = '#7aa2ff';
          rec.start();
        } catch (err) {}
      });

      rec.onend = () => {
        voiceBtn.style.color = '';
      };
    }
  }

  // ------------------------------------------------------------
  // 3. Name Customization & Greeting
  // ------------------------------------------------------------
  function initGreeting() {
    const greetingEl = document.querySelector('.greeting');
    if (!greetingEl) return;

    let savedName = 'ekaansh';
    try {
      savedName = localStorage.getItem('ascii-animals:name') || 'ekaansh';
    } catch(e) {}

    function updateGreeting() {
      const h = new Date().getHours();
      let phrase = '';
      let punctuation = '.';
      if (h >= 5 && h < 12) {
        phrase = 'Good morning';
        punctuation = '!';
      } else if (h >= 12 && h < 17) {
        phrase = 'Good afternoon';
        punctuation = '.';
      } else if (h >= 17 && h < 22) {
        phrase = 'Good evening';
        punctuation = '.';
      } else {
        phrase = 'Still up';
        punctuation = '?';
      }

      greetingEl.textContent = `${phrase}, ${savedName}${punctuation}`;
    }

    updateGreeting();
    setInterval(updateGreeting, 30000);

    // Double-click greeting to quickly edit your name
    greetingEl.style.cursor = 'pointer';
    greetingEl.title = 'Double-click to change your name';
    greetingEl.addEventListener('dblclick', () => {
      const entered = prompt('What is your name?', savedName);
      if (entered !== null && entered.trim()) {
        savedName = entered.trim();
        try { localStorage.setItem('ascii-animals:name', savedName); } catch(e) {}
        updateGreeting();
      }
    });
  }

  // ------------------------------------------------------------
  // 4. Keyboard Shortcuts: 1..7 switch animal, Esc closes tweaks
  // ------------------------------------------------------------
  function initShortcuts() {
    window.addEventListener('keydown', (e) => {
      const tag = (e.target.tagName || '').toLowerCase();
      if (e.key === 'Escape') {
        const closeBtn = document.querySelector('.tweaks-close');
        if (closeBtn && !closeBtn.closest('.tweaks')?.hidden) closeBtn.click();
        const menu = document.getElementById('bm-menu');
        if (menu && !menu.hidden) menu.hidden = true;
        return;
      }
      if (tag === 'textarea' || tag === 'input' || e.metaKey || e.ctrlKey || e.altKey) return;
      const num = parseInt(e.key, 10);
      if (num >= 1 && num <= 8) {
        const buttons = document.querySelectorAll('.choices button[role="radio"]');
        if (buttons[num - 1]) buttons[num - 1].click();
      }
    });
  }

  // ------------------------------------------------------------
  // 5. Clock Widget (Odometer vertical scroll ticker)
  // ------------------------------------------------------------
  function initClock() {
    const clockEl = document.getElementById('clock');
    if (!clockEl) return;
    const timeEl = clockEl.querySelector('.clock-time') || clockEl;

    // Establish persistent container elements so we only manipulate digit slots
    let hEl = timeEl.querySelector('.clock-h');
    let colonEl = timeEl.querySelector('.clock-colon');
    let mEl = timeEl.querySelector('.clock-m');
    let ampmEl = timeEl.querySelector('.clock-ampm');

    if (!hEl || !colonEl || !mEl || !ampmEl) {
      timeEl.innerHTML = [
        '<span class="clock-digits clock-h"></span>',
        '<span class="clock-colon">:</span>',
        '<span class="clock-digits clock-m"></span>',
        '<span class="clock-ampm odo-slot"></span>'
      ].join('');
      hEl = timeEl.querySelector('.clock-h');
      colonEl = timeEl.querySelector('.clock-colon');
      mEl = timeEl.querySelector('.clock-m');
      ampmEl = timeEl.querySelector('.clock-ampm');
    }

    let is24Hour = false;
    function syncFormat() {
      try {
        const saved = localStorage.getItem('ascii-animals:clock-format');
        is24Hour = saved === '24';
      } catch (e) {
        is24Hour = false;
      }
    }
    syncFormat();

    function createSlot(char, extraClass) {
      const slot = document.createElement('span');
      slot.className = 'odo-slot' + (extraClass ? ' ' + extraClass : '');
      slot.dataset.char = char;

      const ghost = document.createElement('span');
      ghost.className = 'odo-ghost';
      ghost.setAttribute('aria-hidden', 'true');
      ghost.textContent = char;

      const num = document.createElement('span');
      num.className = 'odo-num odo-current';
      num.textContent = char;

      slot.append(ghost, num);
      return slot;
    }

    function updateSlot(slot, newChar, animate) {
      if (slot.dataset.char === newChar) return;

      slot.dataset.char = newChar;
      const ghost = slot.querySelector('.odo-ghost');
      if (ghost) ghost.textContent = newChar;

      const current = slot.querySelector('.odo-num.odo-current');

      if (!animate || !current) {
        slot.querySelectorAll('.odo-num').forEach(el => el.remove());
        const num = document.createElement('span');
        num.className = 'odo-num odo-current';
        num.textContent = newChar;
        slot.appendChild(num);
        return;
      }

      // Remove any lingering exit animations immediately
      slot.querySelectorAll('.odo-old, .odo-exit').forEach(el => el.remove());

      // Current moves to old
      current.className = 'odo-num odo-old';

      // Incoming node created from above (-105%)
      const incoming = document.createElement('span');
      incoming.className = 'odo-num odo-incoming';
      incoming.textContent = newChar;
      slot.appendChild(incoming);

      // Force browser reflow to register initial state
      void incoming.offsetWidth;

      // Animate on next frame: incoming slides down to 0, current exits downwards
      requestAnimationFrame(() => {
        incoming.className = 'odo-num odo-current';
        current.className = 'odo-num odo-old odo-exit';
      });

      // Cleanup exited node after animation finishes
      setTimeout(() => {
        if (current.parentNode === slot) {
          current.remove();
        }
      }, 600);
    }

    function syncGroup(containerEl, targetStr, animate) {
      const slots = Array.from(containerEl.querySelectorAll(':scope > .odo-slot'));

      if (slots.length === targetStr.length) {
        for (let i = 0; i < targetStr.length; i++) {
          updateSlot(slots[i], targetStr[i], animate);
        }
        return;
      }

      // If slot count changed (e.g. 9 -> 10, 12 -> 1, or initial render)
      if (!animate || slots.length === 0) {
        containerEl.innerHTML = '';
        for (let i = 0; i < targetStr.length; i++) {
          containerEl.appendChild(createSlot(targetStr[i]));
        }
        return;
      }

      if (slots.length < targetStr.length) {
        // e.g. 1 digit to 2 digits: insert leading slot
        const lead = createSlot(targetStr[0]);
        containerEl.insertBefore(lead, containerEl.firstChild);
        for (let i = 1; i < targetStr.length; i++) {
          updateSlot(slots[i - 1], targetStr[i], animate);
        }
        return;
      }

      if (slots.length > targetStr.length) {
        // e.g. 2 digits to 1 digit: remove leading slot
        slots[0].remove();
        for (let i = 0; i < targetStr.length; i++) {
          updateSlot(slots[i + 1], targetStr[i], animate);
        }
        return;
      }
    }

    let isFirstRender = true;

    function updateTime(animate = true) {
      const now = new Date();
      let hours = now.getHours();
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const shouldAnimate = !isFirstRender && animate;

      let hourStr = '';
      let ampmStr = '';

      if (is24Hour) {
        // 24:00 mode - NO AM/PM
        hourStr = String(hours).padStart(2, '0');
        ampmEl.style.setProperty('display', 'none', 'important');
      } else {
        // 12:00 mode - Display AM and PM
        ampmStr = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12;
        hourStr = String(hours);
        ampmEl.style.removeProperty('display');
        if (ampmEl.children.length === 0) {
          const ghost = document.createElement('span');
          ghost.className = 'odo-ghost';
          ghost.setAttribute('aria-hidden', 'true');
          ghost.textContent = ampmStr;
          const num = document.createElement('span');
          num.className = 'odo-num odo-current';
          num.textContent = ampmStr;
          ampmEl.dataset.char = ampmStr;
          ampmEl.append(ghost, num);
        } else {
          updateSlot(ampmEl, ampmStr, shouldAnimate);
        }
      }

      syncGroup(hEl, hourStr, shouldAnimate);
      syncGroup(mEl, minutes, shouldAnimate);

      timeEl.setAttribute('aria-label', `${hourStr}:${minutes}${ampmStr ? ' ' + ampmStr : ''}`);
      isFirstRender = false;
    }

    // Toggle on clock click
    clockEl.addEventListener('click', () => {
      is24Hour = !is24Hour;
      const val = is24Hour ? '24' : '12';
      try {
        localStorage.setItem('ascii-animals:clock-format', val);
        if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
          chrome.storage.local.set({ 'ascii-animals:clock-format': val });
        }
      } catch (e) {}
      window.dispatchEvent(new CustomEvent('ascii-animals:clock-change', { detail: { format: val } }));
      updateTime(true);
    });

    // Listen to changes from Tweaks settings
    window.addEventListener('ascii-animals:clock-change', (e) => {
      if (e.detail && e.detail.format) {
        is24Hour = e.detail.format === '24';
      } else {
        syncFormat();
      }
      updateTime(true);
    });

    updateTime(false);
    setInterval(() => updateTime(true), 1000);
  }

  // Initialize all features once DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initClock();
      initBookmarks();
      initSearch();
      initGreeting();
      initShortcuts();
    });
  } else {
    initClock();
    initBookmarks();
    initSearch();
    initGreeting();
    initShortcuts();
  }
})();
