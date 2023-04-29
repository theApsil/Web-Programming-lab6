$(document).ready(function() {
  $("#gallery").lightGallery();
});

// Создаем пустой массив, который будет заполняться ссылками на изображения
var images = [];

// Проходим циклом по всем изображениям от 1 до 22 и формируем ссылки
for (var i = 1; i <= 9; i++) {
  var src = '/img/' + i + '.jpg';
  images.push({ src: src, thumb: src, subHtml: ' ' });
}

// Добавляем в него все изображения 
images.forEach(function(image) {
  var link = document.createElement('a');
  link.href = image.src;
  link.setAttribute('data-sub-html', image.subHtml);

  var img = document.createElement('img');
  img.src = image.thumb;
  link.appendChild(img);

  document.querySelector('#gallery').appendChild(link);
});
