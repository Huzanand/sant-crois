'use client'

import { NodeViewWrapper } from '@tiptap/react'
import styles from './fillInBlankComponent.module.css'

declare module '@tiptap/core' {
  interface Storage {
    FILL_TEMPLATE: {
      onEdit: (pos: number, attrs: { answer: string, explanation: string}) => void
    }
  }
}

export const FillInBlankComponent = (props: any) => {
    const { node, editor, getPos } = props
    const { answer } = node.attrs

    // TEACHER / CONSTRUCTOR MODE
    if (editor.isEditable) {
        return (
            <NodeViewWrapper className={styles.container}>
                <button
                    className={styles.button}
                    onClick={() => (editor as any).storage.FILL_TEMPLATE.onEdit(getPos(), node.attrs)}
                >
                    {answer || 'Empty Blank'}
                </button>
            </NodeViewWrapper>
        )
    }

    // STUDENT MODE
    return (
        <NodeViewWrapper className={styles.container}>
            <input
                type="text"
                className={styles.studentInput}
                placeholder="..."
                style={{ width: `${Math.max(answer.length, 3)}ch` }}
            />
        </NodeViewWrapper>
    )
}