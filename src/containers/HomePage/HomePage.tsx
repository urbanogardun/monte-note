import HomePage from '../../components/HomePage/index';
import * as actions from '../../actions/';
import { StoreState } from '../../types/index';
import { connect, Dispatch } from 'react-redux';

export function mergeProps(stateProps: Object, dispatchProps: Object, ownProps: Object) {
    return Object.assign({}, ownProps, stateProps, dispatchProps);
}

export function mapStateToProps(
    { enthusiasmLevel, notebooksLocation, notebooks, previewContent, allTags, selectedTags }: StoreState) {
    console.log(selectedTags);
    return {
        enthusiasmLevel,
        notebooksLocation,
        notebooks,
        previewContent,
        allTags,
        selectedTags
    };
}

export function mapDispatchToProps(dispatch: Dispatch<actions.EnthusiasmAction>) {
    return {
        onIncrement: () => dispatch(actions.decrementEnthusiasm()),
        onDecrement: () => dispatch(actions.decrementEnthusiasm()),
        updateTags: (tags: string[]) => dispatch(actions.updatePreviewContentTags(tags)),
        updateSelectedTags: (tags: string[]) => dispatch(actions.updateSelectedTags(tags)),
    };
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(HomePage);