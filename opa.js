const API_BASE = 'http://localhost:5000';
document.addEventListener('DOMContentLoaded', () => {
  const addNoteBtn = document.getElementById('addNoteBtn');
  const noteModal = document.getElementById('noteModal');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const saveNoteBtn = document.getElementById('saveNoteBtn');
  const noteText = document.getElementById('noteText');
  const noteTag = document.getElementById('noteTag');
  const notesList = document.getElementById('notesList');
  const searchInput = document.getElementById('searchInput');
  const tagsList = document.getElementById('tagsList');
  const viewNoteModal = document.getElementById('viewNoteModal');
const viewNoteText = document.getElementById('viewNoteText');
const viewNoteTag = document.getElementById('viewNoteTag');
const closeViewModalBtn = document.getElementById('closeViewModalBtn');
const deleteViewNoteBtn = document.getElementById('deleteViewNoteBtn');

  let searchQuery = ""; // поиск
  let currentTag = 'Все'; // тег для фильтр 
  let notes = []; // массив заметок
  let editingNoteId = null; // ред. заметки 

  async function fetchNotes() {
    try {
      const res = await fetch(`${API_BASE}/notes`);
      if (!res.ok) throw new Error('Ошибка загрузки заметок');
      notes = await res.json();
      renderNotes();
    } catch (e) {
      console.error(e);
    }
  } // Загрузка заметок

  async function createNote(note) {
    try {
      await fetch(`${API_BASE}/notes`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(note)
      });
      await fetchNotes();
    } catch (e) {
      console.error(e);
    }
  } // Создание заметки

  async function updateNote(id, note) {
    try {
      await fetch(`${API_BASE}/notes/update`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({...note, id})
      });
      await fetchNotes();
    } catch (e) {
      console.error(e);
    }
  } // Обновление заметки

  async function deleteNote(id) {
    try {
      await fetch(`${API_BASE}/notes/delete`, {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({id})
      });
      await fetchNotes();
    } catch (e) {
      console.error(e);
    }
  } // Удаление заметки

  noteModal.style.display = 'none'; // Скрывает модальное окно создания/редактирования заметки

  addNoteBtn.onclick = () => {
    editingNoteId = null;
    noteText.value = '';
    noteTag.value = 'Идеи';
    noteModal.style.display = 'flex';
  }; // снз

  closeModalBtn.onclick = () => {
    noteModal.style.display = 'none';
  };

  saveNoteBtn.onclick = async () => {
    if (noteText.value.trim() === '') {
      alert('Введите текст заметки!');
      return;
    }
    if (editingNoteId !== null) {
      await updateNote(editingNoteId, {
        text: noteText.value,
        tag: noteTag.value,
        date: new Date().toLocaleDateString('ru-RU', { day: '2-digit',
           month: 'short', 
           year: 'numeric' })
      });
    } 
    else {
      await createNote({
        text: noteText.value,
        tag: noteTag.value,
        date: new Date().toLocaleDateString('ru-RU', 
          { day: '2-digit',
             month: 'short',
              year: 'numeric' })
      });
    }
    noteModal.style.display = 'none';
    viewNoteModal.style.display = 'none';
  };

  function renderNotes() {
    notesList.innerHTML = ''; // Очищаем контейнер
    let filteredNotes = notes.filter(note =>
      (currentTag === 'Все' || note.tag === currentTag) &&
      note.text.toLowerCase().includes(searchQuery.toLowerCase())
    );  // Фильтрация заметок
    
    filteredNotes.forEach(note => {
      const el = document.createElement('div'); // Создание DOM-элементов для каждой заметки
      el.className = 'note'; 

      
      const title = note.text.split('\n')[0];
      
      //  добавление элементов заметки
      const elements = [
        { tag: 'div', className: 'note-title', text: title }, // Заголовок
        { tag: 'div', className: 'note-date', text: note.date }, // Дата
        { tag: 'div', className: 'note-tag-display', text: note.tag } // Тег
      ];
      
      elements.forEach(item => {
        const element = document.createElement(item.tag);
        element.className = item.className;
        element.textContent = item.text;
        el.appendChild(element);
      }); // Динамическое создание элементов
      
     
      const actionsEl = document.createElement('div');
      actionsEl.className = 'note-actions';
      
      
      const editBtn = document.createElement('button');
      editBtn.className = 'edit-btn';
      editBtn.textContent = 'Редактировать';
      
      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'delete-btn';
      deleteBtn.textContent = 'Удалить';
      
      actionsEl.appendChild(editBtn);
      actionsEl.appendChild(deleteBtn);
      el.appendChild(actionsEl);  //Создание кнопок действий
      
      //  обработчики событий
      addEventListeners(el, note, editBtn, deleteBtn);
      
      notesList.appendChild(el);
    });
}

function addEventListeners(el, note, editBtn, deleteBtn) {
  // Клик по самой заметке
  el.onclick = (e) => {
    if (!e.target.classList.contains('edit-btn') && !e.target.classList.contains('delete-btn')) {
      editingNoteId = note.id;
      viewNoteText.value = note.text;
      viewNoteTag.value = note.tag;
      viewNoteModal.style.display = 'flex';
    }
  };
  
  // Обработчики для кнопок
  editBtn.onclick = (e) => {
    e.stopPropagation();
    editingNoteId = note.id;
    noteText.value = note.text;
    noteTag.value = note.tag;
    noteModal.style.display = 'flex';
  };
  
  deleteBtn.onclick = async (e) => {
    e.stopPropagation();
    if (confirm('Удалить заметку?')) {
      await deleteNote(note.id);
    }
  };
}
    });
  

  tagsList.querySelectorAll('li').forEach(tagEl => {
    tagEl.onclick = function () {
      tagsList.querySelector('.active').classList.remove('active');
      this.classList.add('active');
      currentTag = this.dataset.tag;
      renderNotes();
    };
  });

  searchInput.oninput = function () {
    searchQuery = this.value;
    renderNotes();
  };

  document.getElementById('searchBtn').onclick = function () {
    searchQuery = searchInput.value;
    renderNotes();
  };

  window.onclick = e => {
    if (e.target === noteModal) noteModal.style.display = 'none';
  };
  // Обработчики для модального окна просмотра заметки
closeViewModalBtn.onclick = () => {
  viewNoteModal.style.display = 'none';
};

saveViewNoteBtn.onclick = async () => {
  if (viewNoteText.value.trim() === '') {
    alert('Введите текст заметки!');
    return;
  }
  if (editingNoteId !== null) {
    await updateNote(editingNoteId, {
      text: viewNoteText.value,
      tag: viewNoteTag.value,
      date: new Date().toLocaleDateString('ru-RU', { day: '2-digit',
         month: 'short', 
         year: 'numeric' })
    });
  }
  viewNoteModal.style.display = 'none';
};

deleteViewNoteBtn.onclick = async () => {
  if (confirm('Удалить заметку?')) {
    await deleteNote(editingNoteId);
    viewNoteModal.style.display = 'none';
  }
};

// Закрытие модального окна при клике вне его
window.onclick = e => {
  if (e.target === noteModal) noteModal.style.display = 'none';
  if (e.target === viewNoteModal) viewNoteModal.style.display = 'none';
};

  fetchNotes();;

