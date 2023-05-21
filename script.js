// DOM elementlerini seçme
const messageInput = document.getElementById('message-text');
const sendTextButton = document.getElementById('send-text-button');
const sendAudioButton = document.getElementById('send-audio-button');
const recordButton = document.getElementById('record-button');
const stopButton = document.getElementById('stop-button');
const messageList = document.getElementById('message-list');

// Ses kaydetme işlemi için değişkenler
let mediaRecorder;
let chunks = [];

// Kayıt düğmesine tıklama olayı
recordButton.addEventListener('click', () => {
  navigator.mediaDevices.getUserMedia({ audio: true })
    .then((stream) => {
      mediaRecorder = new MediaRecorder(stream);
      mediaRecorder.start();
      chunks = [];

      // Kaydı durdurma
      stopButton.addEventListener('click', () => {
        mediaRecorder.stop();
      });
    })
    .catch((error) => {
      console.error(error);
    });
});

// Ses kaydedildiğinde veri alınması
mediaRecorder.addEventListener('dataavailable', (event) => {
  chunks.push(event.data);
});

// Kayıt durdurulduğunda ses dosyasını oluşturma ve gönderme
mediaRecorder.addEventListener('stop', () => {
  const audioBlob = new Blob(chunks, { type: 'audio/webm' });

  // Ses dosyasını gönderme işlemini gerçekleştirme
  const reader = new FileReader();
  reader.onloadend = function () {
    const audioDataUrl = reader.result;

    // Yeni mesaj nesnesini oluşturma
    const newMessage = {
      type: 'audio',
      content: audioDataUrl,
      timestamp: new Date().toLocaleString(),
    };

    // Mesajı mesajlar dizisine ekleme
    messages.push(newMessage);

    // Mesaj listesini güncelleme
    updateMessageList();
  };
  reader.readAsDataURL(audioBlob);
});

// Yazı gönder düğmesine tıklama olayı
sendTextButton.addEventListener('click', () => {
  const messageText = messageInput.value;

  // Girilen mesajı kontrol etme
  if (messageText.trim() !== '') {
    // Yeni mesaj nesnesini oluşturma
    const newMessage = {
      type: 'text',
      content: messageText,
      timestamp: new Date().toLocaleString(),
    };

    // Mesajı mesajlar dizisine ekleme
    messages.push(newMessage);

    // Mesaj listesini güncelleme
    updateMessageList();

    // Mesaj girişini temizleme
    messageInput.value = '';
  }
});

// Ses gönder düğmesine tıklama olayı
sendAudioButton.addEventListener('click', () => {
  const audioDataUrl = ''; // Ses dosyasının veri URL'sini buraya yerleştirin

  // Girilen sesi kontrol etme
  if (audioDataUrl !== '') {
    // Yeni mesaj nesnesini oluşturma
    const newMessage = {
      type: 'audio',
      content: audioDataUrl,
      timestamp: new Date().toLocaleString(),
    };

    // Mesajı mesajlar dizisine ekleme
    messages.push(newMessage);

    // Mesaj listesini güncelleme
    updateMessageList();
  }
});

// Mesaj listesini güncelleme fonksiyonu
function updateMessageList() {
  // Mesaj listesini temizleme
  messageList.innerHTML = '';

  // Mesajları döngüyle gezerek listeye ekleme
  messages.forEach((message) => {
    const li = document.createElement('li');
    if (message.type === 'text') {
      li.textContent = `${message.content} - ${message.timestamp}`;
    } else if (message.type === 'audio') {
      const audio = document.createElement('audio');
      audio.src = message.content;
      audio.controls = true;
      li.appendChild(audio);
      li.classList.add('audio');
    }
    messageList.appendChild(li);
  });
}
