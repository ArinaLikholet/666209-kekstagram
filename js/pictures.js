'use strict';

var DEFAULT_EFFECT = 'none';
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

var EffectParameter = {
  chrome: {
    CLASS: 'effects__preview--chrome',
    PROPERTY: 'grayscale',
    MIN_VALUE: 0,
    MAX_VALUE: 1,
    UNIT: ''
  },
  sepia: {
    CLASS: 'effects__preview--sepia',
    PROPERTY: 'sepia',
    MIN_VALUE: 0,
    MAX_VALUE: 1,
    UNIT: ''
  },
  marvin: {
    CLASS: 'effects__preview--marvin',
    PROPERTY: 'invert',
    MIN_VALUE: 0,
    MAX_VALUE: 100,
    UNIT: '%'
  },
  phobos: {
    CLASS: 'effects__preview--phobos',
    PROPERTY: 'blur',
    MIN_VALUE: 0,
    MAX_VALUE: 3,
    UNIT: 'px'
  },
  heat: {
    CLASS: 'effects__preview--heat',
    PROPERTY: 'brightness',
    MIN_VALUE: 1,
    MAX_VALUE: 3,
    DEVIDER: 50,
    UNIT: ''
  }
};

var EffectValue = {
  MAX: 100,
  DEFAULT: 100,
};
var PinValue = {
  MIN: 0,
  MAX: 100
};
var bigPictureItem = document.querySelector('.big-picture');
var bigPictureCancel = bigPictureItem.querySelector('.big-picture__cancel');
var imgUploadOverlay = document.querySelector('.img-upload__overlay');
var imgUploadButton = document.querySelector('#upload-file');
var imgUploadForm = document.querySelector('.img-upload__form');
var imgCloseButton = document.querySelector('.img-upload__cancel');
var UsersContainer = document.querySelector('.pictures');
var uploadImage = document.querySelector('.img-upload');
// нажатие на ESC
var onButtonEsc = function (evt) {
  if (evt.keyCode === ESC_KEY_CODE) {
    closeUploadWindow();
    closeBigPicture();
  }
};
// открывает форму
var effectLevelForm = uploadImage.querySelector('.effect-level');
var effectLevelFormValue = effectLevelForm.querySelector('.effect-level__value');
var effectPinButton = effectLevelForm.querySelector('.effect-level__pin');
var effectDepthToggle = effectLevelForm.querySelector('.effect-level__depth');
var setDefaultPinPosition = function () {
  effectPinButton.style.left = EffectValue.DEFAULT + '%';
  effectDepthToggle.style.width = effectPinButton.style.left;
};
imgCloseButton.addEventListener('click', function () {
  closeUploadWindow();
});
var openUploadWindow = function () {
  imgUploadOverlay.classList.remove('hidden');
  setDefaultPinPosition();
  setDefaultEffect();
  effectLevelFormValue.value = PinValue.MAX;
  document.removeEventListener('keydown', onButtonEsc);
};
// закрывает форму
var closeUploadWindow = function () {
  imgUploadOverlay.classList.add('hidden');
  imgUploadForm.reset();
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
var imgUploadPreview = document.querySelector('.img-upload__preview');
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

// применение эффекта
var effectsList = uploadImage.querySelector('.effects__list');
var currentEffectName = effectsList.querySelector('.effects__radio:checked').value;
var currentEffectClass = 'effects__preview--' + currentEffectName;
var imgPreviewItem = imgUploadPreview.querySelector('.img-upload__preview img');
var effectLevelLine = effectLevelForm.querySelector('.effect-level__line');

var applyEffect = function (value) {
  switch (currentEffectClass) {

    case EffectParameter.chrome.CLASS:
      imgPreviewItem.style.filter = EffectParameter.chrome.PROPERTY + '(' + (value) / EffectValue.DEFAULT + EffectParameter.chrome.UNIT + ')';
      break;
    case EffectParameter.sepia.CLASS:
      imgPreviewItem.style.filter = EffectParameter.sepia.PROPERTY + '(' + (value) / EffectValue.DEFAULT + EffectParameter.sepia.UNIT + ')';
      break;
    case EffectParameter.marvin.CLASS:
      imgPreviewItem.style.filter = EffectParameter.marvin.PROPERTY + '(' + (value) * EffectParameter.marvin.MAX_VALUE / EffectValue.MAX + EffectParameter.marvin.UNIT + ')';
      break;
    case EffectParameter.phobos.CLASS:
      imgPreviewItem.style.filter = EffectParameter.phobos.PROPERTY + '(' + (value) * EffectParameter.phobos.MAX_VALUE / EffectValue.DEFAULT + EffectParameter.phobos.UNIT + ')';
      break;
    case EffectParameter.heat.CLASS:
      imgPreviewItem.style.filter = EffectParameter.heat.PROPERTY + '(' + ((value) / EffectParameter.heat.DEVIDER + EffectParameter.heat.MIN_VALUE) + EffectParameter.heat.UNIT + ')';
      break;
    default:
      imgPreviewItem.style.filter = '';
  }

};
// imgPreviewItem.style.filter = EffectParameter[currentEffectName].PROPERTY + '(' + value * (EffectParameter[currentEffectName].MAX_VALUE - EffectParameter[currentEffectName].MIN_VALUE) / EffectValue.MAX + EffectParameter[currentEffectName].MIN_VALUE + EffectParameter[currentEffectName].UNIT + ')'
var setDefaultEffect = function () {
  var defaultRadioElement = effectsList.querySelector('#effect-' + DEFAULT_EFFECT);
  defaultRadioElement.checked = true;
  imgPreviewItem.classList = '';
  imgPreviewItem.style.filter = '';
  imgPreviewItem.classList.add(DEFAULT_EFFECT);
  effectLevelForm.classList.add('hidden');
};

// применение эффекта
var onPhotoEffectClick = function (evt) {
  var target = evt.target;
  if (target.tagName !== 'INPUT') {
    return;
  }
  imgPreviewItem.classList = '';

  currentEffectName = target.value;

  currentEffectClass = 'effects__preview--' + currentEffectName;
  imgPreviewItem.classList.add(currentEffectClass);
  if (currentEffectClass !== 'effects__preview--' + DEFAULT_EFFECT) {
    effectLevelForm.classList.remove('hidden');
  } else {
    effectLevelForm.classList.add('hidden');
  }

  effectLevelFormValue.value = EffectValue.DEFAULT;
  applyEffect(EffectValue.DEFAULT);
  setDefaultPinPosition();
};

bigPictureCancel.addEventListener('click', function () {
  closeBigPicture();
});

effectsList.addEventListener('click', onPhotoEffectClick);

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

// Генерация фотографий
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

var setPinPosition = function (value) {
  effectPinButton.style.left = value + '%';
  effectLevelFormValue.value = Math.round(value);
  effectDepthToggle.style.width = effectPinButton.style.left;
};

var onMouseDown = function (evt) {

  var startCoordX = evt.clientX;
  var sliderEffectLineRect = effectLevelLine.getBoundingClientRect();
  var clickedPosition = (startCoordX - sliderEffectLineRect.left) / sliderEffectLineRect.width * 100;

  setPinPosition(clickedPosition);
  applyEffect(clickedPosition);

  var onMouseMove = function (moveEvt) {
    var shiftX = startCoordX - moveEvt.clientX;
    startCoordX = moveEvt.clientX;
    // console.log(moveEvt);
    var movePosition = (effectPinButton.offsetLeft - shiftX) / sliderEffectLineRect.width * 100;
    setPinPosition(movePosition);
    applyEffect(movePosition);
  };

  var onMouseUp = function (upEvt) {
    upEvt.preventDefault();
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mousemove', onMouseUp);
  };

  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
};

effectLevelLine.addEventListener('mousedown', onMouseDown);
