import HomePage from '../../components/HomePage/index';
import * as actions from '../../actions/';
import { StoreState } from '../../types/index';
import { connect, Dispatch } from 'react-redux';

export function mergeProps(stateProps: Object, dispatchProps: Object, ownProps: Object) {
    return Object.assign({}, ownProps, stateProps, dispatchProps);
}

export function mapStateToProps({ enthusiasmLevel, notebooksLocation, notebooks }: StoreState) {
    return {
        enthusiasmLevel,
        notebooksLocation,
        notebooks,
    };
}

export function mapDispatchToProps(dispatch: Dispatch<actions.EnthusiasmAction>) {
    return {
        onIncrement: () => dispatch(actions.decrementEnthusiasm()),
        onDecrement: () => dispatch(actions.decrementEnthusiasm()),
        previewNote: (notebook: string, note: string) => {
            console.log(`Preview note: ${note} for notebook: ${notebook}`);
        }
    };
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(HomePage);