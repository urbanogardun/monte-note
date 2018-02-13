import * as React from 'react';
import TagAdder from '../TagAdder/index';
import ElectronMessager from '../../../utils/electron-messaging/electronMessager';
import { 
    UPDATE_NOTE, 
    GET_NAME_OF_LAST_OPENED_NOTE, 
    GET_NOTE_CONTENT, 
    DELETE_NOTE, 
    UPLOAD_IMAGE,
    UPLOAD_ATTACHMENT } from '../../../constants/index';
import './index.css';
import Quill, { DeltaStatic } from 'quill';
import '../../../assets/css/quill.snow.css';
import initializeResponsiveImages from '../../../utils/quill-modules/resizable-images/resizable-images-quill';
import renameAttachment from '../../../utils/quill-modules/rename-attachment/renameAttachment';
import openHyperlinksInBrowser from '../../../utils/quill-modules/open-hyperlinks-in-browser/openHyperlinksInBrowser';

Quill.register('modules/resizableImages', (quill: Quill) => {
    initializeResponsiveImages(quill);
});

Quill.register('modules/renameAttachment', (quill: Quill) => {
    renameAttachment(quill);
});

Quill.register('modules/openHyperlinks', (quill: Quill, options: any) => {
    openHyperlinksInBrowser(quill, options);
});

// Add fonts to whitelist
var Font = Quill.import('formats/font');
// We do not add Aref Ruqaa since it is the default
Font.whitelist = [
    'slabo13px', 
    'roboto', 
    'opensans', 
    'indieflower', 
    'lato', 
    'lora', 
    'merriweather', 
    'playfairdisplay',
    'raleway',
    'robotoslab',
    'ubuntu'
];
Quill.register(Font, true);

var fontSizeStyle = Quill.import('attributors/style/size');
fontSizeStyle.whitelist = [
    '12px', 
    '14px', 
    '16px', 
    '18px',
    '20px',
    '22px',
    '24px',
    '26px',
    '28px',
    '30px',
    '32px',
    '34px',
    '36px',
    '48px',
    '72px'
];
Quill.register(fontSizeStyle, true);

const striptags = require('../../../utils/striptags');

export interface Props {
    notebookName: string;
    lastOpenedNote: string;
    noteContent: string;
    addTagToNote: Function;
    currentNoteTags: string[];
    notes: string[];
    updateNotes: Function;
    updateLastOpenedNote: Function;
    updateNoteContent: Function;
    pathToNewestUploadedImage: string;
    pathToNewestUploadedAsset: any;
    updatePreviewContent: Function;
}

export interface State {
    notebookName: string;
    lastOpenedNote: string | null;
}

// class ResizableImage extends BlockEmbed {
//     static create(value: any) {
//       let node = super.create();
//       node.setAttribute('alt', value.alt);
//       node.setAttribute('src', value.url);
//       node.setAttribute('height', `${value.height}`);
//       return node;
//     }
  
//     static value(node: any) {
//       return {
//         alt: node.getAttribute('alt'),
//         url: node.getAttribute('src'),
//         height: node.getAttribute('height')
//       };
//     }
// }

// ResizableImage.blotName = 'resizableImage';
// ResizableImage.tagName = 'img';

// Quill.register(ResizableImage);

export class Editor extends React.Component<Props, State> {

    quill: Quill;
    timeout: any;
    currentCursorPosition: number;

    constructor(props: Props) {
        super(props);
        this.state = {
            notebookName: this.props.notebookName,
            lastOpenedNote: null,
        };
        ElectronMessager.sendMessageWithIpcRenderer(GET_NAME_OF_LAST_OPENED_NOTE, this.props.notebookName);
    }

