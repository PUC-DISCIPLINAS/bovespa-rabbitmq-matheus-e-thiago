import * as styles from "./styles";
interface Content {
  name: string;
  placeholder: string;
  type: string;
}

const Input: React.FC<Content> = ({ name, placeholder, type }) => {
  return (
    <styles.InputStyle
      type={type}
      step="0.01"
      min="0"
      name={name}
      placeholder={placeholder}
    />
  );
};

export default Input;
