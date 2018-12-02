'use strict';

var PHOTOS_QUANTITY = 25;
var MIN_COMMENTS_COUNT = 1;
var MAX_COMMENTS_COUNT = 20;
var ENTER_KEY_CODE = 27;
var COMMENTS = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
];

var DESCRIPTIONS = [
  'Тестим новую камеру!',
  'Затусили с друзьями на море',
  'Как же круто тут кормят',
  'Отдыхаем...',
  'Цените каждое мгновенье. Цените тех, кто рядом с вами и отгоняйте все сомненья. Не обижайте всех словами......',
  'Вот это тачка!'
];
// блок полноразмерных фотографий
var bigPictureElement = document.querySelector('.big-picture');

// Выбирает случайный элемент
var getRandomElement = function (arr) {
  var randomIndex = Math.floor(Math.random() * (arr.length));
  return arr[randomIndex];
};
// Выбирает случайное целое число
var getRandomInteger = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Перемешивает массив
var shuffleArray = function (array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = getRandomInteger(1, array.length - 1);
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
};

// Генерация фотографии
// создает фото url
var createPhotoUrl = function (index) {
  return 'photos/' + index + '.jpg';
};
// выбирает случайное количество лайков
var getLikesQuantity = function () {
  return getRandomInteger(15, 200);
};
// выбирает комментарий
var generateComment = function (sentencesCount) {
  var comment = [];
  for (var i = 0; i < sentencesCount; i++) {
    comment.push(getRandomElement(COMMENTS));
  }
  return comment.join(' ');
};
// создает список комментариев
var generateComments = function () {
  var comments = [];
  var commentsCount = getRandomInteger(MIN_COMMENTS_COUNT, MAX_COMMENTS_COUNT);
  for (var i = 0; i < commentsCount; i++) {
    var sentenceCount = getRandomInteger(1, 2);
    comments.push(generateComment(sentenceCount));
  }
  return comments;
};
// выбирает случайное фото
var renderRandomPicture = function (urlIndex) {
  var randomPicture = {
    url: createPhotoUrl(urlIndex),
    likes: getLikesQuantity(),
    comments: generateComments(),
    description: getRandomElement(DESCRIPTIONS)
  };
  return randomPicture;
};
// перебирает массив с фото
var renderPicturesArray = function () {
  var picturesArr = [];

  for (var i = 0; i < PHOTOS_QUANTITY; i++) {
    picturesArr.push(renderRandomPicture(i + 1));
  }
  return shuffleArray(picturesArr);
};
// собирет карточку с фото
var renderPhoto = function (template, photo) {
  var pictureElement = template.cloneNode(true);

  pictureElement.querySelector('.picture__img').src = photo.url;
  pictureElement.querySelector('.picture__likes').textContent = photo.likes;
  pictureElement.querySelector('.picture__comments').textContent = photo.comments.length;

  pictureElement.addEventListener('click', function () {
    openBigPicture();
    renderPhoto();
  });
  return pictureElement;
};

// перебирает карточки с фото
var pictureTemplate = document.querySelector('#picture').content.querySelector('.picture');
var picturesList = document.querySelector('.pictures');

var renderPictures = function (pictures) {
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < pictures.length; i++) {
    var newPictureElement = renderPhoto(pictureTemplate, pictures[i]);
    fragment.appendChild(newPictureElement);
  }
  picturesList.appendChild(fragment);
};

// Генерирует комментарии

var getAvatarUrl = function () {
  return 'img/avatar-' + getRandomInteger(1, 6) + '.svg';
};

var renderComment = function (template, comment) {
  var commentsElement = template.cloneNode(true);
  commentsElement.querySelector('.social__picture').src = getAvatarUrl();
  commentsElement.querySelector('.social__text').textContent = comment;

  return commentsElement;
};
// собирает комментарии
var renderListOfComments = function (mainPicture, commentsArr) {
  var commentForImg = mainPicture.querySelector('.social__comment');
  var listOfComments = mainPicture.querySelector('.social__comments');
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < commentsArr.length; i++) {
    var newCommentElement = renderComment(commentForImg, commentsArr[i]);
    fragment.appendChild(newCommentElement);
  }

  while (listOfComments.firstChild) {
    listOfComments.removeChild(listOfComments.firstChild);
  }

  listOfComments.appendChild(fragment);
};
// изменяет основное фото
var changeMainPicture = function (mainPicture, picture) {
  mainPicture.classList.remove('hidden');
  mainPicture.querySelector('.big-picture__img img').src = picture.url;
  mainPicture.querySelector('.likes-count').textContent = picture.likes;
  mainPicture.querySelector('.comments-count').textContent = picture.comments.length;
  mainPicture.querySelector('.social__caption').textContent = picture.description;
};
// скрывает блок .social__comment-count
var hideCommentCount = function (mainPicture) {
  mainPicture.querySelector('.social__comment-count').classList.add('visually-hidden');
};
// скрывает блок .comments-loader
var hideCommentsLoader = function (mainPicture) {
  mainPicture.querySelector('.comments-loader').classList.add('visually-hidden');
};
// генерирует случайный блок с картинкой и комментами