    componentDidMount() {
        // After this component gets initialized for the first time it will
        // receive props whose value will stay the same the next time the
        // component gets mounted - this means if we go to a notebook, the first
        // time content of the last opened note will get loaded, but on the 2nd
        // run it won't. Code below explicitly requests note data for this case.
        let lastOpenedNote = this.props.lastOpenedNote as string;
        if (lastOpenedNote.length) {
            let data = {
                notebook: this.state.notebookName,
                note: lastOpenedNote
            };
            ElectronMessager.sendMessageWithIpcRenderer(GET_NOTE_CONTENT, data);
        }

        this.quill = new Quill('#quill-container', {
            modules: {
                toolbar: {
                    container: '#toolbar',
                    handlers: {
                        'omega': function(value: any) {
                            console.log(value);
                        }
                    }
                },
                // toolbar: [
                // ['bold', 'italic', 'underline'],
                // ['image', 'code-block'],
                // ['trash'],
                // ],
                resizableImages: {},
                renameAttachment: {},
                openHyperlinks: {
                    editorEnabled: true
                }
            },
            placeholder: 'Take notes...',
            theme: 'snow',  // or 'bubble'
            scrollingContainer: 'body'
        });

        let toolbar = this.quill.getModule('toolbar');
        toolbar.addHandler('omega');

        // Adds text on hover & custom icon to button
        // let customButton = document.querySelector('.ql-trash') as Element;
        // customButton.setAttribute('title', 'Restore note');
        // customButton.innerHTML = '<span className="oi oi-trash quill-custom-button"></span>';
        // customButton.addEventListener('click', this.deleteNote.bind(this));

        let quill = this.quill;
        this.quill.on('text-change', (delta: DeltaStatic, oldContents: DeltaStatic, source: any) => {
            
            let noteName = this.props.lastOpenedNote;
            let notebookName = this.state.notebookName;
            let editor = document.querySelector('.ql-editor') as Element;
            let noteData = editor.innerHTML;
            
            
            if (source === 'user') {
                clearTimeout(this.timeout);
                this.timeout = setTimeout(updateNote, 60000);
            }

            function updateNote() {
                let data = {
                    noteName: noteName,
                    notebookName: notebookName,
                    noteData: noteData
                };
                ElectronMessager.sendMessageWithIpcRenderer(UPDATE_NOTE, data);
            }

            // For a popover element to display whenever an attachment link is
            // clicked and for it to disappear on next click outside of a popover
            // element, quill editor needs to be temporarily disabled in order
            // for popover to properly work. Popover settings are configured
            // in Attachment format file.
            $('.attachment').hover(function() {
                quill.disable();
            },                     function() {
                quill.enable();
            });

        });

    }

    deleteNote() {
        let editor = document.querySelector('.ql-editor') as Element;
        let noteData = editor.innerHTML;

        let data = {
            noteName: this.props.lastOpenedNote,
            notebookName: this.props.notebookName,
            noteData: noteData,
            noteDataTextOnly: striptags(noteData, [], '\n'),
            updateNoteData: true
        };

        // Removes note from app state & sets last opened note to be the last
        // note from the notes array
        let newNotes = removeNote(this.props.notes as string[], data.noteName);
        let updateNotes = this.props.updateNotes as Function;
        updateNotes(newNotes);

        // Updates app state with lastOpenedNote value - it picks last item
        // from an array, which is the newest created note.
        let updateLastOpenedNote = this.props.updateLastOpenedNote as Function;
        updateLastOpenedNote(newNotes.pop());

        // Updates note content in app state
        let updateNoteContent = this.props.updateNoteContent as Function;
        updateNoteContent(this.props.noteContent);

        // If there are no notes in notebook, clears editor from previous
        // note content
        if (newNotes.length === 0) {
            this.quill.deleteText(0, this.quill.getLength());
        }

        ElectronMessager.sendMessageWithIpcRenderer(DELETE_NOTE, data);

        // Remove note content from preview on home page that just got moved
        // to trashcan. 
        this.props.updatePreviewContent(
            {
                notebook: '',
                note: '',
                noteContent: '',
                tags: []
            }
        );
    }

