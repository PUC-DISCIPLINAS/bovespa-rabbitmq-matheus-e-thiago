import * as styles from "./styles";
interface Content {
  name: string;
  placeholder: string;
}

const Input: React.FC<Content> = ({ name, placeholder }) => {
  return (
    <styles.InputStyle type="text" name={name} placeholder={placeholder} />
  );
};

export default Input;
