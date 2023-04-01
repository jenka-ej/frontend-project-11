#!/usr/bin/env node

import axios from 'axios';
import * as bootstrap from 'bootstrap'; // eslint-disable-line no-unused-vars
import './styles/styles.scss';
import * as yup from 'yup';
import onChange from 'on-change';
import i18next from 'i18next';
import resources from './locales/index';
import parser from './parser.js';

const language = 'en';

const i18nInstance = i18next.createInstance();

const gettingInstance = i18nInstance
  .init({
    lng: language,
    debug: false,
    resources,
  });

const state = {
  fields: {
    link: '',
  },
  validLinks: [],
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
const sendButton = document.querySelector('.btn-primary');
const feedback = document.querySelector('.feedback');

const render = () => {
  schema.validate(state.fields)
    .then(() => axios.get(state.fields.link))
    .then((response) => parser(response))
    .catch((err) => console.log(err))
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
      inputText.value = '';
      inputText.focus();
    })
    .catch((err) => {
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
};

const watchedState = onChange(state.fields, render);

sendButton.addEventListener('click', (event) => {
  event.preventDefault();
  const currentUrl = inputText.value;
  schema = yup.object().shape({
    link: yup.string().required().url().notOneOf(state.validLinks),
  });
  if (watchedState.link === currentUrl) {
    render();
  } else {
    watchedState.link = currentUrl;
  }
});