    componentWillReceiveProps(nextProps: Props) {
        if ( (nextProps.notes.length) && (nextProps.lastOpenedNote !== '') ) {
            this.quill.enable();
            this.quill.focus();
            $('.notebook-page-editor').css({'visibility': 'visible'});
        } else {
            this.quill.disable();
            $('.notebook-page-editor').css({'visibility': 'hidden'});
        }

        if ( (this.state.lastOpenedNote === null) || (this.state.lastOpenedNote !== nextProps.lastOpenedNote) ) {
            this.setState({lastOpenedNote: nextProps.lastOpenedNote as string});

            let data = {
                notebook: this.state.notebookName,
                note: nextProps.lastOpenedNote
            };
            ElectronMessager.sendMessageWithIpcRenderer(GET_NOTE_CONTENT, data);
        }

    }

    componentWillUpdate(nextProps: Props) {
        // TODO: When an attachment has uploaded successfully, add it to note
        // Also set attachment element class to 'attachment' - this class
        // will be used for relinking content
        // When an image has uploaded successfully, add it to note
        if (this.props.pathToNewestUploadedImage !== nextProps.pathToNewestUploadedImage) {
            this.quill.insertEmbed(
                this.currentCursorPosition, 
                'resizableImage', { url: `${nextProps.pathToNewestUploadedImage}`, class: 'image-upload' }, 'user');
        } else if (this.props.pathToNewestUploadedAsset !== nextProps.pathToNewestUploadedAsset) {
            this.quill.insertEmbed(
                this.currentCursorPosition, 
                'attachment', { 
                    href: nextProps.pathToNewestUploadedAsset.path,
                    attachmentName:  nextProps.pathToNewestUploadedAsset.filename
                }, 
                'user');
        } else {
            // Load saved content from note file into Quill editor
            this.quill.deleteText(0, this.quill.getLength());
            this.quill.clipboard.dangerouslyPasteHTML(0, nextProps.noteContent as string, 'api');
            // Sets cursor to the end of note content
            this.quill.setSelection(this.quill.getLength(), this.quill.getLength());
        }

    }

    componentWillUnmount() {
        clearTimeout(this.timeout);
        
        // let customButton = document.querySelector('.ql-trash') as Element;
        // customButton.removeEventListener('click', this.deleteNote);
    }

    // Sends image data to ipcMain process
    handleImageUpload() {
        let input = document.querySelector('#ql-image-attachment') as any;
        var file    = input.files[0];
        var filename = file.name;
        var reader  = new FileReader();
        let props = this.props;

        reader.onloadend = function(e: any) {
            let imageData = {
                filename: filename,
                data: new Uint8Array(e.target.result),
                note: props.lastOpenedNote,
                notebook: props.notebookName
            };

            ElectronMessager.sendMessageWithIpcRenderer(UPLOAD_IMAGE, imageData);
        };

        if (file) {
            reader.readAsArrayBuffer(file);
        }

    }

    handleAttachmentUpload() {
        let input = document.querySelector('#ql-attachment') as any;
        var file    = input.files[0];
        var filename = file.name;
        var reader  = new FileReader();
        let props = this.props;
        
        reader.onloadend = function(e: any) {
            var attachmentData = {
                filename: filename,
                data: new Uint8Array(e.target.result),
                note: props.lastOpenedNote,
                notebook: props.notebookName
            };

            ElectronMessager.sendMessageWithIpcRenderer(UPLOAD_ATTACHMENT, attachmentData);
        };

        if (file) {
            reader.readAsArrayBuffer(file);
        }
    }

