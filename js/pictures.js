'use strict';

var PHOTOS_COUNT = 25;

var PHOTO_COMMENTS = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
];

var PHOTO_DESCRIPTION = [
  'Тестим новую камеру!',
  'Затусили с друзьями на море',
  'Как же круто тут кормят',
  'Отдыхаем...',
  'Цените каждое мгновенье. Цените тех, кто рядом с вами и отгоняйте все сомненья. Не обижайте всех словами......',
  'Вот это тачка!'
];

// Работа со случайными значениями
var getRandomElement = function (arr) {
  var randomIndex = Math.floor(Math.random() * (arr.length - 1));
  return arr[randomIndex];
};

var getRandomInteger = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Перемешивает массив
var shuffleArray = function (array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
};

// ---- Генерация фотографий -----

var generatePhotoUrl = function (index) {
  return 'photos/' + index + '.jpg';
};

var generateLikesNumber = function () {
  return getRandomInteger(25, 200);
};

var generateSingleComment = function (sentenceCount) {
  var comment = [];
  for (var i = 0; i < sentenceCount; i++) {
    comment.push(getRandomElement(PHOTO_COMMENTS));
  }
  return comment.join(' ');
};

var generateComments = function () {
  var comments = [];
  var commentsCount = getRandomInteger(1, 20);
  for (var i = 0; i < commentsCount; i++) {
    var sentenceCount = getRandomInteger(1, 2);
    comments.push(generateSingleComment(sentenceCount));
  }
  return comments;
};

var renderRandomPicture = function (urlIndex) {
  var randomPicture = {
    url: generatePhotoUrl(urlIndex),
    likes: generateLikesNumber(),
    comments: generateComments(),
    description: getRandomElement(PHOTO_DESCRIPTION)
  };
  return randomPicture;
};

var renderPicturesArr = function () {
  var picArr = [];

  for (var i = 0; i < PHOTOS_COUNT; i++) {
    picArr.push(renderRandomPicture(i + 1));
  }
  return shuffleArray(picArr);
};

var renderPhoto = function (templ, photo) {
  var pictureElement = templ.cloneNode(true);

  pictureElement.querySelector('.picture__img').src = photo.url;
  pictureElement.querySelector('.picture__likes').textContent = photo.likes;
  pictureElement.querySelector('.picture__comments').textContent = photo.comments.length;

  return pictureElement;
};

var renderPictures = function (pictures) {
  var pictureTemplate = document.querySelector('#picture').content.querySelector('.picture');
  var picturesList = document.querySelector('.pictures');
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < pictures.length; i++) {
    var newPictureElement = renderPhoto(pictureTemplate, pictures[i]);
    fragment.appendChild(newPictureElement);
  }
  picturesList.appendChild(fragment);
};

// ---- Генерация комментариев -----

var getAvatarUrl = function () {
  return 'img/avatar-' + getRandomInteger(1, 6) + '.svg';
};

var renderComment = function (templ, comment) {
  var commentElement = templ.cloneNode(true);
  commentElement.querySelector('.social__picture').src = getAvatarUrl();
  commentElement.querySelector('.social__text').textContent = comment;

  return commentElement;
};

var renderCommentsList = function (bigPicture, commentsArr) {
  var socialComment = bigPicture.querySelector('.social__comment');
  var commentsList = bigPicture.querySelector('.social__comments');
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < commentsArr.length; i++) {
    var newCommentElement = renderComment(socialComment, commentsArr[i]);
    fragment.appendChild(newCommentElement);
  }

  while (commentsList.firstChild) {
    commentsList.removeChild(commentsList.firstChild);
  }

  commentsList.appendChild(fragment);
};

var changeBigPicture = function (bigPicture, picture) {
  bigPicture.classList.remove('hidden');
  bigPicture.querySelector('.big-picture__img img').src = picture.url;
  bigPicture.querySelector('.likes-count').textContent = picture.likes;
  bigPicture.querySelector('.comments-count').textContent = picture.comments.length;
  bigPicture.querySelector('.social__caption').textContent = picture.description;
};

var hideCommentLoader = function (bigPicture) {
  bigPicture.querySelector('.social__comment-count').classList.add('visually-hidden');
};

var hideCommentCount = function (bigPicture) {
  bigPicture.querySelector('.comments-loader').classList.add('visually-hidden');
};

var renderBigPicture = function (picture) {
  var bigPicture = document.querySelector('.big-picture');

  changeBigPicture(bigPicture, picture);
  renderCommentsList(bigPicture, picture.comments);
  hideCommentLoader(bigPicture);
  hideCommentCount(bigPicture);
};

var picturesArr = renderPicturesArr();
renderPictures(picturesArr);
renderBigPicture(picturesArr[0]);
