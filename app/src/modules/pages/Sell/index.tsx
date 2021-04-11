import * as styles from "./styles";
import Link from "next/link";
import Input from "../../components/input";
import Button from "../../components/Button";
import { Controller } from "../../../controller/Controller";
import { useRouter } from "next/router";
import { Types } from "../../../models/Types";

const Sell: React.FC = () => {
  const router = useRouter();
  const controller = new Controller();
  const send = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const value = e.currentTarget.val.value;
    const qnt = e.currentTarget.qnt.value;
    const name = e.currentTarget.broker.value;
    controller.add(Types.sell, value, qnt, name, name);
    router.push("/");
  };

  return (
    <styles.Container>
      <form onSubmit={(e) => send(e)}>
        <styles.FormContainer>
          <h1>Vender</h1>
          <Input type="text" name="broker" placeholder="Corretora" />
          <Input
            type="number"
            step="0.01"
            name="val"
            placeholder="Valor da unidade"
          />
          <Input type="number" name="qnt" placeholder="Quantidade" />
          <Button text="enviar" />
          <Link href="/">
            <a>
              <Button text="retornar" />
            </a>
          </Link>
        </styles.FormContainer>
      </form>
    </styles.Container>
  );
};

export default Sell;
