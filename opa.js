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
let searchQuery = "";
let currentTag = 'Все';


let notes = [];
if (localStorage.getItem('notesData')) {
notes = JSON.parse(localStorage.getItem('notesData'));
}



noteModal.style.display = 'none';

addNoteBtn.onclick = () => {
noteModal.style.display = 'flex';
noteText.value = '';
noteTag.value = 'Идеи';
};


closeModalBtn.onclick = () => {
noteModal.style.display = 'none';
};


saveNoteBtn.onclick = () => {
if (noteText.value.trim() === '') {
alert('Введите текст заметки!');
return;
}
notes.push({
text: noteText.value,
tag: noteTag.value,
date: new Date().toLocaleDateString('ru-RU', { day: '2-digit', month: 'short', year: 'numeric' }),
});


localStorage.setItem('notesData', JSON.stringify(notes));


noteModal.style.display = 'none';
renderNotes();
};


function renderNotes() {
notesList.innerHTML = '';
let filteredNotes = notes.filter(note =>
(currentTag === 'Все' || note.tag === currentTag) &&
note.text.toLowerCase().includes(searchQuery.toLowerCase())
);
filteredNotes.forEach(note => {
const el = document.createElement('div');
el.className = 'note';
el.innerHTML = `
<div class="note-header">
<span class="note-title">${note.text}</span>
<span class="tag">${note.tag}</span>
</div>
<div class="note-date">${note.date}</div>
`;
notesList.appendChild(el);
});
}


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


renderNotes();
});