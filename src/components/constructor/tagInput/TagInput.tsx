"use client"
import { useState } from "react";
import { Tag } from "../tag/Tag"
import styles from "./tagInput.module.css"

interface props {
    selectedTags: string[],
    setSelectetTags: (value: string[]) => void,
}

const TagInput = ({selectedTags, setSelectetTags}: props) => {

    const [isOpen, setIsOpen] = useState(false);
    const [inputValue, setInputValue] = useState<string>('');
    const [tags, setTags] = useState<string[]>([])

    const createNewTag = (newtag: string) => {
        if (!newtag.trim()) return;

        if (!tags.includes(newtag)) {
            setTags([...tags, newtag])
        }

        if (!selectedTags.includes(newtag)) {
            setSelectetTags([...selectedTags, newtag]);
        }

        setInputValue('');
    };

    const deleteTag = (selectedTag: string) => {
        setSelectetTags(
            selectedTags.filter((tag) => tag !== selectedTag)
        )
    }

    return (


        <div className={styles.input_wrapper}>
            <div className={styles.input_container}>
                {selectedTags.map((tag, indextag) => (
                    <Tag title={tag} key={tag + indextag} onClose={() => deleteTag(tag)} />
                ))}


                <input type="text" className={`body-l ${styles.input}`} value={inputValue} placeholder="New tag..."
                    onFocus={() => setIsOpen(true)}
                    onBlur={() => setTimeout(() => setIsOpen(false), 200)}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            createNewTag(inputValue);
                        }
                    }}
                />
            </div>
            <div className={`${styles.tagsList_container} ${isOpen ? styles.openTagList : ''}`}>
                <ul className={styles.tagsList}>
                    <ul className={styles.tagsList_item}>
                        {inputValue !== '' && !tags.includes(inputValue) && (
                            <button className={`body-m b-500 ${styles.listbtn}`} onClick={() => createNewTag(inputValue)}>
                                {`Create a new tag: ${inputValue}`}
                            </button>
                        )}

                    </ul>

                    {tags
                        .filter(tag => !selectedTags.includes(tag))
                        .map((tag, index) => (
                            <li className={styles.tagsList_item} key={tag + index}>
                                <button
                                    className={`body-m b-500 ${styles.listbtn}`}
                                    onClick={() => createNewTag(tag)}
                                >
                                    {tag}
                                </button>
                            </li>
                        ))
                    }

                </ul>
            </div>
        </div>

    )
}

export default TagInput;