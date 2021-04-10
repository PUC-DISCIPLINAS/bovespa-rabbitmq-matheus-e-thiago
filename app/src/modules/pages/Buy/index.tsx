import * as styles from "./styles";
import Link from "next/link";
import Input from "../../components/input";
import Button from "../../components/Button";
import { useRouter } from "next/router";
import { Controller } from "../../../controller/Controller";
import { Types } from "../../../models/Types";

const Buy: React.FC = () => {
  const router = useRouter();
  const controller = new Controller();

  const send = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const value = e.currentTarget.val.value;
    const qnt = e.currentTarget.qnt.value;
    const name = e.currentTarget.broker.value;
    controller.add(Types.buy, value, qnt, name);
    router.push("/");
  };

  return (
    <styles.Container>
      <form onSubmit={(e) => send(e)}>
        <styles.FormContainer>
          <h1>Comprar</h1>
          <Input type="number" name="val" placeholder="valor unidade" />
          <Input type="number" name="qnt" placeholder="quantidade" />
          <Input type="text" name="broker" placeholder="corretora" />
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
