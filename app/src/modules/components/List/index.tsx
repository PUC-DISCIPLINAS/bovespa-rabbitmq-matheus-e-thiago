import * as styles from "./styles";
import { useEffect, useState } from "react";
import { Controller } from "../../../controller/Controller";
import { Operation } from "../../../models/Operation";
import Button from "../Button";
import { OperationList } from "../../../models/OperationList";

const List: React.FC = () => {
  const controller = new Controller();
  let opData: Operation[] = controller.get();
  const [data, setData] = useState(opData);

  const update = () => {
    try {
      const localStorageValue = localStorage.getItem("$$id");
      if (localStorageValue) {
        OperationList.initialize(localStorageValue);
        setData(controller.get());
      }
    } catch (error) {}
  };

  return (
    <styles.ContainerWithButton>
      <div onClick={() => update()}>
        <Button text="Atualizar" />
      </div>
      <styles.Container>
        <styles.OperationTable>
          <thead>
            <tr>
              <th>Interesse</th>
              <th>Ação</th>
              <th>Valor</th>
              <th>Quantidade</th>
              <th>Última atualização</th>
              <th>Ativo</th>
            </tr>
          </thead>
          <tbody>
            {opData.map((op: Operation, index) => (
              <tr
                key={index}
                className={op.isActive() ? "enabled" : "desabled"}
              >
                <td>{op.getOwner()}</td>
                <td>{op.getType() + ": " + op.getBroker()}</td>
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
    </styles.ContainerWithButton>
  );
};

export default List;
