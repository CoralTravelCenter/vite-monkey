export function removeDuplicateIds(node) {
  if (node.nodeType !== Node.ELEMENT_NODE) {
    return;
  }

  node.removeAttribute('id');
  node.querySelectorAll('[id]').forEach(element => {
    element.removeAttribute('id');
  });
}

export function findNearestDivInsideAntCol(element) {
  if (!element) {
    return null;
  }

  let current = element;

  while (current && current.parentElement) {
    const parent = current.parentElement;

    if (
      current.tagName.toLowerCase() === 'div' &&
      parent.tagName.toLowerCase() === 'div' &&
      parent.classList.contains('ant-col')
    ) {
      return current;
    }

    current = parent;
  }

  return null;
}
