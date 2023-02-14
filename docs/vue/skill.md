## 递归

const getSkuList = (specList) => {
  if (specList.length === 0) return [[]];
  const res = [];
  const firstArr = specList.shift() || [];
  const skuArr = getSkuList([...specList]);
  firstArr.forEach((item) => {
    skuArr.forEach((el) => {
      res.push([item, ...el]);
    });
  });
  return res;
};