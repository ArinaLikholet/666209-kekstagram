'use strict';

var COMMENTS = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!',
];

var DESCRIPTIONS = [
  'Тестим новую камеру!',
  'Затусили с друзьями на море',
  'Как же круто тут кормят',
  'Отдыхаем...',
  'Цените каждое мгновенье. Цените тех, кто рядом с вами и отгоняйте все сомненья. Не обижайте всех словами......',
  'Вот это тачка!',
];
var picturesArr = [];

var urlPictureArr = [];

var ESC_KEY_CODE = 27;

var MIN_LIKES_COUNT = 15;
var MAX_LIKES_COUNT = 200;

var body = document.querySelector('body');

var bigPictureElement = document.querySelector('.big-picture');
var bigPictureCancel = bigPictureElement.querySelector('.big-picture__cancel');
var imgUploadOverlay = document.querySelector('.img-upload__overlay');
var imgUploadButton = document.querySelector('#upload-file');
var imgUploadForm = document.querySelector('.img-upload__form');
var imgCloseButton = document.querySelector('.img-upload__cancel');
// нажатие на ESC
var onButtonEsc = function (evt) {
  if (evt.keyCode === ESC_KEY_CODE) {
    closeUploadWindow();
    closeBigPicture();
  }
};
// открывает форму
var openUploadWindow = function () {
  imgUploadOverlay.classList.remove('hidden');
  body.classList.remove('modal-open');
  document.removeEventListener('keydown', onButtonEsc);
};
// закрывает форму
var closeUploadWindow = function () {
  imgUploadOverlay.classList.add('hidden');
  imgUploadForm.reset();
  body.classList.remove('modal-open');
  document.removeEventListener('keydown', onButtonEsc);
};
imgUploadButton.addEventListener('change', function () {
  openUploadWindow();
});

imgCloseButton.addEventListener('click', function () {
  closeUploadWindow();
});

// Редактирование размера изображения
var ScaleValue = {
  DEFAULT: 100,
  MIN: 25,
  MAX: 100,
  STEP: 25
};
var scaleControlValue = imgUploadOverlay.querySelector('.scale__control--value');

var setPhotoScale = function (figure) {
  var currentScale = parseInt(scaleControlValue.value, 10);
  currentScale = currentScale + (ScaleValue.STEP * figure);
  if (currentScale >= ScaleValue.MIN && currentScale <= ScaleValue.MAX) {
    scaleControlValue.value = currentScale + '%';
    imgUploadPreview.style.transform = 'scale(' + currentScale / 100 + ')';
  }
};

var scaleControlSmaller = imgUploadOverlay.querySelector('.scale__control--smaller');
var scaleControlBigger = imgUploadOverlay.querySelector('.scale__control--bigger');

scaleControlSmaller.addEventListener('click', function () {
  setPhotoScale(-1);
});

scaleControlBigger.addEventListener('click', function () {
  setPhotoScale(1);
});

var effectLevelPin = imgUploadOverlay.querySelector('.effect-level__pin');
var effectsRadio = document.querySelector('.effects');
var imgUploadPreview = document.querySelector('.img-upload__preview');
effectLevelPin.addEventListener('mouseup', function () {
});
effectsRadio.addEventListener('change', function (e) {
  imgUploadPreview.className = 'img-upload__preview effects__preview--' + e.target.value;
});
// перебрает массив с фото для создания url
function renderPicturesArray() {
  for (var i = 1; i <= 25; i++) {
    urlPictureArr.push('photos/' + i + '.jpg');
  }
}

renderPicturesArray();
// Выбирает случайное целое число
function getRandomInteger(max, min) {
  return Math.floor((Math.random()) * (max - min + 1) + min);
}

function compare() {
  return Math.random() - 0.5;
}

// Выбирает случайный элемент в массиве
function getRandomElementArr(array) {
  return array[getRandomInteger(array.length - 1, 0)];
}

// создает фото url
function createPictureUrl() {
  return urlPictureArr.sort(compare).pop();
}

// Перебирает комментарии и собирает комментарии в список
function renderListOfComments() {
  var commentList = [];
  for (var i = 0; i < getRandomInteger(10, 3); i++) {
    var copyList = COMMENTS.slice().sort(compare);
    commentList.push(getRandomInteger(1, 0) ? copyList[0] : copyList[0] + ' ' + copyList[1]);
  }
  return commentList;
}

// Генерация фотографии
function createPictureObjectList() {
  for (var i = 0; i < 25; i++) {
    picturesArr.push({
      url: createPictureUrl(),
      likes: getRandomInteger(MAX_LIKES_COUNT, MIN_LIKES_COUNT),
      comments: renderListOfComments(),
      description: getRandomElementArr(DESCRIPTIONS),
    });
  }
}

createPictureObjectList();

// перебирает карточки с фото
function renderPictures() {
  var pictureContainer = document.createDocumentFragment();
  var pictureTemplate = document.querySelector('#picture').content;

  for (var i = 0; i < picturesArr.length; i++) {
    var pictureNewTemplate = pictureTemplate.querySelector('.picture').cloneNode(true);
    pictureNewTemplate.setAttribute('data-photo-index', i);
    pictureNewTemplate.querySelector('.picture__img').src = picturesArr[i].url;
    pictureNewTemplate.querySelector('.picture__likes').textContent = picturesArr[i].likes;
    pictureNewTemplate.querySelector('.picture__comments').textContent = picturesArr[i].comments.length;
    pictureNewTemplate.addEventListener('click', function (e) {
      renderPhoto(e.currentTarget.dataset['photoIndex']);
      openBigPicture();
    });

    pictureContainer.appendChild(pictureNewTemplate);
  }
  document.querySelector('.pictures').appendChild(pictureContainer);
}

renderPictures();

// собирет карточку с фото
function renderPhoto(pictureIndex) {
  var commentsContainer = document.querySelector('.social__comments');
  var commentsTemplateContainer = document.createDocumentFragment();
  var picture = picturesArr[pictureIndex];

  bigPictureElement.querySelector('.big-picture__img img').src = picture.url;
  bigPictureElement.querySelector('.likes-count').textContent = picture.likes;
  bigPictureElement.querySelector('.comments-count').textContent = picture.comments.length;
  bigPictureElement.querySelector('.social__caption').textContent = picture.description;

  bigPictureElement.querySelector('.social__comment-count').classList.add('visually-hidden');
  bigPictureElement.querySelector('.comments-loader').classList.add('visually-hidden');

  for (var t = 0; t < Math.min(picture.comments.length, 5); t++) {
    var commentTemplate = bigPictureElement.querySelector('.social__comment').cloneNode(true);

    commentTemplate.querySelector('.social__picture').src = 'img/avatar-' + getRandomInteger(6, 1) + '.svg';
    commentTemplate.querySelector('.social__text').textContent = picture.comments[t];

    commentsTemplateContainer.appendChild(commentTemplate);
  }

  commentsContainer.innerHTML = '';
  commentsContainer.appendChild(commentsTemplateContainer);
}


var openBigPicture = function () {
  bigPictureElement.classList.remove('hidden');
  body.classList.add('modal-open');
  document.addEventListener('keydown', onButtonEsc);
};

var closeBigPicture = function () {
  bigPictureElement.classList.add('hidden');
  body.classList.remove('modal-open');
  document.removeEventListener('keydown', onButtonEsc);
};

bigPictureCancel.addEventListener('click', function () {
  closeBigPicture();
});
