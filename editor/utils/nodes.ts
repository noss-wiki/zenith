import type { InputNodeElement, InputNode } from '../blocks/data';

export function createTextNode(data: InputNode): InputNodeElement {
  if (data.style.length === 0)
    return {
      ...data,
      node: document.createTextNode(data.content),
    };

  const res = document.createElement('span');
  res.textContent = data.content;
  res.className = 'noss-text-node';
  for (const i of data.style) res.classList.add(i);

  return {
    ...data,
    node: res,
  };
}
