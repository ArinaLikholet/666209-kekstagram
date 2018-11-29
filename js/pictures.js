'use strict';

var PHOTOS_QUANTITY = 25;
var MIN_COMMENTS_COUNT = 1;
var MAX_COMMENTS_COUNT = 20;
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