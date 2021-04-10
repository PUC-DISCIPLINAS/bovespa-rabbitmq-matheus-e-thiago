import * as styles from "./styles";
interface Content {
  name: string;
  placeholder: string;
  type: string;
  step?: string | undefined;
}

const Input: React.FC<Content> = ({ name, placeholder, type, step = "1" }) => {
  return (
    <styles.InputStyle
      type={type}
      step={step}
      min="0"
      name={name}
      placeholder={placeholder}
      required
    />
  );
};

export default Input;
