#!/usr/bin/env node

import axios, { AxiosError } from 'axios';
import * as bootstrap from 'bootstrap'; // eslint-disable-line no-unused-vars
import './styles/styles.scss';
import * as yup from 'yup';
import onChange from 'on-change';
import i18next from 'i18next';
import resources from './locales/index';
import parser from './parse.js';
import builder from './build.js';
import diff from './buildUpd.js';
import builderUpd from './buildUpdHtml.js';

const language = 'ru';

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
  if (type === 'filling') {
    schema.validate(state.fields)
      .then(() => {
        sendButton.disabled = true;
        feedback.classList.remove('text-danger', 'text-success', 'is-invalid');
        feedback.textContent = '';
      })
      .then(() => axios.get(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(state.fields.link)}`))
      .then((response) => {
        const data = parser(response);
        if (data === null) {
          throw i18nInstance.t('errors.invalidRss');
        }
        state.content.push(data);
      })
      .then(() => {
        state.validLinks.push(state.fields.link);
        if (inputText.classList.contains('is-invalid')) {
          inputText.classList.remove('is-invalid');
        }
        feedback.classList.add('text-success');
        gettingInstance.then(() => {
          feedback.textContent = i18nInstance.t('success');
        });
        builder(state.content, i18nInstance.t);
        inputText.value = '';
        inputText.focus();
        sendButton.removeAttribute('disabled');
        state.processState = '';
      })
      .catch((err) => {
        sendButton.removeAttribute('disabled');
        state.processState = '';
        if (!inputText.classList.contains('is-invalid')) {
          inputText.classList.add('is-invalid');
        }
        feedback.classList.add('text-danger');
        gettingInstance.then(() => {
          const temp = `${err}`;
          if (err instanceof AxiosError) {
            feedback.textContent = i18nInstance.t('errors.axiosError');
          } else if (temp.includes('ValidationError: ')) {
            const [, result] = temp.split('ValidationError: ');
            feedback.textContent = result;
          } else {
            feedback.textContent = temp;
          }
        });
      });
  }
  if (type === 'update') {
    console.log('update');
    state.processState = '';
    if (state.validLinks.length !== 0) {
      state.validLinks.map((link) => {
        axios
          .get(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(link)}`)
          .then((response) => {
            const data = parser(response);
            const difference = diff(data, state.content);
            if (difference.length !== 0) {
              builderUpd(difference, i18nInstance.t);
              const mainContent = state.content.filter((item) => item.mainTitle === data.mainTitle);
              difference.map((post) => mainContent[0].posts.push(post));
            }
          })
          .catch(() => {});
        return null;
      });
    }
  }
  return null;
};

const watchedState = onChange(state, (path, value) => {
  switch (path) {
    case 'processState':
      render(value);
      break;
    default:
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

const updater = () => {
  setTimeout(() => {
    watchedState.processState = 'update';
    updater();
  }, 5000);
};

updater();
