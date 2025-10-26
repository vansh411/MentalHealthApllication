import Child2 from "./Child2";
function Child1(props){
  // const{abc}=props
  return(
    <>
    <h2>Child1 Component</h2>
    <p>name: {props.abc}</p>
    <hr/>
    <Child2 xyz={abc}/>
    </>
  )
}
export default Child1;