var mainPicture = document.querySelector('.big-picture');

var renderMainPicture = function (picture) {
  changeMainPicture(mainPicture, picture);
  renderListOfComments(mainPicture, picture.comments);
  hideCommentCount(mainPicture);
  hideCommentsLoader(mainPicture);
};

var picturesArr = renderPicturesArray();
renderPictures(picturesArr);
renderMainPicture(picturesArr[0]);

// Загрузка изображения и показ формы редактирования
// загрузка изображения
var imgUploadOverlay = document.querySelector('.img-upload__overlay');
var imgUploadButton = document.getElementById('upload-file');
var imgCloseButton = document.getElementById('upload-cancel');
var imgUploadForm = document.querySelector('.img-upload__form');

var openUploadWindow = function () {
  imgUploadOverlay.classList.remove('hidden');
  document.addEventListener('keydown', function (evt) {
    if (evt.keyCode === ENTER_KEY_CODE) {
      imgUploadOverlay.classList.add('hidden');
      imgUploadForm.reset();
    }
  });
};

var closeUploadWindow = function () {
  imgUploadOverlay.classList.add('hidden');
  imgUploadForm.reset();
};

imgUploadButton.addEventListener('change', function () {
  openUploadWindow();
});

imgCloseButton.addEventListener('click', function () {
  closeUploadWindow();
});


// Применение эффекта для изображения
var effectLevelPin = imgUploadOverlay.querySelector('.effect-level__pin');
var imgUploadPreview = imgUploadOverlay.querySelector('.img-upload__preview');
var effectsRadio = imgUploadOverlay.querySelectorAll('.effects__radio');
var allClassRadio = ['effects__preview--none', 'effects__preview--chrome', 'effects__preview--sepia', 'effects__preview--marvin', 'effects__preview--phobos', 'effects__preview--heat'];

effectLevelPin.addEventListener('mouse', function () {
});

var addEffect = function (radio, effect) {
  radio.addEventListener('click', function () {
    if (effect === 'effects__preview--none') {
      effectLevelPin.classList.add('hidden');
    } else {
      effectLevelPin.classList.remove('hidden');
    }
    imgUploadPreview.querySelector('img').removeAttribute('class');
    imgUploadPreview.querySelector('img').classList.add(effect);
  });
};

for (var i = 0; i < effectsRadio.length; i++) {
  addEffect(effectsRadio[i], allClassRadio[i]);
}

// Редактирование размера изображения
var scaleControlSmaller = imgUploadOverlay.querySelector('.scale__control--smaller');
var scaleControlBigger = imgUploadOverlay.querySelector('.scale__control--bigger');
var scaleControlValue = imgUploadOverlay.querySelector('.scale__control--value').getAttribute('value'); // считает от этого значения
var scaleControlValueMonitor = imgUploadOverlay.querySelector('.scale__control--value');
var SCALE_STEP = 25;
var MIN_SCALE = 25;
var MAX_SCALE = 100;

var decreaseScale = function () {
  if (parseFloat(scaleControlValue) !== MIN_SCALE) {
    var currentValue = parseFloat(scaleControlValue) - SCALE_STEP + '%';
    scaleControlValueMonitor.setAttribute('value', currentValue);
    imgUploadPreview.querySelector('img').style.transform = 'scale(0.75)';
  } else {
    currentValue = parseFloat(scaleControlValue);
    imgUploadPreview.querySelector('img').style.transform = 'scale(0.25)';
  }
};

var increaseScale = function () {
  if (parseFloat(scaleControlValue) !== MAX_SCALE) {
    var currentValue = parseFloat(scaleControlValue) + SCALE_STEP + '%';
    scaleControlValueMonitor.setAttribute('value', currentValue);
    imgUploadPreview.querySelector('img').style.transform = 'scale(0.' + currentValue + ')'; // в таком формате не работает
  } else {
    currentValue = parseFloat(scaleControlValue);
    imgUploadPreview.querySelector('img').style.transform = 'scale(1)';
  }
};

scaleControlSmaller.addEventListener('click', function () {
  decreaseScale();
});

scaleControlBigger.addEventListener('click', function () {
  increaseScale();
});

// Показ изображения в полноэкранном режиме

var bigPictureCancel = bigPictureElement.querySelector('.big-picture__cancel');

var openBigPicture = function () {
  bigPictureElement.classList.remove('hidden');
  document.addEventListener('keydown', function (evt) {
    if (evt.keyCode === ENTER_KEY_CODE) {
      bigPictureElement.classList.add('hidden');
    }
  });
};

var closeBigPicture = function () {
  bigPictureElement.classList.add('hidden');
};

bigPictureCancel.addEventListener('click', function () {
  closeBigPicture();
});
