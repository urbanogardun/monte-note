import * as $ from 'jquery';
import Quill from 'quill';
import Attachment from '../formats/attachment';
import { ElectronMessager } from '../../electron-messaging/electronMessager';
import { DELETE_ATTACHMENT, OPEN_ATTACHMENT } from '../../../constants/index';
let Parchment = Quill.import('parchment');
import './renameAttachment.css';

Attachment.blotName = 'attachment';
Attachment.tagName = 'a';

Quill.register(Attachment);

// Rename attachment element
function renameAttachment(quill: Quill) {

    quill.on('text-change', function () {

        var self = $('.attachment') as any;
        self.popover({
            placement: 'bottom',
            content: `
                <div id="attachment-popover" class="attachment-popover">
                    <div class="attachment-text">
                        Open: 
                        <a href="" class="attachment-link" target="_blank">Name of Attachment</a> 
                        <a href="" class="edit-attachment">Edit</a> <span class="separator">|</span> 
                        <a href="#" class="delete-attachment">Delete</a></p>
                    </div>
                    <div class="attachment-input input-group input-group-sm mb-3">
                        <div class="input-group-prepend">
                            <span class="attachment-new-name" id="inputGroup-sizing-sm">Name: </span>
                        </div>
                        <input 
                            type="text" 
                            class="form-control rename-attachment" 
                            aria-label="Name" 
                            aria-describedby="inputGroup-sizing-sm"
                        >
                        <a href="" class="save-attachment-name">Save</a>
                    </div>
                </div>`,
            html: true
        });

        $('.attachment').on('click', function(event: JQuery.Event) {
            let blot = Parchment.find(event.target as Node);
            let cursorPosition = blot.offset(quill.scroll);

            let attachmentLink = $(this).attr('href');
            $('.attachment-link').attr('href', attachmentLink as string);

            // Attachment gets opened otherwise
            event.preventDefault();
            
            var attachment = $(this) as any;
            $('.attachment-link').text(attachment.text().trim());
        
            $('.attachment-input').hide();
            
            $('.attachment-link').off('click').on('click', function(evt: JQuery.Event) {
                evt.preventDefault();
                ElectronMessager.sendMessageWithIpcRenderer(OPEN_ATTACHMENT, attachment.attr('href'));
            });

            $('.attachment-popover').find('.edit-attachment').off('click').on('click', function(e: JQuery.Event) {
                e.preventDefault();
                
                $('.attachment-text').hide();
                $('.attachment-input').show();
                $('input.rename-attachment').val(attachment.text());
                $('input.rename-attachment').select();
                $('input.rename-attachment').focus();
                $('.save-attachment-name').on('click', function(e1: JQuery.Event) {
                    e1.preventDefault();
                    let attachmentName = $('input.rename-attachment').val() as string;
                    
                    quill.insertEmbed(
                        cursorPosition,
                        'attachment', 
                        { href: attachmentLink, attachmentName: attachmentName }, 'user');

                    attachment.popover('hide');
                    attachment.remove();

                });
                
            });

            $('.attachment-popover').find('.delete-attachment').off('click').on('click', function(e2: JQuery.Event) {
                e2.preventDefault();

                attachment.popover('hide');
                ElectronMessager.sendMessageWithIpcRenderer(DELETE_ATTACHMENT, attachment.attr('href'));
                attachment.remove();

            });

            // Popover will stay open until attachment gets its name changed,
            // gets deleted, or user clicks somewhere outside the popover.
            let previousPopover: any;
            $('body').click(function(e: JQuery.Event) {
                
                if (!clickedOnAttachmentLink(e)) {

                    if (clickedOutsidePopover(e)) {
                        let popover = $('[data-toggle="popover"]') as any;
                        popover.popover('hide');
                    }

                } else {
                    // Close previously opened popover element when clicking
                    // directly from one popover to another
                    if (previousPopover) {
                        if (previousPopover.attr('href') !== $(e.target).attr('href')) {
                            previousPopover.popover('hide');
                            previousPopover = $(e.target) as any;
                        }
                    } else {
                        previousPopover = $(e.target) as any;
                    }
                }

            });

        });

    });
}

function clickedOutsidePopover(e: JQuery.Event) {
    if ( ($(e.target).parents('#attachment-popover').length) || ($(e.target).attr('id') === 'attachment-popover') ) {
        return false;
    }
    return true;
}

function clickedOnAttachmentLink(e: JQuery.Event) {
    if ($(e.target).hasClass('attachment')) {
        return true;
    }
    return false;
}

export default renameAttachment;