    render() {
        return (
            <div className="col-sm trashcan main-content notebook-note-editor notebook-page-editor">
                <TagAdder
                    notebookName={this.state.notebookName}
                    lastOpenedNote={this.props.lastOpenedNote}
                    addTagToNote={this.props.addTagToNote}
                    currentNoteTags={this.props.currentNoteTags}
                    updateNoteContent={this.props.updateNoteContent}
                    noteContent={this.props.noteContent}
                />
                <div id="toolbar">
                    <select className="ql-font">
                        <option value="raleway">Raleway</option>
                        <option value="indieflower">Indie Flower</option>
                        <option value="lato">Lato</option>
                        <option value="lora">Lora</option>
                        <option value="merriweather">Merriweather</option>
                        <option value="opensans">Open Sans</option>
                        <option value="playfairdisplay">Playfair Display</option>
                        <option value="roboto">Roboto</option>
                        <option value="robotoslab">Roboto Slab</option>
                        <option value="slabo13px">Slabo 13px</option>
                        <option value="ubuntu">Ubuntu</option>
                    </select>
                    <select className="ql-size">
                        <option value="12px">12</option>
                        <option value="14px">14</option>
                        <option value="16px">16</option>
                        <option value="18px">18</option>
                        <option value="20px">20</option>
                        <option value="22px">22</option>
                        <option value="24px">24</option>
                        <option value="26px">26</option>
                        <option value="28px">28</option>
                        <option value="30px">30</option>
                        <option value="32px">32</option>
                        <option value="34px">34</option>
                        <option value="36px">36</option>
                        <option value="48px">48</option>
                        <option value="72px">72</option>
                    </select>
                    <span className="ql-formats">
                        <button className="ql-bold"/>
                        <button className="ql-italic"/>
                        <button className="ql-underline"/>
                        <button className="ql-strike"/>
                    </span>
                    <span className="ql-formats">
                        <select className="ql-color"/>
                        <select className="ql-background"/>
                    </span>
                    <span className="ql-formats">
                        <button className="ql-script" value="sub"/>
                        <button className="ql-script" value="super"/>
                    </span>
                    <span className="ql-formats">
                        <button className="ql-header" value="1"/>
                        <button className="ql-header" value="2"/>
                        <button className="ql-blockquote"/>
                        <button className="ql-code-block"/>
                    </span>
                    <span className="ql-formats">
                        <button className="ql-list" value="ordered"/>
                        <button className="ql-list" value="bullet"/>
                        <button className="ql-indent" value="-1"/>
                        <button className="ql-indent" value="+1"/>
                    </span>
                    <span className="ql-formats">
                        <button className="ql-direction" value="rtl"/>
                        <select className="ql-align"/>
                    </span>
                    <span className="ql-formats">
                        <button className="ql-link"/>
                        <label className="image-attachment">
                            <span className="oi oi-image image-attachment-icon"/>
                            <input 
                                className="ql-omega" 
                                value="" 
                                id="ql-image-attachment"
                                type="file"
                                accept="image/*" 
                                onChange={
                                    () => {
                                        if (this.quill.getSelection()) {
                                            this.currentCursorPosition = this.quill.getSelection().index;
                                        }
                                        this.handleImageUpload();
                                    }
                                }
                            />
                        </label>
                        <label className="file-attachment">
                        <span className="oi oi-paperclip file-attachment-icon"/>
                        <input
                            className="ql-attachment"
                            value=""
                            id="ql-attachment"
                            type="file"
                            onChange={
                                () => {
                                    if (this.quill.getSelection()) {
                                        this.currentCursorPosition = this.quill.getSelection().index;
                                    }
                                    this.handleAttachmentUpload();
                                }
                            }
                        />
                        </label>
                        <button className="ql-formula"/>
                    </span>
                    <span className="ql-formats">
                        <button className="ql-clean"/>
                    </span>
                    <span className="ql-formats">
                        <button 
                            className="oi oi-trash quill-custom-button trash-note-icon"
                            onClick={() => this.deleteNote()}
                        />
                    </span>
                </div>
                <div id="quill-container" />
            </div>
        );
    }
}

export default Editor;

// Helpers
function removeNote(notesList: string[], noteName: string): string[] {
    return notesList.filter((note: string) => { return note !== noteName ? true : false; } );
}
