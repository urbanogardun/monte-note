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
        if (value.attachmentName) {
            node.setAttribute('attachment-name', value.attachmentName);
            node.innerHTML = value.attachmentName;
        } else {
            // Gets filename from absolute path
            node.setAttribute('attachment-name', value.href);
            node.innerHTML = value.href;
        }
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