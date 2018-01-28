import Quill from 'quill';
import * as $ from 'jquery';
let BlockEmbed = Quill.import('blots/block/embed');

class Attachment extends BlockEmbed {
    static create(value: any) {
        let node = super.create();
        node.setAttribute('href', value.href);
        node.setAttribute('class', 'attachment');
        node.setAttribute('target', '_blank');
        node.setAttribute('data-toggle', 'popover');
        node.setAttribute('tabindex', '0');
        node.innerHTML = value.href;

        let popoverEl = $(node) as any;
        popoverEl.popover({
            trigger: 'focus',
            placement: 'bottom',
            title: 'Twitter Bootstrap Popover', 
            content: `
                <div>
                    <p>Open Attachment: <a href="${value.href}" target="_blank">Name of Attachment</a> 
                    <a href="#" id="edit-attachment">Edit</a> | Delete</p>
                </div>`,
            html: true
        });
        
        $(node).on('click', (event: JQuery.Event) => {
            // Attachment gets opened otherwise
            event.preventDefault();
        });

        $('#edit-attachment').on('click', function() {
            console.log('rename attachment');
        });

        return node;
    }
  
    static value(node: any) {
        return {
            class: node.getAttribute('class'),
            href: node.getAttribute('href'),
            target: node.getAttribute('target'),
            dataToggle: node.getAttribute('data-toggle'),
            tabindex: node.getAttribute('tabindex'),
        };
    }
}

export default Attachment;