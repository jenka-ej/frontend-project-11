export default (response, i18n, type) => {
  let items;
  if (type === 'filling') {
    const data = response[response.length - 1];
    items = data.posts.reverse();
    const divPosts = document.querySelector('.posts');
    const divFeeds = document.querySelector('.feeds');
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
      h2.textContent = i18n('posts');
      div3.append(h2);
      const h22 = document.createElement('h2');
      h22.classList.add('card-title', 'h4');
      h22.textContent = i18n('feeds');
      div32.append(h22);
      const ul = document.createElement('ul');
      ul.classList.add('list-group', 'border-0', 'rounded-0');
      div2.append(ul);
      const ul2 = document.createElement('ul');
      ul2.classList.add('list-group', 'border-0', 'rounded-0');
      div22.append(ul2);
      const { mainTitle } = data;
      const { mainDescription } = data;
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
    } else {
      const { mainTitle } = data;
      const { mainDescription } = data;
      const mainLi = document.createElement('li');
      const ul2 = document.querySelector('.feeds > .card > .list-group');
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
    }
  } else if (type === 'update') {
    items = response;
  }
  const list = document.querySelector('.list-group');
  items.map((item) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');
    const { title } = item;
    const { href } = item;
    const { description } = item;
    const { id } = item;
    const a = document.createElement('a');
    a.setAttribute('href', href);
    a.classList.add('fw-bold');
    a.setAttribute('data-id', id);
    a.setAttribute('target', '_blank');
    a.setAttribute('rel', 'noopener noreferer');
    a.textContent = title;
    a.addEventListener('click', () => {
      a.classList.remove('fw-bold');
      a.classList.add('fw-normal', 'link-secondary');
    });
    li.append(a);
    const button = document.createElement('button');
    button.setAttribute('type', 'button');
    button.classList.add('btn', 'btn-outline-primary', 'btn-sm');
    button.setAttribute('data-id', id);
    button.setAttribute('data-bs-toggle', 'modal');
    button.setAttribute('data-bs-target', '#modal');
    button.textContent = i18n('buttons.watch');
    button.addEventListener('click', (e) => {
      e.preventDefault();
      a.classList.remove('fw-bold');
      a.classList.add('fw-normal', 'link-secondary');
      document.querySelector('.modal-header > h5').textContent = title;
      document.querySelector('.modal-content > .modal-body').textContent = description;
      document.querySelector('.modal-footer > a').setAttribute('href', href);
    });
    li.append(button);
    list.prepend(li);
    return null;
  });
};
