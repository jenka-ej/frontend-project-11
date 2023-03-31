#!/usr/bin/env node

import axios from 'axios';
import * as bootstrap from 'bootstrap'; // eslint-disable-line no-unused-vars
import './styles/styles.scss';
import * as yup from 'yup';
import onChange from 'on-change';
// import { keyBy, has } from 'lodash';
import i18next from 'i18next';
import resources from './locales/index';

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
    .then((response) => {
      console.log(response);
      const parser = new DOMParser();
      const doc = parser.parseFromString(response.data, 'text/xml');
      const items = doc.querySelectorAll('item');
      const section = document.createElement('section');
      section.innerHTML = '<section class="container-fluid container-xxl p-5"></section>';
      const div = document.createElement('div');
      div.innerHTML = '<div class="row"></div>';
      section.append(div);
      const div1 = document.createElement('div');
      div1.innerHTML = '<div class="col-md-10 col-lg-8 order-1 mx-auto posts"></div>';
      div.append(div1);
      const div2 = document.createElement('div');
      div2.innerHTML = '<div class="card border-0"></div>';
      div1.append(div2);
      const div3 = document.createElement('div');
      div3.innerHTML = '<div class="card-body"></div>';
      div2.append(div3);
      const h2 = document.createElement('h2');
      h2.innerHTML = '<h2 class="card-title h4">Посты</h2>';
      div3.append(h2);
      const ul = document.createElement('ul');
      ul.innerHTML = '<ul class="list-group border-0 rounded-0"></ul>';
      div2.append(ul);
      let idCounter = 2;
      items.forEach((item) => {
        const li = document.createElement('li');
        li.innerHTML = '<li class="list-group-item d-flex justify-content-between align-items-start border-0 border-end-0"></li>';
        const title = item.querySelector('title').textContent;
        const href = item.querySelector('link').textContent;
        const description = item.querySelector('description').textContent;
        const a = document.createElement('a');
        a.innerHTML = `<a href="${href}" class="fw-bold" data-id="${idCounter}" target="_blank" rel="noopener noreferer">${title} / ${description}</a>`;
        li.append(a);
        const button = document.createElement('button');
        button.innerHTML = `<button type="button" class="btn btn-outline-primary btn-sm" data-id="${idCounter}" data-bs-toggle="modal" data-bs-target="#modal">Просмотр</button>`;
        li.append(button);
        ul.append(li);
        idCounter += 1;
      });
      document.body.append(section);
    })
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
