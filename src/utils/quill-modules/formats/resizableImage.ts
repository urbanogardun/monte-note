import Quill from 'quill';
let BlockEmbed = Quill.import('blots/block/embed');

class ResizableImage extends BlockEmbed {
    static create(value: any) {
      let node = super.create();
      let paragraph = document.createElement('p');
      node.setAttribute('src', value.url);
      node.setAttribute('class', value.class);
      node.setAttribute('height', `${value.height}`);
      paragraph.appendChild(node);
      return paragraph;
    }
  
    static value(node: any) {
      return {
        class: node.getAttribute('class'),
        url: node.getAttribute('src'),
        height: node.getAttribute('height')
      };
    }
}

export default ResizableImage;