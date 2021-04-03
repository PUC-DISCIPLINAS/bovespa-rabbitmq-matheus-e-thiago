import * as styles from "./styles";

interface Content {
  text: string;
}

const Button: React.FC<Content> = ({ text }) => {
  return <styles.ButtonStyle type="submit"> {text} </styles.ButtonStyle>;
};

export default Button;
