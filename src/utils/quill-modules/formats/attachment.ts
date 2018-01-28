import Quill from 'quill';
let Inline = Quill.import('blots/inline');

class Attachment extends Inline {
    static create(value: any) {
      let node = super.create();
      node.setAttribute('src', value);
      node.setAttribute('class', 'attachment');
      node.setAttribute('target', '_blank');
      return node;
    }
  
    static value(node: any) {
      return {
        class: node.getAttribute('class'),
        src: node.getAttribute('src'),
      };
    }
}

export default Attachment;