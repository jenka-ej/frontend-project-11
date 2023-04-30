export default (updData, bigData) => {
  const mainData = bigData.filter((bigDataEl) => bigDataEl.mainTitle === updData.mainTitle)[0];
  const diffData = [];
  updData.posts.map((updDataItem) => {
    const duplicate = mainData.posts.filter((mainDataEl) => updDataItem.href === mainDataEl.href);
    if (duplicate.length === 0) {
      diffData.push(updDataItem);
    }
    return null;
  });
  return diffData;
};
