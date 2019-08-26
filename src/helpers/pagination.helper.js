

export default async (page, limit, counter) => {
  let pageN = parseInt(page, 10);
  if (isNaN(pageN) || page < 1) {
    pageN = 1;
  }
  let limitS = parseInt(limit, 10);
  if (isNaN(limitS)) {
    limitS = 10;
  } else if (limitS > 50) {
    limitS = 50;
  } else if (limitS < 1) {
    limitS = 1;
  }
  let offset = (page - 1) * limit;
  if (offset >= counter) {
    offset = 0;
  }
  return {
    limit,
    offset
  };
};
