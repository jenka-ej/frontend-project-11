#!/usr/bin/env node

import * as bootstrap from 'bootstrap'; // eslint-disable-line no-unused-vars
import './styles/styles.scss';
import * as yup from 'yup';
import onChange from 'on-change';
import { keyBy, has } from 'lodash';
import i18n from 'i18n';
import resources from './locales/index';

const language = 'ru';

const i18nInstance = i18n.createInstance();

const gettingInstance = i18nInstance
  .init({
    lng: language,
    debug: false,
    resources,
  });

const state = {
  link: '',
};

const validLinks = [];

const schema = yup.object().shape({
  link: yup.string().required().url(),
});

const validate = (fields) => {
  try {
    schema.validateSync(fields, { abortEarly: false });
    return {};
  } catch (e) {
    return keyBy(e.inner, 'path');
  }
};

const inputText = document.querySelector('#url-input');
const sendButton = document.querySelector('.btn-primary');

const render = () => {
  const validLink = !has(validate(state), 'link');
  if (validLink && !validLinks.includes(state.link)) {
    validLinks.push(state.link);
    if (inputText.classList.contains('is-invalid')) {
      inputText.classList.remove('is-invalid');
    }
    inputText.value = '';
    inputText.focus();
  } else if (!inputText.classList.contains('is-invalid')) {
    inputText.classList.add('is-invalid');
  }
};

const watchedState = onChange(state, render);

sendButton.addEventListener('click', (event) => {
  event.preventDefault();
  const currentUrl = inputText.value;
  if (watchedState.link === currentUrl) {
    render();
  } else {
    watchedState.link = currentUrl;
  }
});
