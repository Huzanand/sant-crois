'use client'

import { NodeViewWrapper } from '@tiptap/react'
import styles from './TooltipComponent.module.css'
import Tooltip from '@/components/tooltip/Tooltip'

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

    const handleEditClick = (e: React.MouseEvent) => {
        e.preventDefault()
        if (editor.isEditable) {
            (editor as any).storage.TEXT.onEdit(getPos(), { label, info })
        }
    }

    return (
        <NodeViewWrapper className={styles.container} as="span" style={{ display: 'inline-block', lineHeight: 'inherit'}}>
            {editor.isEditable ? (
                <button
                    type="button"
                    className={styles.button}
                    onClick={handleEditClick}
                >
                    {label}
                </button>
            ) : (
                <Tooltip
                    title={label}
                    content={info}
                    underline
                >
                    {label}
                </Tooltip>
            )}
        </NodeViewWrapper>
    )
}