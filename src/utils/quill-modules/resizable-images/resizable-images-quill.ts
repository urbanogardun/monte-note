import * as $ from 'jquery';
const resizeFrame = require('./resize-frame.png');
import Quill, { DeltaStatic } from 'quill';
let Parchment = Quill.import('parchment');
let BlockEmbed = Quill.import('blots/block/embed');

class ResizableImage extends BlockEmbed {
    static create(value: any) {
      let node = super.create();
      node.setAttribute('src', value.url);
      node.setAttribute('class', value.class);
      node.setAttribute('height', `${value.height}`);
      return node;
    }
  
    static value(node: any) {
      return {
        class: node.getAttribute('class'),
        url: node.getAttribute('src'),
        height: node.getAttribute('height')
      };
    }
}

ResizableImage.blotName = 'resizableImage';
ResizableImage.tagName = 'img';

Quill.register(ResizableImage);

function initializeResponsiveImages(quill: Quill) {

    quill.on('text-change', function (delta: DeltaStatic, oldContents: DeltaStatic) {

        var isDragging = false,
            wasDragged = false,
            currentElementHeight: string,
            imageIndexPosition: number,
            $img: JQuery;

        // Any time content changes in Quill, first remove all the event listeners
        // from the image elements and then readd them. This way we won't be
        // adding multiple listeners on same elements.
        $('.ql-editor').find('img').off('mouseenter mouseleave').hover(function(e: JQuery.Event) {

            // Save location of image element inside editor. Later when we're
            // about to resize an image, a resized image will get placed exactly
            // where the original image was.
            let blot = Parchment.find(e.target as Node);
            imageIndexPosition = blot.offset(quill.scroll);

            $(this).css(
                {
                    'border-right': '15px solid #000000',
                    'border-bottom': '15px solid #000000',
                    'border-image': 'url("' + resizeFrame + '") 34% repeat',
                    'cursor': 'nw-resize'
                });
        },                                                             function() {
            $(this).css(
                {
                    'border': 'none',
                    'cursor': 'inherit'
                });
        });

        // Ensure each image element has only 1 event handler.
        $('.ql-editor').find('img').off('mouseover mousedown').on('mouseover mousedown', function() {
            // Grab coordinates for image we just hovered into
            $img = $(this);
    
            let subtractFromPageX: number;
            $img.off('mousedown').on('mousedown', function(event: JQuery.Event) {
                isDragging = true;
                event.preventDefault();

                currentElementHeight = $($img).css('height');
                let imageSize = $($img).css('height').split('px')[0] as any;
                if (event.pageX > imageSize) {
                    subtractFromPageX = event.pageX - imageSize;
                } else {
                    subtractFromPageX = 0;
                }
            });
    
            $('.ql-editor').off('mousemove').on('mousemove', function(event: JQuery.Event) {
                if (isDragging) {
                    wasDragged = true;
                    $img.css({ height: (event.pageX - subtractFromPageX), width: 'auto' });
                }
            }).off('mouseup').bind('mouseup', function() {
                isDragging = false;

                // Get link to image data
                let link = $($img).attr('src');

                // Get new height of an image we resized
                let elementHeight = $($img).css('height');

                // Check if image was dragged (resized)
                if (wasDragged) {
                    wasDragged = false;
                    // Only resize image if height of the image got changed
                    if (elementHeight !== currentElementHeight) {
                        
                        // Remove original image
                        $($img).remove();
                        // Insert image we just resized from original
                        // let range = quill.getSelection(true);
                        
                        quill.insertEmbed(imageIndexPosition, 'resizableImage', {
                            url: link,
                            height: elementHeight
                            },              'user');
                    }
                }

            });
    
        });
    
    });
}

export default initializeResponsiveImages;
