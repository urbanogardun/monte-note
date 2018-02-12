import * as $ from 'jquery';
import Quill from 'quill';
import { ElectronMessager } from '../../electron-messaging/electronMessager';
import { OPEN_HTTP_LINK } from '../../../constants/index';

// Rename attachment element
function openHyperlinksInBrowser(quill: Quill) {

    quill.on('text-change', function () {
        $(`.ql-editor`).find(`a:not('.attachment')`).on('click', function(event: JQuery.Event) {
            event.preventDefault();
            let link = $(this).attr('href');
            console.log(link);
            if (link) {
                ElectronMessager.sendMessageWithIpcRenderer(OPEN_HTTP_LINK, link);
            }
        });
    });
}

export default openHyperlinksInBrowser;
