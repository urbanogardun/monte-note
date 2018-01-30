import Notebook from '../../components/NotebookPage/index';
import * as actions from '../../actions/';
import { StoreState } from '../../types/index';
import { connect, Dispatch } from 'react-redux';

export function mergeProps(stateProps: Object, dispatchProps: Object, ownProps: Object) {
    return Object.assign({}, ownProps, stateProps, dispatchProps);
}

export function mapStateToProps(
    { 
        notes, 
        lastOpenedNote, 
        noteContent, 
        currentNoteTags, 
        pathToNewestUploadedImage, 
        pathToNewestUploadedAsset }: StoreState) {
    console.log(`pathToNewestUploadedAsset: ${JSON.stringify(pathToNewestUploadedAsset)}`);
    return {
        notes,
        lastOpenedNote,
        noteContent,
        currentNoteTags,
        pathToNewestUploadedImage,
        pathToNewestUploadedAsset
    };
}

export function mapDispatchToProps(dispatch: Dispatch<actions.EnthusiasmAction>) {
    return {
        onIncrement: () => dispatch(actions.decrementEnthusiasm()),
        onDecrement: () => dispatch(actions.decrementEnthusiasm()),
        updateNotes: (notes: string[]) => dispatch(actions.loadNotes(notes)),
        updateLastOpenedNote: (note: string) => dispatch(actions.loadLastOpenedNote(note)),
        updateNoteContent: (content: string) => dispatch(actions.loadContentIntoNote(content)),
        addTagToNote: (tags: string[]) => dispatch(actions.loadTagsForNote(tags))
    };
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(Notebook);