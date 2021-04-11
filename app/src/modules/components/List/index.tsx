import * as styles from "./styles";
import { Controller } from "../../../controller/Controller";
import { Operation } from "../../../models/Operation";

const List: React.FC = () => {
  const controller = new Controller();
  const opData: Operation[] = controller.get();

  console.log(opData);

  return (
    <styles.Container>
      <styles.OperationTable>
        <thead>
          <tr>
            <th>Corretora</th>
            <th>Tipo</th>
            <th>Valor</th>
            <th>Quantidade</th>
            <th>Última atualização</th>
            <th>Ativo</th>
          </tr>
        </thead>
        <tbody>
          {opData.map((op: Operation, index) => (
            <tr key={index} className={op.isActive() ? "enabled" : "desabled"}>
              <td>{op.getBroker()}</td>
              <td>{op.getType()}</td>
              <td>{op.getValue()}</td>
              <td>{op.getQnt()}</td>
              <td>
                {op.getDate().toLocaleDateString() +
                  " | " +
                  op.getDate().toLocaleTimeString()}
              </td>
              <td>{op.isActive() ? "Sim" : "Não"}</td>
            </tr>
          ))}
        </tbody>
      </styles.OperationTable>
    </styles.Container>
  );
};

export default List;
