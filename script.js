// DOM elementlerini seçme
const messageInput = document.getElementById('message-text');
const sendTextButton = document.getElementById('send-text-button');
const sendAudioButton = document.getElementById('send-audio-button');
const audioFileInput = document.getElementById('audio-file-input');
const messageList = document.getElementById('message-list');

// Metin ekle düğmesine tıklama olayı
sendTextButton.addEventListener('click', () => {
  const messageText = messageInput.value;

  // Girilen mesajı kontrol etme
  if (messageText.trim() !== '') {
    const newMessage = document.createElement('li');
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

// Ses ekle düğmesine tıklama olayı
sendAudioButton.addEventListener('click', () => {
  audioFileInput.click();
});

// Dosya seçildiğinde
audioFileInput.addEventListener('change', () => {
  const file = audioFileInput.files[0];
  if (file) {
    const reader = new FileReader();

    reader.onload = () => {
      const audioDataUrl = reader.result;

      const newMessage = document.createElement('li');
      const audio = document.createElement('audio');
      audio.src = audioDataUrl;
      audio.controls = true;
      newMessage.appendChild(audio);

      const messageDateTime = document.createElement('span');
      messageDateTime.classList.add('message-datetime');
      messageDateTime.textContent = getCurrentDateTime();
      newMessage.appendChild(messageDateTime);

      messageList.appendChild(newMessage);
    };

    reader.readAsDataURL(file);
  }
});

// Geçerli tarih ve saati döndüren yardımcı fonksiyon
function getCurrentDateTime() {
  const now = new Date();
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
  const dateTimeString = now.toLocaleDateString('tr-TR', options);
  return dateTimeString;
}
