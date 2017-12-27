import NotebooksList from './NotebooksList';
import * as actions from '../../../../actions/index';
import { StoreState } from '../../../../types/index';
import { connect, Dispatch } from 'react-redux';

export function mergeProps(stateProps: Object, dispatchProps: Object, ownProps: Object) {
    return Object.assign({}, ownProps, stateProps, dispatchProps);
}

export function mapStateToProps({ notebooks }: StoreState) {
    console.log("WATCH OUT!!!");
    console.log(notebooks);
    return {
        notebooks,
    };
}

export function mapDispatchToProps(dispatch: Dispatch<actions.EnthusiasmAction>) {
    return {
        onIncrement: () => console.log('cccccccccccccccccccccceee'),
        onDecrement: () => dispatch(actions.decrementEnthusiasm()),
    };
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(NotebooksList);