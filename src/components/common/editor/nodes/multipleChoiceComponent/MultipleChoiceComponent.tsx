'use client'

import { NodeViewWrapper } from '@tiptap/react'
import styles from './multipleChoiceComponent.module.css'

declare module '@tiptap/core' {
    interface Storage {
        CHOOSE_TEMPLATE: {
            onEdit: (pos: number, attrs: { answer: string, options: string[], explanation: string }) => void
        }
    }
}

export const MultipleChoiceComponent = (props: any) => {
    const { node, editor, getPos } = props
    const { options = [''], answer = '' } = node.attrs

    if (editor.isEditable) {
        return (
            <NodeViewWrapper className={styles.container}>
                <button
                    type="button"
                    className={styles.button}
                    onClick={() => (editor as any).storage.CHOOSE_TEMPLATE.onEdit(getPos(), node.attrs)}
                >
                    {answer || 'Set answer'}
                </button>
            </NodeViewWrapper>
        )
    }

    return (
        <NodeViewWrapper className={styles.container}>
            <select className={styles.studentSelect}>
                <option value="" disabled selected hidden>Select...</option>
                {options.map((opt: string, i: number) => (
                    <option key={i} value={opt}>{opt}</option>
                ))}
            </select>
        </NodeViewWrapper>
    )
}