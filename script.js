// DOM elementlerini seçme
const messageInput = document.getElementById('message-text');
const sendButton = document.getElementById('send-button');
const messageList = document.getElementById('message-list');

// Gönder düğmesine tıklama olayı
sendButton.addEventListener('click', () => {
  const messageText = messageInput.value;

  // Girilen mesajı kontrol etme
  if (messageText.trim() !== '') {
    // Yeni mesaj nesnesini oluşturma
    const newMessage = {
      text: messageText,
      timestamp: new Date().toLocaleString(),
      isBlur: true // Mesajı başlangıçta blurlu olarak işaretleme
    };

    // Mesaj listesine yeni mesajı ekleme
    addMessageToList(newMessage);

    // Mesaj girişini temizleme
    messageInput.value = '';
  }
});

// Mesaj listesine mesaj eklemek için işlev
function addMessageToList(message) {
  const li = document.createElement('li');
  li.textContent = `${message.text} - ${message.timestamp}`;

  // Mesaj blurlu ise blur sınıfını ekle
  if (message.isBlur) {
    li.classList.add('blur');
    li.addEventListener('click', () => {
      li.classList.remove('blur'); // Blur sınıfını kaldır
    });
  }

  messageList.appendChild(li);
}

// Mesaj listesini güncelleme fonksiyonu
function updateMessageList() {
  // Mesaj listesini temizleme
  messageList.innerHTML = '';

  // Mesajları döngüyle gezerek listeye ekleme
  messages.forEach((message) => {
    addMessageToList(message);
  });
}
