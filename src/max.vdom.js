const vdomEmalpe = {
  tag: 'div',
  props: {
    class: 'container',
  },
  children: [
    {
      tag: 'h1',
      props: {
        title: 'this is a title',
      },
      children: 'Basics of JS Framework',
    },
    {
      tag: 'p',
      props: {
        title: 'description',
      },
      children: 'Here we learn, what is behind of every modern JS Framework',
    },
  ],
};

// создает virtual node (but dont mount it!)
function newVirtualNode(tag, props, children) {
  return {
    tag,
    props,
    children,
  };
}

// превращает объект в реальный DOM
function mount(vnode, container) {
  const el = document.createElement(vnode.tag);

  for (const key in vnode.props) {
    el.setAttribute(key, vnode.props[key]);
  }

  if (typeof vnode.children === 'string') {
    el.textContent = vnode.children;
  } else {
    vnode.children.forEach((child) => {
      mount(child, el);
    });
  }

  container.appendChild(el);

  vnode.$el = el;
}

//unmount a vNode from the DOM
function unmount(vnode) {
  vnode.$el.parentNode.removeChild(vnode.$el);
}

// takes 2 nodes, compare them and
function patch(oldNode, newNode) {
  // different tags
  if (oldNode.tag !== newNode.tag) {
    mount(newNode, oldNode.$el.parentNode);
    unmount(oldNode);
  } else {
    newNode.$el = oldNode.$el;

    if (typeof newNode.children === 'string') {
      newNode.$el.textContent = newNode.children;
    } else {
      while (newNode.$el.attributes.length > 0) {
        newNode.$el.removeAttribute(newNode.$el.attributes[0].name);
      }

      for (const key in newNode.props) {
        newNode.$el.setAttribute(key, newNode.props[key]);
      }

      if (typeof oldNode.children === 'string') {
        newNode.$el.textContent = null;
        newNode.children.forEach((child) => {
          mount(child, newNode.$el);
        });
      } else {
        const commonLength = Math.min(
          oldNode.children.length,
          newNode.children.length
        );

        for (let i = 0; i < commonLength; i++) {
          patch(oldNode.children[i], newNode.children[i]);
        }

        if (oldNode.children.length > newNode.children.length) {
          oldNode.children
            .slice(newNode.children.length)
            .forEach((child) => unmount(child));
        } else if (newNode.children.length > oldNode.children.length) {
          newNode.children
            .slice(oldNode.children.length)
            .forEach((child) => mount(child));
        }
      }
    }
  }
}
