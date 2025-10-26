  import { Outlet ,Link,useNavigate} from "react-router-dom";
import { useState ,useEffect} from "react";
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
function UserLayout(){
    const[verified,setVerified]=useState(false)
    let navigate=useNavigate()
    useEffect(()=>{
    let token =localStorage.getItem("token")
    if(!token){
        navigate('/sign-in')
    }else{
        setVerified(true)
    }
},[])
    return(
        <>
        {verified &&
        <>
    
           <Navbar expand="lg" className="bg-body-tertiary">
      <Container fluid>
        <Navbar.Brand href="#">Todo List</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav className="me-auto my-2 my-lg-0"
            style={{ maxHeight: '100px' }}
            navbarScroll
          >
            <Link className="nav-link"  to="/user">Home</Link>
            <Link className="nav-link" to="/user/profile">Profile</Link>
          
             
           
          </Nav>
         
        </Navbar.Collapse>
      </Container>
    </Navbar>
      <Outlet/>

          <footer className=" container-fluid bg-dark text-white">
            <div className="row py-3">
              <div className="col-6">
                &copy; 2024
              </div>
              <div className="col-6">
                    FreeLancer Marketplace
              </div>
            </div>
          </footer>

        </>
}
        </>
    )
}
export default UserLayout;