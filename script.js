// DOM elementlerini seçme
const messageInput = document.getElementById('message-text');
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

  // Girilen mesajı kontrol etme
  if (messageText.trim() !== '') {
    const newMessage = document.createElement('li');
    newMessage.classList.add('message');
    newMessage.textContent = messageText;

    const messageDateTime = document.createElement('span');
    messageDateTime.classList.add('message-datetime');
    messageDateTime.textContent = getCurrentDateTime();
    newMessage.appendChild(messageDateTime);

    messageList.appendChild(newMessage);

    // Mesaj girişini temizleme
    messageInput.value = '';
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
  if (chunks.length > 0) {
    const audioBlob = new Blob(chunks, { type: 'audio/webm' });
    const audioUrl = URL.createObjectURL(audioBlob);

    const newMessage = document.createElement('li');
    newMessage.classList.add('message');

    const audio = document.createElement('audio');
    audio.src = audioUrl;
    audio.controls = true;
    newMessage.appendChild(audio);

    const messageDateTime = document.createElement('span');
    messageDateTime.classList.add('message-datetime');
    messageDateTime.textContent = getCurrentDateTime();
    newMessage.appendChild(messageDateTime);

    messageList.appendChild(newMessage);

    chunks = [];
  }
});

// MediaRecorder kaydedilen veri olayı
if (mediaRecorder) {
  mediaRecorder.ondataavailable = (e) => {
    chunks.push(e.data);
  };

  mediaRecorder.onstop = () => {
    startRecordingButton.disabled = false;
    stopRecordingButton.disabled = true;
    sendAudioButton.disabled = false;
  };
}

// Geçerli tarih ve saati döndüren yardımcı fonksiyon
function getCurrentDateTime() {
  const now = new Date();
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
  const dateTimeString = now.toLocaleDateString('tr-TR', options);
  return dateTimeString;
}
