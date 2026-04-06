import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import { TooltipComponent } from '../nodes/tooltipComponent/TooltipComponent'

export const TextWithTooltip = Node.create({
  name: 'TEXT',
  group: 'inline',
  inline: true,
  atom: true,

  addAttributes() {
    return {
      label: {
        default: 'New Phrase',
      },
      info: {
        default: '',
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'span[data-type="tooltip-button"]',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'span', 
      mergeAttributes(HTMLAttributes, { 'data-type': 'tooltip-button' })
    ]
  },

  addStorage() {
    return {
      onEdit: () => {},
    }
  },

  addNodeView() {
    return ReactNodeViewRenderer(TooltipComponent)
  },
})