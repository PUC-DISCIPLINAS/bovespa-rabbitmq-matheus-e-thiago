import * as styles from "./styles";
import Link from "next/link";
import List from "../../components/List";
import { useRouter } from "next/router";


const Home: React.FC = () => {
  const router = useRouter();
  const checkID = async () => {
    try {
      if(!localStorage.getItem("$$id"))
        router.push("/bind")
    } catch (error) {}
  };
  checkID();

  return (
    <div>
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
      <List />
    </div>
  );
};

export default Home;
