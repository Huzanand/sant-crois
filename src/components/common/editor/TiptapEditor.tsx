'use client'

import styles from './tiptapEditor.module.css'
import React, { useEffect, useState } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { TextWithTooltip } from './extensions/TextWithTooltip'
import { FillInBlank } from './extensions/FillInBlank'
import { MultipleChoice } from './extensions/MultipleChoice'
import { TooltipView } from './tiptapsViews/tooltipView'
import { FillInBlankView } from './tiptapsViews/fillInBlankView'
import { MultipleView } from './tiptapsViews/multipleView'

const TiptapEditor = ({ initialContent = '', isEditable = true, onUpdate, editorMode = 'none' }: any) => {
    const [currentNodePos, setCurrentNodePos] = useState<number | null>(null);
    const [actionBtnActive, setActionBtnActive] = useState(false);

    const [label, setLabel] = useState('');
    const [info, setInfo] = useState('');
    const [answer, setAnswer] = useState('');
    const [options, setOptions] = useState<string[]>(['']);
    const [explanation, setExplanation] = useState('');

    const editor = useEditor({
        extensions: [StarterKit, TextWithTooltip, FillInBlank, MultipleChoice],
        content: initialContent,
        editable: isEditable,
        immediatelyRender: false,

        onCreate({ editor }) {
            editor.storage.TEXT.onEdit = (pos, attrs) => {
                setCurrentNodePos(pos);
                setLabel(attrs.label);
                setInfo(attrs.info);
                setActionBtnActive(true);
            };

            editor.storage.FILL_TEMPLATE.onEdit = (pos, attrs) => {
                setCurrentNodePos(pos);
                setAnswer(attrs.answer);
                setExplanation(attrs.explanation);
                setActionBtnActive(true);
            };

            editor.storage.CHOOSE_TEMPLATE.onEdit = (pos, attrs) => {
                setCurrentNodePos(pos);
                setOptions(attrs.options);
                setAnswer(attrs.answer);
                setExplanation(attrs.explanation);
                setActionBtnActive(true);
            };
        },

        onUpdate: ({ editor }) => {
            onUpdate?.(editor.getHTML(), editor.getJSON())
        }
    })

    useEffect(() => {
        if (editor && initialContent !== editor.getJSON()) {
            editor.commands.setContent(initialContent);
        }
    }, [initialContent, editor]);

    if (!editor) return null

    const handleActionBtn = () => {
        if (!actionBtnActive) {
            const { from, to } = editor.state.selection
            const selectedText = editor.state.doc.textBetween(from, to)

            if (editorMode === 'TEXT') setLabel(selectedText)
            if (editorMode === 'FILL_TEMPLATE') setAnswer(selectedText)
            if (editorMode === 'CHOOSE_TEMPLATE') setAnswer(selectedText)
        }
        setActionBtnActive(!actionBtnActive)
    }

    const handleSave = () => {
        const chain = editor.chain().focus()

        let nodeType = ''
        if (editorMode === 'TEXT') nodeType = 'TEXT'
        if (editorMode === 'FILL_TEMPLATE') nodeType = 'FILL_TEMPLATE'
        if (editorMode === 'CHOOSE_TEMPLATE') nodeType = 'CHOOSE_TEMPLATE'

        if (!nodeType) return;

        const attrs: any = {}
        if (editorMode === 'TEXT') { attrs.label = label; attrs.info = info; }
        if (editorMode === 'FILL_TEMPLATE') { attrs.answer = answer; attrs.explanation = explanation }
        if (editorMode === 'CHOOSE_TEMPLATE') { attrs.answer = answer; attrs.options = options; attrs.explanation = explanation }

        if (currentNodePos !== null) {
            chain.insertContentAt(
                { from: currentNodePos, to: currentNodePos + 1 },
                { type: nodeType, attrs }
            ).run()
        } else {
            chain.insertContent({ type: nodeType, attrs }).run()
        }
        resetForm()
    }

    const resetForm = () => {
        setLabel('')
        setInfo('')
        setAnswer('')
        setOptions([''])
        setExplanation('')
        setCurrentNodePos(null)
        setActionBtnActive(false)
    }

    return (
        <div className={styles.editorContainer}>
            <div className={styles.action_container}>
                {editorMode === 'TEXT' &&
                    <TooltipView
                        actionBtnActive={actionBtnActive}
                        handleActionBtn={handleActionBtn}
                        info={info}
                        setInfo={setInfo}
                        label={label}
                        setLabel={setLabel}
                        handleSave={handleSave}
                        resetForm={resetForm}
                    />
                }

                {editorMode === 'FILL_TEMPLATE' &&
                    <FillInBlankView
                        actionBtnActive={actionBtnActive}
                        handleActionBtn={handleActionBtn}
                        answer={answer}
                        setAnswer={setAnswer}
                        explanation={explanation}
                        setExplanation={setExplanation}
                        handleSave={handleSave}
                        resetForm={resetForm}
                    />
                }

                {editorMode === 'CHOOSE_TEMPLATE' &&
                    <MultipleView
                        actionBtnActive={actionBtnActive}
                        handleActionBtn={handleActionBtn}
                        answer={answer}
                        setAnswer={setAnswer}
                        options={options}
                        setOptions={setOptions}
                        explanation={explanation}
                        setExplanation={setExplanation}
                        handleSave={handleSave}
                        resetForm={resetForm}
                    />
                }
            </div>

            <div className={styles.editorContent}>
                <EditorContent editor={editor} />
            </div>

        </div>
    )
}

export default TiptapEditor