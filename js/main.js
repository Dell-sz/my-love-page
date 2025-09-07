// Import auth functions
// Assuming auth.js is loaded before main.js

document.addEventListener('DOMContentLoaded', () => {
  // Initialize dark mode based on localStorage
  const darkMode = localStorage.getItem('darkMode') === 'true';
  if (darkMode) document.body.classList.add('dark-mode');

  // Check authentication on protected pages
  if (window.location.pathname.includes('memories.html') || window.location.pathname.includes('save-memory.html')) {
    if (!window.Auth || !window.Auth.isLoggedIn()) {
      window.location.href = 'login.html';
    }

    // Load memories on memories page
    if (window.location.pathname.includes('memories.html')) {
      carregarLembrancas();
    }

    // Outras funções globais...
  }
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

if (typeof API_BASE_URL === 'undefined') {
  // API functions for memories
  var API_BASE_URL = 'http://localhost:3000/api'; // Assuming backend runs on port 3000

  // Function to get authorization headers
  function getAuthHeaders() {
    const token = window.Auth ? window.Auth.getToken() : null;
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  }

  // Function to show loading spinner
  function showLoading(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
      element.innerHTML = '<div class="loading-spinner">Carregando...</div>';
    }
  }

  // Function to hide loading spinner
  function hideLoading(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
      element.innerHTML = '';
    }
  }

  // Load memories from API
  async function carregarLembrancas() {
    const listaLembrancas = document.getElementById('lista-lembrancas');
    if (!listaLembrancas) return;

    showLoading('lista-lembrancas');

    try {
      // Example request: GET /api/memories
      // Response: { success: true, data: [{ id, title, description, createdAt }, ...] }
      const response = await fetch(`${API_BASE_URL}/memories`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        }
      });

      const data = await response.json();

      hideLoading('lista-lembrancas');

      if (response.ok && data.success) {
        const memories = data.data;
        if (memories.length === 0) {
          listaLembrancas.innerHTML = '<p>Nenhuma memória salva ainda.</p>';
          return;
        }

        // Sort by createdAt descending (newest first)
        memories.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        listaLembrancas.innerHTML = '';
        memories.forEach((memoria) => {
          const div = document.createElement('div');
          div.className = 'lembranca';
          div.innerHTML = `
          <h3>${memoria.title}</h3>
          <p>${memoria.description}</p>
          <p><small>Criado em: ${new Date(memoria.createdAt).toLocaleDateString()}</small></p>
          <button class="editar-btn" data-id="${memoria.id}">Editar</button>
          <button class="remover-btn" data-id="${memoria.id}">Remover</button>
        `;
          listaLembrancas.appendChild(div);
        });

        // Add event listeners for edit and delete
        addMemoryEventListeners();
      } else {
        listaLembrancas.innerHTML = '<p>Erro ao carregar memórias.</p>';
      }
    } catch (error) {
      console.error('Error loading memories:', error);
      hideLoading('lista-lembrancas');
      listaLembrancas.innerHTML = '<p>Erro de conexão.</p>';
    }
  }

  // Delete memory via API
  async function deleteMemory(id) {
    try {
      // Example request: DELETE /api/memories/{id}
      // Response: { success: true, message: "Memory deleted" }
      const response = await fetch(`${API_BASE_URL}/memories/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        }
      });

      const data = await response.json();

      if (response.ok && data.success) {
        alert('Memória deletada com sucesso!');
        carregarLembrancas(); // Reload memories
      } else {
        alert('Erro ao deletar memória: ' + (data.message || 'Erro desconhecido'));
      }
    } catch (error) {
      console.error('Error deleting memory:', error);
      alert('Erro de conexão ao deletar memória.');
    }
  }

  // Edit memory (placeholder for now)
  async function editMemory(id) {
    // For now, just alert; can be expanded to open edit form
    alert('Editar memória não implementado ainda.');
  }

  // Add event listeners for memory buttons
  function addMemoryEventListeners() {
    document.querySelectorAll('.remover-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.target.getAttribute('data-id');
        if (confirm('Tem certeza que deseja deletar esta memória?')) {
          deleteMemory(id);
        }
      });
    });

    document.querySelectorAll('.editar-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.target.getAttribute('data-id');
        editMemory(id);
      });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('form-memoria');
    if (!form) return;

    const tituloInput = document.getElementById('titulo-memoria');
    const descricaoInput = document.getElementById('descricao-memoria');
    const messageDiv = document.getElementById('message');
    const salvarBtn = document.getElementById('salvar-btn');

    form.addEventListener('submit', async function (e) {
      e.preventDefault();

      const title = tituloInput.value.trim();
      const description = descricaoInput.value.trim();

      if (!title || !description) {
        messageDiv.textContent = 'Por favor, preencha todos os campos.';
        messageDiv.className = 'error';
        return;
      }

      salvarBtn.disabled = true;
      messageDiv.textContent = 'Salvando memória...';
      messageDiv.className = '';

      try {
        const response = await fetch(`${API_BASE_URL}/memories`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders()
          },
          body: JSON.stringify({ title, description })
        });

        const data = await response.json();

        if (response.ok && data.success) {
          messageDiv.textContent = 'Memória salva com sucesso!';
          messageDiv.className = 'success';
          form.reset();
          // Redirect to memories list or reload
          window.location.href = 'memories.html';
        } else {
          messageDiv.textContent = data.message || 'Erro ao salvar memória.';
          messageDiv.className = 'error';
        }
      } catch (error) {
        console.error('Error saving memory:', error);
        messageDiv.textContent = 'Erro de conexão.';
        messageDiv.className = 'error';
      } finally {
        salvarBtn.disabled = false;
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

  // <-- Add this closing brace to fix the error
}
