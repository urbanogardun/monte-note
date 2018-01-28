import Quill from 'quill';
let BlockEmbed = Quill.import('blots/block/embed');

class Attachment extends BlockEmbed {
    static create(value: any) {
        let node = super.create();
        console.log('VALUE IS: ' + JSON.stringify(value));
        node.setAttribute('href', value.href);
        node.setAttribute('class', 'attachment');
        node.setAttribute('target', '_blank');
        node.innerHTML = value.href;
        return node;
    }
  
    static value(node: any) {
        return {
            class: node.getAttribute('class'),
            href: node.getAttribute('href'),
            target: node.getAttribute('target'),
        };
    }
}

export default Attachment;