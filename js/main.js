document.addEventListener('DOMContentLoaded', () => {
  // Initialize dark mode based on localStorage
  const darkMode = localStorage.getItem('darkMode') === 'true';
  if (darkMode) document.body.classList.add('dark-mode');

  // Outras funções globais...
});



// Floating Hearts
function createHeart() {
  const heart = document.createElement('div');
  heart.className = 'heart';
  heart.textContent = '❤️';
  heart.style.left = Math.random() * 100 + 'vw';
  heart.style.animationDelay = Math.random() * 6 + 's';
  document.querySelector('.hearts').appendChild(heart);
  setTimeout(() => {
    heart.remove();
  }, 6000);
}
setInterval(createHeart, 1000);

// IndexedDB for memories
let db;
const request = indexedDB.open('LoveCalendarDB', 2);

request.onupgradeneeded = function (event) {
  db = event.target.result;
  if (!db.objectStoreNames.contains('memories')) {
    const objectStore = db.createObjectStore('memories', { keyPath: 'id', autoIncrement: true });
    objectStore.createIndex('date', 'date', { unique: false });
  }
};

request.onsuccess = function (event) {
  db = event.target.result;
  if (document.getElementById('lista-lembrancas')) {
    carregarLembrancas();
  }
};

// Load memories
function carregarLembrancas() {
  const listaLembrancas = document.getElementById('lista-lembrancas');
  if (!listaLembrancas) return;
  listaLembrancas.innerHTML = '';
  if (!db) return;

  const transaction = db.transaction(['memories'], 'readonly');
  const objectStore = transaction.objectStore('memories');
  objectStore.getAll().onsuccess = function (event) {
    let memories = event.target.result;
    if (memories.length === 0) {
      listaLembrancas.innerHTML = '<p>Nenhuma memória salva ainda.</p>';
      return;
    }
    // Sort by date descending (newest first)
    memories.sort((a, b) => new Date(b.date) - new Date(a.date));
    memories.forEach((memoria) => {
      const div = document.createElement('div');
      div.className = 'lembranca';
      div.innerHTML = `
        <div class="media-container">
          ${memoria.fileType === 'image' ? `<img src="${memoria.fileData}" alt="Imagem" data-src="${memoria.fileData}" data-type="image" />` : ''}
          ${memoria.fileType === 'video' ? `<video src="${memoria.fileData}" data-src="${memoria.fileData}" data-type="video"></video>` : ''}
        </div>
        <p>Data: <strong>${memoria.date}</strong></p>
        ${memoria.comment ? `<p>Comentário: ${memoria.comment}</p>` : ''}
        <button class="remover-btn" data-id="${memoria.id}">Remover</button>
      `;
      listaLembrancas.appendChild(div);
    });

    // Add click event listeners to media elements
    addMediaClickListeners();
  };
}

// Delete memory
document.addEventListener('click', function (e) {
  if (e.target.classList.contains('remover-btn')) {
    const id = parseInt(e.target.getAttribute('data-id'));
    const transaction = db.transaction(['memories'], 'readwrite');
    const objectStore = transaction.objectStore('memories');
    objectStore.delete(id).onsuccess = function () {
      carregarLembrancas();
    };
  }
});

