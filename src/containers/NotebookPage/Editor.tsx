import Editor from '../../components/NotebookPage/Editor/index';
import * as actions from '../../actions/';
import { StoreState } from '../../types/index';
import { connect, Dispatch } from 'react-redux';

export function mergeProps(stateProps: Object, dispatchProps: Object, ownProps: Object) {
    return Object.assign({}, ownProps, stateProps, dispatchProps);
}

export function mapStateToProps({ lastOpenedNote, noteContent }: StoreState) {
    // console.log(noteContent);
    // console.log(lastOpenedNote);
    return {
        lastOpenedNote,
        noteContent
    };
}

export function mapDispatchToProps(dispatch: Dispatch<actions.EnthusiasmAction>) {
    return {
        onIncrement: () => dispatch(actions.decrementEnthusiasm()),
        onDecrement: () => dispatch(actions.decrementEnthusiasm()),
    };
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(Editor);