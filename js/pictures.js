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
var pictures = [];

var picturesUrl = [];

var ESC_KEY_CODE = 27;

var MIN_LIKES_COUNT = 15;
var MAX_LIKES_COUNT = 200;

var MIN_COMMENTS_COUNT = 3;
var MAX_COMMENTS_COUNT = 10;

var body = document.querySelector('body');

var bigPictureItem = document.querySelector('.big-picture');
var bigPictureCancel = bigPictureItem.querySelector('.big-picture__cancel');
var imgUploadOverlay = document.querySelector('.img-upload__overlay');
var imgUploadButton = document.querySelector('#upload-file');
var imgUploadForm = document.querySelector('.img-upload__form');
var imgCloseButton = document.querySelector('.img-upload__cancel');
var UsersContainer = document.querySelector('.pictures');
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
  STEP: 25,
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
var renderPicturesArray = function () {
  for (var i = 1; i <= 25; i++) {
    picturesUrl.push('photos/' + i + '.jpg');
  }
};

renderPicturesArray();
// Выбирает случайное целое число
var getRandomInteger = function (max, min) {
  return Math.floor((Math.random()) * (max - min + 1) + min);
};

var compare = function () {
  return Math.random() - 0.5;
};

// Выбирает случайный элемент в массиве
var getRandomElementArr = function (array) {
  return array[getRandomInteger(array.length - 1, 0)];
};

// создает фото url
var createPictureUrl = function () {
  return picturesUrl.sort(compare).pop();
};

// Перебирает комментарии и собирает комментарии в список
var renderListOfComments = function () {
  var commentList = [];
  for (var i = 0; i < getRandomInteger(MAX_COMMENTS_COUNT, MIN_COMMENTS_COUNT); i++) {
    var copyList = COMMENTS.slice().sort(compare);
    commentList.push(getRandomInteger(1, 0) ? copyList[0] : copyList[0] + ' ' + copyList[1]);
  }
  return commentList;
};

// Генерация фотографии
var createPictureObjectList = function () {
  for (var i = 0; i < 25; i++) {
    pictures.push({
      url: createPictureUrl(),
      likes: getRandomInteger(MAX_LIKES_COUNT, MIN_LIKES_COUNT),
      comments: renderListOfComments(),
      description: getRandomElementArr(DESCRIPTIONS),
    });
  }
};

createPictureObjectList();

// перебирает карточки с фото

var pictureContainer = document.createDocumentFragment();
var pictureTemplate = document.querySelector('#picture').content;


var renderPictures = function () {

  for (var i = 0; i < pictures.length; i++) {
    var pictureNewTemplate = pictureTemplate.querySelector('.picture').cloneNode(true);
    pictureNewTemplate.setAttribute('data-photo-index', i);
    pictureNewTemplate.querySelector('.picture__img').src = pictures[i].url;
    pictureNewTemplate.querySelector('.picture__likes').textContent = pictures[i].likes;
    pictureNewTemplate.querySelector('.picture__comments').textContent = pictures[i].comments.length;
    pictureNewTemplate.addEventListener('click', function (e) {
      renderPhoto(e.currentTarget.dataset['photoIndex']);
      openBigPicture();
    });

    pictureContainer.appendChild(pictureNewTemplate);
  }
  UsersContainer.appendChild(pictureContainer);
};

renderPictures();
var commentsContainer = document.querySelector('.social__comments');
var pictureUrl = bigPictureItem.querySelector('.big-picture__img img');
var pictureLikes = bigPictureItem.querySelector('.likes-count');
var pictureCommentsLength = bigPictureItem.querySelector('.comments-count');
var pictureDescription = bigPictureItem.querySelector('.social__caption');
var pictureCommentsCount = bigPictureItem.querySelector('.social__comment-count');
var newCommentButton = bigPictureItem.querySelector('.comments-loader');
// собирет карточку с фото

var renderPhoto = function (pictureIndex) {
  var commentsTemplateContainer = document.createDocumentFragment();
  var picture = pictures[pictureIndex];
  pictureUrl.src = picture.url;
  pictureLikes.textContent = picture.likes;
  pictureCommentsLength.textContent = picture.comments.length;
  pictureDescription.textContent = picture.description;

  pictureCommentsCount.classList.add('visually-hidden');
  newCommentButton.classList.add('visually-hidden');

  for (var t = 0; t < Math.min(picture.comments.length, 5); t++) {
    var commentTemplate = bigPictureItem.querySelector('.social__comment').cloneNode(true);

    commentTemplate.querySelector('.social__picture').src = 'img/avatar-' + getRandomInteger(6, 1) + '.svg';
    commentTemplate.querySelector('.social__text').textContent = picture.comments[t];

    commentsTemplateContainer.appendChild(commentTemplate);
  }

  commentsContainer.innerHTML = '';
  commentsContainer.appendChild(commentsTemplateContainer);
};


var openBigPicture = function () {
  bigPictureItem.classList.remove('hidden');
  body.classList.add('modal-open');
  document.addEventListener('keydown', onButtonEsc);
};

var closeBigPicture = function () {
  bigPictureItem.classList.add('hidden');
  body.classList.remove('modal-open');
  document.removeEventListener('keydown', onButtonEsc);
};

bigPictureCancel.addEventListener('click', function () {
  closeBigPicture();
});
