import * as styles from "./styles";
import Link from "next/link";
import Input from "../../components/input";
import Button from "../../components/Button";
import { FormEvent } from "react";
import { useRouter } from "next/router";

const Buy: React.FC = () => {
  const router = useRouter();

  const send = (e: FormEvent) => {
    e.preventDefault();
    alert("Comprou!");
    router.push("/");
  };

  return (
    <styles.Container>
      <form onSubmit={(e) => send(e)}>
        <styles.FormContainer>
          <h1>Comprar</h1>
          <Input type="number" name="valor" placeholder="valor unidade" />
          <Input type="number" name="quantidade" placeholder="quantidade" />
          <Input type="text" name="corretora" placeholder="corretora" />
          <Button text="Enviar" />
          <Link href="/">
            <a>
              <Button text="Retornar" />
            </a>
          </Link>
        </styles.FormContainer>
      </form>
    </styles.Container>
  );
};

export default Buy;
