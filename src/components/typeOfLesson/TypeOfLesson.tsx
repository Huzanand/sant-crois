import {
  BookIco,
  GrammarIco,
  HeadphoneIco,
  ShowAllIco,
  VideoIco,
} from "@/assets/svg/icons";
import styles from "./typeOfLesson.module.css";
import { useLanguageSync } from "@/utils/useLanguage";
import { useFilterParam } from "@/utils/useFilterParam";

type btnProps = {
  value: string;
  checked: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  activeIcon: React.ReactNode;
  icon: React.ReactNode;
  label: string;
};

const Button = ({
  value,
  checked,
  onChange,
  activeIcon,
  icon,
  label,
}: btnProps) => (
  <label>
    <div
      className={styles.item__container}
      style={{ background: checked ? "#6554C0" : undefined }}
    >
      <input
        type="radio"
        value={value}
        checked={checked}
        onChange={onChange}
        className={styles.input}
      />
      <div className={styles.item}>
        <div style={{ width: "24px", height: "24px" }}>
          {checked ? activeIcon : icon}
        </div>
        <p
          className="buttons-l ln24"
          style={{ color: checked ? "#fff" : "inherit" }}
        >
          {label}
        </p>
      </div>
    </div>
  </label>
);

const TypeOfLesson = () => {
  const { selectedValue, updateParam, clearParam } =
    useFilterParam("exerciseType");

  const { t } = useLanguageSync();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value === "all") {
      clearParam();
    } else {
      updateParam(event.target.value);
    }
  };

  return (
    <div className="radio-group">
      <Button
        icon={<ShowAllIco />}
        activeIcon={<ShowAllIco fill="#fff" />}
        label={t("all")}
        value="all"
        checked={selectedValue === ""}
        onChange={handleChange}
      />
      <Button
        icon={<VideoIco />}
        activeIcon={<VideoIco fill="#fff" />}
        label={t("video")}
        value="video"
        checked={selectedValue === "video"}
        onChange={handleChange}
      />
      <Button
        icon={<HeadphoneIco />}
        activeIcon={<HeadphoneIco fill="#fff" />}
        label={t("audio")}
        value="audio"
        checked={selectedValue === "audio"}
        onChange={handleChange}
      />
      <Button
        icon={<BookIco />}
        activeIcon={<BookIco fill="#fff" />}
        label={t("reading")}
        value="reading"
        checked={selectedValue === "reading"}
        onChange={handleChange}
      />
      <Button
        icon={<GrammarIco />}
        activeIcon={<GrammarIco fill="#fff" />}
        label={t("grammar")}
        value="grammar"
        checked={selectedValue === "grammar"}
        onChange={handleChange}
      />
    </div>
  );
};

export default TypeOfLesson;
