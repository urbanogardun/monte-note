export interface StoreState {
    enthusiasmLevel?: number;
    notebooksLocation?: string;
    notebooks?: string[];
    notes?: string[];
    lastOpenedNote?: string;
    noteContent?: string;
    trash?: any;
    lastOpenedTrashNote?: string;
    lastOpenedTrashNotebook?: string;
    currentNoteTags?: string[];
    searchResults?: object[];
    previewContent?: object;
}