// Save memory form
document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('form-memoria');
  if (!form) return;
  const dataInput = document.getElementById('data-memoria');
  const arquivoInput = document.getElementById('arquivo-memoria');
  const preview = document.getElementById('preview');
  const salvarBtn = document.getElementById('salvar-btn');

  let arquivoTipo = '';
  let arquivoData = '';

  function atualizarBotaoSalvar() {
    salvarBtn.disabled = !(dataInput.value && arquivoData);
  }

  arquivoInput.addEventListener('change', function () {
    const file = this.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        if (file.type.startsWith('image/')) {
          preview.innerHTML = `<img src="${e.target.result}" alt="Imagem escolhida" style="max-width:200px; margin-top:10px; border-radius:8px;" />`;
          arquivoTipo = 'image';
        } else if (file.type.startsWith('video/')) {
          preview.innerHTML = `<video src="${e.target.result}" controls style="max-width:200px; margin-top:10px; border-radius:8px;"></video>`;
          arquivoTipo = 'video';
        }
        arquivoData = e.target.result;
        atualizarBotaoSalvar();
      };
      reader.readAsDataURL(file);
    }
  });

  dataInput.addEventListener('input', atualizarBotaoSalvar);

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (db && dataInput.value && arquivoData) {
      const comentario = document.getElementById('comentario-memoria').value;
      const memoria = {
        date: dataInput.value,
        fileType: arquivoTipo,
        fileData: arquivoData,
        comment: comentario
      };
      const transaction = db.transaction(['memories'], 'readwrite');
      const objectStore = transaction.objectStore('memories');
      objectStore.add(memoria).onsuccess = function () {
        alert('Memória salva com sucesso!');
        form.reset();
        preview.innerHTML = '';
        arquivoTipo = '';
        arquivoData = '';
        document.getElementById('comentario-memoria').value = '';
        atualizarBotaoSalvar();
      };
    }
  });
});

// Preferences form
document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('preferences-form');
  if (!form) return;
  const themeSelect = document.getElementById('theme-select');

  // Load preferences
  themeSelect.value = localStorage.getItem('selectedTheme') || 'light';



  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const theme = themeSelect.value;

    localStorage.setItem('selectedTheme', theme);
    // Also update darkMode localStorage for consistency
    localStorage.setItem('darkMode', theme === 'dark' ? 'true' : 'false');

    alert('Preferências salvas!');
    // Apply theme immediately
    if (theme === 'dark') {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  });
});

// Hamburger menu toggle functionality
document.addEventListener('DOMContentLoaded', () => {
  const hamburgerToggle = document.querySelector('.hamburger-btn');
  const hamburgerDropdown = document.querySelector('.hamburger-dropdown');

  if (hamburgerToggle && hamburgerDropdown) {
    hamburgerToggle.addEventListener('click', () => {
      hamburgerToggle.classList.toggle('active');
      hamburgerDropdown.classList.toggle('active');
    });

    // Close hamburger menu when clicking outside
    document.addEventListener('click', (event) => {
      if (!hamburgerToggle.contains(event.target) && !hamburgerDropdown.contains(event.target)) {
        hamburgerToggle.classList.remove('active');
        hamburgerDropdown.classList.remove('active');
      }
    });
  }
});

// Modal functionality for viewing full-size images/videos
function addMediaClickListeners() {
  const images = document.querySelectorAll('.lembranca img');
  const videos = document.querySelectorAll('.lembranca video');

  images.forEach(img => {
    img.addEventListener('click', () => openModal(img.dataset.src, 'image'));
  });

  videos.forEach(video => {
    video.addEventListener('click', () => openModal(video.dataset.src, 'video'));
  });
}

function openModal(src, type) {
  const modal = document.getElementById('media-modal');
  const modalContainer = document.getElementById('modal-media-container');

  if (type === 'image') {
    modalContainer.innerHTML = `<img src="${src}" alt="Imagem ampliada" />`;
  } else if (type === 'video') {
    modalContainer.innerHTML = `<video src="${src}" controls autoplay></video>`;
  }

  modal.style.display = 'block';

  // Close modal when clicking the close button
  const closeBtn = document.querySelector('.close-modal');
  if (closeBtn) {
    closeBtn.onclick = () => {
      modal.style.display = 'none';
      modalContainer.innerHTML = '';
    };
  }

  // Close modal when clicking outside the content
  modal.onclick = (event) => {
    if (event.target === modal) {
      modal.style.display = 'none';
      modalContainer.innerHTML = '';
    }
  };

  // Close modal on Escape key
  document.addEventListener('keydown', function closeOnEscape(e) {
    if (e.key === 'Escape') {
      modal.style.display = 'none';
      modalContainer.innerHTML = '';
      document.removeEventListener('keydown', closeOnEscape);
    }
  });
}
