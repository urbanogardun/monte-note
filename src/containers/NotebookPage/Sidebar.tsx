import Sidebar from '../../components/NotebookPage/Sidebar/index';
import * as actions from '../../actions/';
import { StoreState } from '../../types/index';
import { connect, Dispatch } from 'react-redux';

export function mergeProps(stateProps: Object, dispatchProps: Object, ownProps: Object) {
    return Object.assign({}, ownProps, stateProps, dispatchProps);
}

export function mapStateToProps({ notes, lastOpenedNote, noteContent }: StoreState) {
    return {
        notes,
        lastOpenedNote,
        noteContent
    };
}

export function mapDispatchToProps(dispatch: Dispatch<actions.EnthusiasmAction>) {
    return {
        onIncrement: () => dispatch(actions.decrementEnthusiasm()),
        onDecrement: () => dispatch(actions.decrementEnthusiasm()),
        updateNotes: (notes: string[]) => dispatch(actions.loadNotes(notes)),
        updateLastOpenedNote: (note: string) => dispatch(actions.loadLastOpenedNote(note)),
        updateNoteContent: (content: string) => dispatch(actions.loadContentIntoNote(content))
    };
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(Sidebar);