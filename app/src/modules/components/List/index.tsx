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
            <th>Tipo</th>
            <th>Valor</th>
            <th>Quantidade</th>
            <th>Corretora</th>
          </tr>
        </thead>
        <tbody>
          {opData.map((op: Operation, index) => (
            <tr key={index}>
              <td>{op.getType()}</td>
              <td>{op.getValue()}</td>
              <td>{op.getQnt()}</td>
              <td>{op.getBroker()}</td>
            </tr>
          ))}
        </tbody>
      </styles.OperationTable>
    </styles.Container>
  );
};

export default List;
