export const normalizeText = (text = '') =>
  text
    .replace(/\s+/g, ' ')
    .replace(/[–—]/g, '-')
    .trim()
    .toLowerCase();

export const isSameText = (left = '', right = '') =>
  normalizeText(left) === normalizeText(right);

const stripTrailingUnits = (text = '') =>
  normalizeText(text).replace(/\s*\((?:км|м)\)\s*$/i, '').trim();

export const isFilterCategoryMatch = (left = '', right = '') => {
  const normalizedLeft = stripTrailingUnits(left);
  const normalizedRight = stripTrailingUnits(right);

  if (!normalizedLeft || !normalizedRight) return false;

  return normalizedLeft === normalizedRight;
};

export const isTextMatch = (left = '', right = '') => {
  const normalizedLeft = normalizeText(left);
  const normalizedRight = normalizeText(right);

  if (!normalizedLeft || !normalizedRight) return false;
  if (normalizedLeft === normalizedRight) return true;

  return (
    normalizedLeft.includes(normalizedRight) ||
    normalizedRight.includes(normalizedLeft)
  );
};
