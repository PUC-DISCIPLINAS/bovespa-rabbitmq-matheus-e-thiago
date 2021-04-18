import * as styles from "./styles";
import Label from "../../components/Label"
import {Actives} from "../../../models/Actives"
import Button from "../../components/Button";
import { useRouter } from "next/router";
import { bind } from "../../../api/api"

const Bind: React.FC = () => {
    const router = useRouter();
    const bindSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const bindings = [];
        console.log( )
        Actives.forEach((act) => {
            e.currentTarget[act].checked && bindings.push(act)  
        })
      if (!localStorage.getItem("$$id")) {
        const response = await bind(bindings);
        localStorage.setItem("$$id", response.toString());
      }
        
        router.push("/")
    }

    return (
        <styles.Container>
            <styles.FormContainer>
            <form onSubmit={(e) => bindSubmit(e)}>
                <h1>Selecione Seus Interesses</h1>
                 {Actives.map((ac,index) => {
                     return(<styles.Label>
                       {ac}
                       <input key={index} type="checkbox" name={ac}></input>
                     </styles.Label>)
                 })}
                 <Button text="INSCREVER"/>
            </form>
            </styles.FormContainer>
        </styles.Container>
        
    );
};
  
  export default Bind;