'use client'

import { NodeViewWrapper } from '@tiptap/react'
import styles from './TooltipComponent.module.css'

declare module '@tiptap/core' {
  interface Storage {
    TEXT: {
      onEdit: (pos: number, attrs: { label: string; info: string }) => void
    }
  }
}

export const TooltipComponent = (props: any) => {
    const { node, getPos, editor } = props
    const { label, info } = node.attrs

    const handleClick = () => {
        if (editor.isEditable) {
            (editor as any).storage.TEXT.onEdit(getPos(), { label, info })
        }
    }

    return (
        <NodeViewWrapper className={styles.container}>
            <button type="button" className={styles.button} onClick={handleClick}>
                {label}
            </button>
        </NodeViewWrapper>
    )
}