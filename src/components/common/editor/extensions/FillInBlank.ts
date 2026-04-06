import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import { FillInBlankComponent } from '../nodes/fillInBlankComponent/FillInBlankComponent'

export const FillInBlank = Node.create({
    name: 'FILL_TEMPLATE',
    group: 'inline',
    inline: true,
    atom: true,

    addAttributes() {
        return {
            answer: { default: '' },
            explanation: {default: ''}
        }
    },

    parseHTML() {
        return [{ tag: 'span[data-type="fill-in-blank"]' }]
    },

    renderHTML({ HTMLAttributes }) {
        return ['span', mergeAttributes(HTMLAttributes, { 'data-type': 'fill-in-blank' })]
    },

    addStorage() {
        return { onEdit: () => { } }
    },

    addNodeView() {
        return ReactNodeViewRenderer(FillInBlankComponent)
    },
})