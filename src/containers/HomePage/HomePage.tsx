import HomePage from '../../components/HomePg/index';
import * as actions from '../../actions/';
import { StoreState } from '../../types/index';
import { connect, Dispatch } from 'react-redux';

export function mergeProps(stateProps: Object, dispatchProps: Object, ownProps: Object) {
    return Object.assign({}, ownProps, stateProps, dispatchProps);
}

export function mapStateToProps({ enthusiasmLevel, notebooksLocation }: StoreState) {
    return {
        enthusiasmLevel,
        notebooksLocation
    };
}

export function mapDispatchToProps(dispatch: Dispatch<actions.EnthusiasmAction>) {
    return {
        onIncrement: () => console.log('cccccccccccccccccccccceee'),
        onDecrement: () => dispatch(actions.decrementEnthusiasm()),
    };
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(HomePage);