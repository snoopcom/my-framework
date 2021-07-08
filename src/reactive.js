const state = reactive({
  inputValue: '',
});

function render(text) {
  return newVirtualNode('div', { class: 'container' }, [
    newVirtualNode(
      'h1',
      { title: 'this is a title' },
      'Basics of JS Framework'
    ),
    newVirtualNode('div', { class: 'description' }, [
      newVirtualNode(
        'p',
        {},
        'Напишите название картинки в инпут ../img/img.png'
      ),
      newVirtualNode('img', { src: text, style: 'width: 300px;' }, []),
      newVirtualNode('p', {}, text),
      newVirtualNode(
        'input',
        {
          oninput: 'state.inputValue = this.value',
        },
        []
      ),
    ]),
  ]);
}

let currentNode;
watchEffect(() => {
  if (!currentNode) {
    currentNode = render(state.inputValue);
    mount(currentNode, document.getElementById('app'));
  } else {
    const newNode = render(state.inputValue);
    patch(currentNode, newNode);
    currentNode = newNode;
  }
});
