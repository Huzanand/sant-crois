import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import { MultipleChoiceComponent } from '../nodes/multipleChoiceComponent/MultipleChoiceComponent'

export const MultipleChoice = Node.create({
    name: 'CHOOSE_TEMPLATE',
    group: 'inline',
    inline: true,
    atom: true,

    addAttributes() {
        return {
            answer: { default: '' }, 
            options: { default: [] },
            explanation: {default: ''}
        }
    },

    parseHTML() {
        return [{ tag: 'span[data-type="multiple-choice"]' }]
    },

    renderHTML({ HTMLAttributes }) {
        return ['span', mergeAttributes(HTMLAttributes, { 'data-type': 'multiple-choice' })]
    },

    addStorage() {
        return { onEdit: () => { } }
    },

    addNodeView() {
        return ReactNodeViewRenderer(MultipleChoiceComponent)
    },
})