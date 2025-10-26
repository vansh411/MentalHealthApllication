import { useContext } from "react";
import { NameContext } from "../../App";
function Parent(){
    const abc=useContext(NameContext)
  return(
  
    <>
     <h2>Parent Component</h2>
     <hr/>
    <p>name- {abc.name}</p>
  <button onClick={()=>abc.setName("vansh")}>update</button>
    </>
  )
}
export default Parent;