import * as React from 'react';
import Button from './Button/index';
import Modal from './Modal/index';

export interface Props {
    name?: string;
    enthusiasmLevel?: number;
}

function NewNotebook({ name, enthusiasmLevel = 1 }: Props) {
    return (
        <div className="add-notebook">
            <Button />
            <Modal />
        </div>

    );
}

export default NewNotebook;
