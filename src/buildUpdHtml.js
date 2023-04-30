export default (response) => {
  const items = response;
  const ul = document.querySelector('.list-group');
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
    button.textContent = 'Просмотр';
    button.addEventListener('click', (e) => {
      e.preventDefault();
      a.classList.remove('fw-bold');
      a.classList.add('fw-normal', 'link-secondary');
      document.querySelector('.modal-header > h5').textContent = title;
      document.querySelector('.modal-content > .modal-body').textContent = description;
      document.querySelector('.modal-footer > a').setAttribute('href', href);
    });
    li.append(button);
    ul.prepend(li);
    return null;
  });
};
