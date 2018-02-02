import Trashcan from '../../components/TrashcanPage/index';
import * as actions from '../../actions/';
import { StoreState } from '../../types/index';
import { connect, Dispatch } from 'react-redux';

export function mergeProps(stateProps: Object, dispatchProps: Object, ownProps: Object) {
    return Object.assign({}, ownProps, stateProps, dispatchProps);
}

export function mapStateToProps({ trash, noteContent, lastOpenedTrashNote, lastOpenedTrashNotebook }: StoreState) {
    return {
        trash,
        noteContent,
        lastOpenedTrashNote,
        lastOpenedTrashNotebook
    };
}

export function mapDispatchToProps(dispatch: Dispatch<actions.EnthusiasmAction>) {
    return {
        onIncrement: () => dispatch(actions.decrementEnthusiasm()),
        updateTrash: (data: any) => dispatch(actions.loadTrash(data)),
        emptyLastOpenedTrash: () => {
            console.log('empty trash');
            dispatch(actions.loadLastOpenedTrashNote(''));
            dispatch(actions.loadLastOpenedTrashNotebook(''));
        }
    };
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(Trashcan);