import * as $ from 'jquery';
import Quill from 'quill';
import { ElectronMessager } from '../../electron-messaging/electronMessager';
import { OPEN_HTTP_LINK } from '../../../constants/index';

// Open http link in a browser
function openHyperlinksInBrowser(quill: Quill, options?: any) {

    quill.on('text-change', function () {
        if ( (options) && ('editorEnabled' in options) ) {
            $(`a.ql-preview`)
            .off('click').on('click', function(event: JQuery.Event) {
                console.log('cc');
                event.preventDefault();
                let link = $(this).attr('href') as string;
                sendLink(link);
            });
        } else {
            $(`.ql-editor`).find(`a:not('.attachment')`)
            .off('click').on('click', function(event: JQuery.Event) {
                event.preventDefault();
                let link = $(this).attr('href') as string;
                sendLink(link);
            });
        }
    });
}

export default openHyperlinksInBrowser;

function sendLink(link: string) {
    if (link) {
        ElectronMessager.sendMessageWithIpcRenderer(OPEN_HTTP_LINK, link);
    }
}