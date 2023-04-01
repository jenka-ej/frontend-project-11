import uniqueId from 'lodash/uniqueId';

export default (response) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(response.data, 'text/xml');
  const items = doc.querySelectorAll('item');
  if (document.querySelector('section') === null) {
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
    items.forEach((item) => {
      const id = uniqueId();
      const li = document.createElement('li');
      li.innerHTML = '<li class="list-group-item d-flex justify-content-between align-items-start border-0 border-end-0"></li>';
      const title = item.querySelector('title').textContent;
      const href = item.querySelector('link').textContent;
      const description = item.querySelector('description').textContent;
      const a = document.createElement('a');
      a.innerHTML = `<a href="${href}" class="fw-bold" data-id="${id}" target="_blank" rel="noopener noreferer">${title} / ${description}</a>`;
      li.append(a);
      const button = document.createElement('button');
      button.innerHTML = `<button type="button" class="btn btn-outline-primary btn-sm" data-id="${id}" data-bs-toggle="modal" data-bs-target="#modal">Просмотр</button>`;
      li.append(button);
      ul.append(li);
    });
    document.body.append(section);
  } else {
    const ul = document.querySelector('.list-group');
    items.forEach((item) => {
      const id = uniqueId();
      const li = document.createElement('li');
      li.innerHTML = '<li class="list-group-item d-flex justify-content-between align-items-start border-0 border-end-0"></li>';
      const title = item.querySelector('title').textContent;
      const href = item.querySelector('link').textContent;
      const description = item.querySelector('description').textContent;
      const a = document.createElement('a');
      a.innerHTML = `<a href="${href}" class="fw-bold" data-id="${id}" target="_blank" rel="noopener noreferer">${title} / ${description}</a>`;
      li.append(a);
      const button = document.createElement('button');
      button.innerHTML = `<button type="button" class="btn btn-outline-primary btn-sm" data-id="${id}" data-bs-toggle="modal" data-bs-target="#modal">Просмотр</button>`;
      li.append(button);
      ul.append(li);
    });
  }
};
