import * as styles from "./styles";
import Link from "next/link";

const Home: React.FC = () => {
  return (
    <styles.Container>
      <h1>Bem vindo!</h1>
      <div>
        <Link href="/buy">
          <a>Comprar</a>
        </Link>
      </div>
      <div>
        <Link href="/sell">
          <a>Vender</a>
        </Link>
      </div>
    </styles.Container>
  );
};

export default Home;
