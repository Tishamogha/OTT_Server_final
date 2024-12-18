import React, {useState} from 'react'
import './Login.css'
import logo from '../../assets/BSLogo_transparent.png'
import { useNavigate } from 'react-router-dom'

const Login = () => {


  const [signState, setSignState] = useState("Sign In")
  return (
    <div className='login'>
      <img src={logo} className='login-logo' alt="" />
      <div className="login-form">
        <h1>{signState}</h1>
        <form>
          {signState==="Sign Up"?<input type="text" placeholder='Name' />
          :<></>}
          
          <input type="email" placeholder='Email' />
          <input type='password' placeholder='Password'/>

          <button>{signState}</button>
          <div className="form-help">
            <div className="remember">
              <input type="checkbox" />
              <label htmlFor=''>Remember Me</label>
            </div>
            <p>Need help?</p>
          </div>
        </form>
        <div className="form-switch"> 
          {signState==="Sign In"?<p>New to BootStream ?<span onClick={()=>{setSignState("Sign Up")}}> Sign up now</span></p>:<p>Already have account ?<span onClick={()=>{setSignState("Sign In")}}>Sign In now</span></p>}
        
        </div>
      </div>
    </div>
  )
}

export default Login
