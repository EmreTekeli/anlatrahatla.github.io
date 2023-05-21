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
    newMessage.textContent = `${messageText} - ${getCurrentDateTime()}`;
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
      newMessage.innerHTML += ` - ${getCurrentDateTime()}`;
      messageList.appendChild(newMessage);
    };

    reader.readAsDataURL(file);
  }
});

// Geçerli tarih ve saati döndüren yardımcı fonksiyon
function getCurrentDateTime() {
  const now = new Date();
  const date = now.toLocaleDateString();
  const time = now.toLocaleTimeString();
  return `${date} ${time}`;
}
