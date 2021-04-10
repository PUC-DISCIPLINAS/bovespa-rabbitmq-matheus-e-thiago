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
              <th>{op.getType()}</th>
              <th>{op.getValue()}</th>
              <th>{op.getQnt()}</th>
              <th>{op.getBroker().getName()}</th>
              {/* <th>{op.getType()}</th>
               <th>{op.getValue()}</th>
               <th>{op.getQnt()}</th>
               <th>{op.getBroker().getName()}</th> */}
            </tr>
          ))}
        </tbody>
      </styles.OperationTable>
    </styles.Container>
  );
};

export default List;
