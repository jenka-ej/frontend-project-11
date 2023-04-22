#!/usr/bin/env node

import axios from 'axios';
import * as bootstrap from 'bootstrap'; // eslint-disable-line no-unused-vars
import './styles/styles.scss';
import * as yup from 'yup';
import onChange from 'on-change';
import i18next from 'i18next';
import resources from './locales/index';
import parser from './parse.js';
import builder from './build.js';

const language = 'en';

const i18nInstance = i18next.createInstance();

const gettingInstance = i18nInstance
  .init({
    lng: language,
    debug: false,
    resources,
  });

const state = {
  processState: '',
  fields: {
    link: '',
  },
  validLinks: [],
  content: [],
};

yup.setLocale({
  mixed: {
    notOneOf: i18nInstance.t('errors.duplicate'),
    required: i18nInstance.t('errors.empty'),
    default: i18nInstance.t('errors.invalid'),
  },
  string: {
    url: i18nInstance.t('errors.invalid'),
  },
});

let schema = yup.object().shape({
  link: yup.string().required().url().notOneOf(state.validLinks),
});

const inputText = document.querySelector('#url-input');
const sendButton = document.querySelector('[type="submit"]');
const feedback = document.querySelector('.feedback');

const render = (type) => {
  if (type === '') {
    return null;
  }
  if (type === 'filling') {
    schema.validate(state.fields)
      .then(() => {
        sendButton.disabled = true;
        if (feedback.classList.contains('text-danger')) {
          feedback.classList.remove('text-danger');
        }
        if (feedback.classList.contains('text-success')) {
          feedback.classList.remove('text-success');
        }
        if (feedback.classList.contains('is-invalid')) {
          feedback.classList.remove('is-invalid');
        }
      })
      .then(() => axios.get(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(state.fields.link)}`))
      .then((response) => {
        const data = parser(response);
        state.content.push(data);
      })
      .then(() => {
        state.validLinks.push(state.fields.link);
        if (inputText.classList.contains('is-invalid')) {
          inputText.classList.remove('is-invalid');
        }
        if (feedback.classList.contains('text-danger')) {
          feedback.classList.replace('text-danger', 'text-success');
        }
        gettingInstance.then(() => {
          feedback.textContent = i18nInstance.t('success');
        });
        builder(state.content);
        inputText.value = '';
        inputText.focus();
        sendButton.removeAttribute('disabled');
        state.processState = '';
        console.log(state.content);
      })
      .catch((err) => {
        state.processState = '';
        if (!inputText.classList.contains('is-invalid')) {
          inputText.classList.add('is-invalid');
        }
        if (feedback.classList.contains('text-success')) {
          feedback.classList.replace('text-success', 'text-danger');
        }
        gettingInstance.then(() => {
          feedback.textContent = err;
        });
      });
  }
};

const watchedState = onChange(state, (path, value) => {
  switch (path) {
    case 'processState':
      render(value);
      break;
    default:
      console.log('default case');
      break;
  }
});

sendButton.addEventListener('click', (event) => {
  event.preventDefault();
  const currentUrl = inputText.value;
  schema = yup.object().shape({
    link: yup.string().required().url().notOneOf(state.validLinks),
  });
  state.fields.link = currentUrl;
  watchedState.processState = 'filling';
});
