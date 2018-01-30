import * as $ from 'jquery';
import Quill from 'quill';
import Attachment from '../formats/attachment';
import { ElectronMessager } from '../../electron-messaging/electronMessager';
import { DELETE_ATTACHMENT } from '../../../constants/index';
let Parchment = Quill.import('parchment');

Attachment.blotName = 'attachment';
Attachment.tagName = 'a';

Quill.register(Attachment);

// Rename attachment element
function renameAttachment(quill: Quill) {

    quill.on('text-change', function () {

        var self = $('.attachment') as any;
        self.popover({
            placement: 'bottom',
            title: 'Twitter Bootstrap Popover', 
            content: `
                <div id="attachment-popover">
                    <div class="attachment-text">
                        <p>
                        Open Attachment: <a href="" id="attachment-link" target="_blank">Name of Attachment</a> 
                    </div>
                    <div class="attachment-input input-group input-group-sm mb-3">
                        <div class="input-group-prepend">
                            <span class="input-group-text" id="inputGroup-sizing-sm">Small</span>
                        </div>
                        <input 
                            type="text" 
                            class="form-control rename-attachment" 
                            aria-label="Small" 
                            aria-describedby="inputGroup-sizing-sm"
                        >
                        <a href="#" class="save-attachment-name">Save</a>
                    </div>
                    <a href="#" id="edit-attachment">Edit</a> | <a href="#" id="delete-attachment">Delete</a></p>
                </div>`,
            html: true
        });

        $('.attachment').on('click', function(event: JQuery.Event) {
            let blot = Parchment.find(event.target as Node);
            let cursorPosition = blot.offset(quill.scroll);

            let attachmentLink = $(this).attr('href');
            $('#attachment-link').attr('href', attachmentLink as string);

            // Attachment gets opened otherwise
            event.preventDefault();

            $('.attachment-input').hide();
            
            var attachment = $(this) as any;
            $('#attachment-popover').find('#edit-attachment').off('click').on('click', function() {
                $('.attachment-text').hide();
                $('.attachment-input').show();
                $('input.rename-attachment').select();
                $('input.rename-attachment').focus();
                $('.save-attachment-name').on('click', function() {
                    let attachmentName = $('input.rename-attachment').val() as string;
                    
                    quill.insertEmbed(
                        cursorPosition,
                        'attachment', 
                        { href: attachmentLink, attachmentName: attachmentName }, 'user');

                    attachment.popover('hide');
                    attachment.remove();

                });
                
            });

            $('#attachment-popover').find('#delete-attachment').off('click').on('click', function() {

                console.log(`Delete attachment: ${attachmentLink}`);
                    
                attachment.popover('hide');
                ElectronMessager.sendMessageWithIpcRenderer(DELETE_ATTACHMENT, attachmentLink);
                // attachment.remove();

            });

        });

    });
}

export default renameAttachment;
