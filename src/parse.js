import uniqueId from 'lodash/uniqueId';

export default (response) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(response.data.contents, 'text/xml');
  if (!doc.querySelector('rss')) {
    return null;
  }
  const items = doc.querySelectorAll('item').reverse();
  const mainTitle = doc.querySelector('channel > title').textContent;
  const mainDescription = doc.querySelector('channel > description').textContent;
  const data = { mainTitle, mainDescription, posts: [] };
  items.forEach((item) => {
    const id = uniqueId();
    const title = item.querySelector('title').textContent;
    const href = item.querySelector('link').textContent;
    const description = item.querySelector('description').textContent;
    data.posts.push({
      title, description, href, id,
    });
  });
  return data;
};
