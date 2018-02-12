import Quill from 'quill';
let BlockEmbed = Quill.import('blots/block/embed');

class Attachment extends BlockEmbed {
    static create(value: any) {
        let node = super.create();
        node.setAttribute('href', value.href);
        node.setAttribute('class', 'attachment');
        node.setAttribute('target', '_blank');
        node.setAttribute('data-toggle', 'popover');
        node.setAttribute('tabindex', '0');
        node.setAttribute('attachment-name', value.attachmentName);
        node.innerHTML = `<span class="oi oi-paperclip"></span> ${value.attachmentName}`;

        return node;
    }
  
    static value(node: any) {
        return {
            class: node.getAttribute('class'),
            href: node.getAttribute('href'),
            target: node.getAttribute('target'),
            dataToggle: node.getAttribute('data-toggle'),
            tabindex: node.getAttribute('tabindex'),
            attachmentName: node.getAttribute('attachment-name')
        };
    }
}

export default Attachment;