import uniqueId from 'lodash/uniqueId';

export default (response) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(response.data.contents, 'text/xml');
  const items = doc.querySelectorAll('item');
  const divPosts = document.querySelector('.posts');
  const divFeeds = document.querySelector('.feeds');
  const data = [];
  if (!divPosts.hasChildNodes()) {
    const div2 = document.createElement('div');
    div2.classList.add('card', 'border-0');
    divPosts.append(div2);
    const div22 = document.createElement('div');
    div22.classList.add('card', 'border-0');
    divFeeds.append(div22);
    const div3 = document.createElement('div');
    div3.classList.add('card-body');
    div2.append(div3);
    const div32 = document.createElement('div');
    div32.classList.add('card-body');
    div22.append(div32);
    const h2 = document.createElement('h2');
    h2.classList.add('card-title', 'h4');
    h2.textContent = 'Посты';
    div3.append(h2);
    const h22 = document.createElement('h2');
    h22.classList.add('card-title', 'h4');
    h22.textContent = 'Фиды';
    div32.append(h22);
    const ul = document.createElement('ul');
    ul.classList.add('list-group', 'border-0', 'rounded-0');
    div2.append(ul);
    const ul2 = document.createElement('ul');
    ul2.classList.add('list-group', 'border-0', 'rounded-0');
    div22.append(ul2);
    const mainTitle = doc.querySelector('channel > title').textContent;
    const mainDescription = doc.querySelector('channel > description').textContent;
    console.log(mainTitle, mainDescription);
    const mainLi = document.createElement('li');
    mainLi.classList.add('list-group-item', 'border-0', 'border-end-0');
    ul2.append(mainLi);
    const mainH = document.createElement('h3');
    mainH.classList.add('h6', 'm-0');
    mainH.textContent = mainTitle;
    mainLi.append(mainH);
    const mainP = document.createElement('p');
    mainP.classList.add('m-0', 'small', 'text-black-50');
    mainP.textContent = mainDescription;
    mainLi.append(mainP);
    items.forEach((item) => {
      const id = uniqueId();
      const li = document.createElement('li');
      li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');
      const title = item.querySelector('title').textContent;
      const href = item.querySelector('link').textContent;
      const description = item.querySelector('description').textContent;
      data.push({
        title, href, description, id,
      });
      const a = document.createElement('a');
      a.setAttribute('href', href);
      a.classList.add('fw-bold');
      a.setAttribute('data-id', id);
      a.setAttribute('target', '_blank');
      a.setAttribute('rel', 'noopener noreferer');
      a.textContent = title;
      li.append(a);
      const button = document.createElement('button');
      button.setAttribute('type', 'button');
      button.classList.add('btn', 'btn-outline-primary', 'btn-sm');
      button.setAttribute('data-id', id);
      button.setAttribute('data-bs-toggle', 'modal');
      button.setAttribute('data-bs-target', '#modal');
      button.textContent = 'Просмотр';
      li.append(button);
      ul.append(li);
    });
    return data;
  }
  const mainTitle = doc.querySelector('channel > title').textContent;
  const mainDescription = doc.querySelector('channel > description').textContent;
  const mainLi = document.createElement('li');
  const ul2 = document.querySelector('.feeds > .card > .list-group');
  const ul = document.querySelector('.list-group');
  mainLi.classList.add('list-group-item', 'border-0', 'border-end-0');
  ul2.prepend(mainLi);
  const mainH = document.createElement('h3');
  mainH.classList.add('h6', 'm-0');
  mainH.textContent = mainTitle;
  mainLi.append(mainH);
  const mainP = document.createElement('p');
  mainP.classList.add('m-0', 'small', 'text-black-50');
  mainP.textContent = mainDescription;
  mainLi.append(mainP);
  items.forEach((item) => {
    const id = uniqueId();
    const li = document.createElement('li');
    li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');
    const title = item.querySelector('title').textContent;
    const href = item.querySelector('link').textContent;
    const description = item.querySelector('description').textContent;
    data.push({
      title, href, description, id,
    });
    const a = document.createElement('a');
    a.setAttribute('href', href);
    a.classList.add('fw-bold');
    a.setAttribute('data-id', id);
    a.setAttribute('target', '_blank');
    a.setAttribute('rel', 'noopener noreferer');
    a.textContent = title;
    li.append(a);
    const button = document.createElement('button');
    button.setAttribute('type', 'button');
    button.classList.add('btn', 'btn-outline-primary', 'btn-sm');
    button.setAttribute('data-id', id);
    button.setAttribute('data-bs-toggle', 'modal');
    button.setAttribute('data-bs-target', '#modal');
    button.textContent = 'Просмотр';
    li.append(button);
    ul.prepend(li);
  });
  return data;
};
