// DOM elementlerini seçme
const messageInput = document.getElementById('message-text');
const messageTitleInput = document.getElementById('message-title');
const sendTextButton = document.getElementById('send-text-button');
const startRecordingButton = document.getElementById('start-recording-button');
const stopRecordingButton = document.getElementById('stop-recording-button');
const sendAudioButton = document.getElementById('send-audio-button');
const messageList = document.getElementById('message-list');

let mediaRecorder;
let chunks = [];

// Metin ekle düğmesine tıklama olayı
sendTextButton.addEventListener('click', () => {
  const messageText = messageInput.value;
  const messageTitle = messageTitleInput.value;

  // Başlık ve mesajı kontrol etme
  if (messageTitle.trim() !== '' && messageText.trim() !== '') {
    createMessage(messageTitle, messageText);
  }
});

// Kaydı başlat düğmesine tıklama olayı
startRecordingButton.addEventListener('click', () => {
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then((stream) => {
        mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.start();
        chunks = [];

        startRecordingButton.disabled = true;
        stopRecordingButton.disabled = false;
        sendAudioButton.disabled = true;

        // MediaRecorder kaydedilen veri olayı
        mediaRecorder.ondataavailable = (e) => {
          chunks.push(e.data);
        };

        mediaRecorder.onstop = () => {
          startRecordingButton.disabled = false;
          stopRecordingButton.disabled = true;
          sendAudioButton.disabled = false;
        };
      })
      .catch((error) => {
        console.error('Mikrofon erişimi hatası:', error);
      });
  } else {
    console.error('Tarayıcınızda mikrofon desteği bulunmamaktadır.');
  }
});

// Kaydı durdur düğmesine tıklama olayı
stopRecordingButton.addEventListener('click', () => {
  if (mediaRecorder && mediaRecorder.state === 'recording') {
    mediaRecorder.stop();
    startRecordingButton.disabled = false;
    stopRecordingButton.disabled = true;
    sendAudioButton.disabled = false;
  }
});

// Ses ekle düğmesine tıklama olayı
sendAudioButton.addEventListener('click', () => {
  const messageTitle = messageTitleInput.value;
  const audioDescription = prompt('Ses açıklamasını girin:'); // İsteğe bağlı ses açıklaması

  if (chunks.length > 0) {
    const audioBlob = new Blob(chunks, { type: 'audio/webm' });
    const audioUrl = URL.createObjectURL(audioBlob);

    createMessage(messageTitle, '', audioUrl, audioDescription);

    chunks = [];
  }
});

// Yeni bir mesaj oluşturmak için yardımcı fonksiyon
function createMessage(title, text, audioUrl = '', audioDescription = '') {
  const newMessage = document.createElement('li');
  newMessage.classList.add('message');

  if (title) {
    const messageHeader = document.createElement('h3');
    messageHeader.textContent = title;
    newMessage.appendChild(messageHeader);
  }

  if (text) {
    const messageContent = document.createElement('p');
    messageContent.textContent = text;
    newMessage.appendChild(messageContent);
  }

  if (audioUrl) {
    const audio = document.createElement('audio');
    audio.src = audioUrl;
    audio.controls = true;
    newMessage.appendChild(audio);
  }

  if (audioDescription) {
    const audioDescriptionParagraph = document.createElement('p');
    audioDescriptionParagraph.textContent = audioDescription;
    newMessage.appendChild(audioDescriptionParagraph);
  }

  const messageDateTime = document.createElement('span');
  messageDateTime.classList.add('message-datetime');
  messageDateTime.textContent = getCurrentDateTime();
  newMessage.appendChild(messageDateTime);

  const likeButton = document.createElement('button');
  likeButton.textContent = 'Beğen';
  likeButton.classList.add('like-button');
  newMessage.appendChild(likeButton);

  const dislikeButton = document.createElement('button');
  dislikeButton.textContent = 'Beğenme';
  dislikeButton.classList.add('dislike-button');
  newMessage.appendChild(dislikeButton);

  let likeCount = 0;
  let dislikeCount = 0;

  likeButton.addEventListener('click', () => {
    if (!likeButton.disabled) {
      if (likeButton.classList.contains('active')) {
        likeCount--;
        likeButton.classList.remove('active');
      } else {
        likeCount++;
        likeButton.classList.add('active');
        dislikeCount = 0;
        dislikeButton.classList.remove('active');
      }
      
      likeButton.textContent = 'Beğen' + (likeCount > 0 ? ' (' + likeCount + ')' : '');
      dislikeButton.textContent = 'Beğenme' + (dislikeCount > 0 ? ' (' + dislikeCount + ')' : '');
    }
  });

  dislikeButton.addEventListener('click', () => {
    if (!dislikeButton.disabled) {
      if (dislikeButton.classList.contains('active')) {
        dislikeCount--;
        dislikeButton.classList.remove('active');
      } else {
        dislikeCount++;
        dislikeButton.classList.add('active');
        likeCount = 0;
        likeButton.classList.remove('active');
      }
      
      dislikeButton.textContent = 'Beğenme' + (dislikeCount > 0 ? ' (' + dislikeCount + ')' : '');
      likeButton.textContent = 'Beğen' + (likeCount > 0 ? ' (' + likeCount + ')' : '');
    }
  });

  messageList.appendChild(newMessage);

  // Başlık ve mesaj girişlerini temizleme
  messageTitleInput.value = '';
  messageInput.value = '';
}

// Geçerli tarih ve saati döndüren yardımcı fonksiyon
function getCurrentDateTime() {
  const now = new Date();
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
  const dateTimeString = now.toLocaleDateString('tr-TR', options);
  return dateTimeString;
}
