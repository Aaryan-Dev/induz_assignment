import './App.css';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Modal from 'react-modal';
import { useState } from 'react';
import { QRCodeDisplay, TOTPLogin } from './totp';
import { GoogleLogin, googleLogout } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import induz from './induz3.png'

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isQrModalOpen, setIsQrModalOpen] = useState(false)
  const [qrEmail, setQrEmail] = useState('')
  const [decoded, setDecoded] = useState({})
  
  const initialValues = {
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    mobile_number: '',
    verify_password: '',
  }

  const handleLoginSuccess = (credentialResponse) => {
    console.log('Login Success:', credentialResponse);
    const decodedToken = jwtDecode(credentialResponse.credential);
    console.log('Decoded User Info:', decodedToken);
    setDecoded(decodedToken)
  };

  const handleLoginFailure = (error) => {
    alert('Login Failed:', error);
  };

  const customStyles = {
    overlay: {
      backgroundColor: 'rgba(51, 51, 51, 0.28)',
      zIndex: '99',
    },
    content: {
      top: '30%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translateX(-50%)',
      borderRadius: '0.75rem',
      paddingTop: '1rem',
      maxWidth: '94%',
    },
  };

  const onSubmit = () => {
    alert(`You are now signed up ${formik?.values?.email} ${formik?.values?.first_name} ${formik?.values?.last_name} ${formik?.values?.mobile_number}`)
  }

  const validationSchema = Yup.object({
    first_name: Yup.string().required('Please enter first name'),
    last_name: Yup.string().required('Please enter last name'),
    mobile_number: Yup.string().min(10, 'Must be 10 digits').max(10, 'Should not exceed 10 digits').required('Please enter mobile number'),
    email: Yup.string().required('Please enter your email').matches(/^(?!\.)([A-Z0-9._%+-]+)@[A-Z0-9.-]+\.[A-Z]{2,4}$/i, 'Email address must be valid'),
    password: Yup.string().required('Please enter your password').matches(/^.*(?=.{10,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/,
      "Password must contain at least 10 characters, one uppercase, one number and one special case character"
    ),
    verify_password: Yup.string().test('verify_password', 'Password must match', (val) => val == formik?.values?.password),
  })

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
    validateOnMount: true,
  })

  const handleInput = (inputType, e) => {
    formik.errors[inputType] && formik.setFieldTouched(inputType)
    formik.setFieldValue(inputType, e.target.value)
  }

  const handleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleQrModal = () => {
    setIsQrModalOpen(!isQrModalOpen);
  };

  const hanldleQrLogin = () => {
    setQrEmail(formik?.values?.email)
  }

  const handleLogout = () => {
    googleLogout(); 
    setDecoded(null);  
    console.log('User logged out');
  };


  return (
    <div className="App">
      <img src={induz}></img>
      <button className='SignUp' onClick={handleModal}>Sign up via email </button>

      <button className='SignUp' onClick={handleQrModal}>Sign up via QR</button>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={handleModal}
        style={customStyles}
        role='dialog'
      >
        <div className='CustomReactModal'>
          <button
            className='CustomReactModal__Close'
            type='button'
            onClick={handleModal}
            title='close'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='icon icon-close'
              width='44'
              height='44'
              viewBox='0 0 24 24'
              strokeWidth='1.5'
              stroke='currentColor'
              fill='none'
              strokeLinecap='round'
              strokeLinejoin='round'
            >
              <path stroke='none' d='M0 0h24v24H0z' fill='none' />
              <line x1='18' y1='6' x2='6' y2='18' />
              <line x1='6' y1='6' x2='18' y2='18' />
            </svg>
          </button>

          <form onSubmit={formik.handleSubmit}>
            <div className="Signupform">
              <input onChange={(e) => handleInput('first_name', e)} type='text' placeholder='First name' value={formik.values.first_name}></input>
              {<span className='form-error'>{formik.touched?.first_name && formik.errors?.first_name && formik.errors?.first_name}</span>}


              <input onChange={(e) => handleInput('last_name', e)} type='text' placeholder='Last name' value={formik.values.last_name}></input>
              {<span className='form-error'>{formik.touched?.last_name && formik.errors?.last_name && formik.errors?.last_name}</span>}

              <input onChange={(e) => handleInput('mobile_number', e)} type='number' placeholder='Mobile Number' value={formik.values.mobile_number}></input>
              {<span className='form-error'>{formik.touched?.mobile_number && formik.errors?.mobile_number && formik.errors?.mobile_number}</span>}


              <input onChange={(e) => handleInput('email', e)} type='email' placeholder='Email' value={formik.values.email}></input>
              {<span className='form-error'>{formik.touched?.email && formik.errors?.email && formik.errors?.email}</span>}

              <input onChange={(e) => handleInput('password', e)} type='password' placeholder='Password' value={formik.values.password} ></input>
              {<span className='form-error'>{formik.touched?.password && formik.errors?.password && formik.errors?.password}</span>}

              <input onChange={(e) => handleInput('verify_password', e)} type='password' placeholder='Retype password' value={formik.values.verify_password} ></input>
              {<span className='form-error'>{formik.touched?.verify_password && formik.errors?.verify_password && formik.errors?.verify_password}</span>}

              <button type='submit'>Sign Up</button>
            </div>
          </form>
        </div>
      </Modal>


      <Modal
        isOpen={isQrModalOpen}
        onRequestClose={handleQrModal}
        style={customStyles}
        role='dialog'
      >
      <div className='CustomReactModal'>
         <button
            className='CustomReactModal__Close'
            type='button'
            onClick={handleQrModal}
            title='close'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='icon icon-close'
              width='44'
              height='44'
              viewBox='0 0 24 24'
              strokeWidth='1.5'
              stroke='currentColor'
              fill='none'
              strokeLinecap='round'
              strokeLinejoin='round'
            >
              <path stroke='none' d='M0 0h24v24H0z' fill='none' />
              <line x1='18' y1='6' x2='6' y2='18' />
              <line x1='6' y1='6' x2='18' y2='18' />
            </svg>
          </button>


      <div className='QRCodeDisplay'>
        <input style={{width: '30vw', marginRight: '1rem'}} onChange={(e) => handleInput('email', e)} type='email' placeholder='Please provide your email address' value={formik.values.email}></input>
        <button disabled={ formik.errors?.email} onClick={() => hanldleQrLogin()}>Enter</button>
        <br></br>
        {<span className='form-error'>{formik.touched?.email && formik.errors?.email && formik.errors?.email}</span>}
        {qrEmail && <QRCodeDisplay email={qrEmail}/>}
         <br></br>
        {qrEmail && <TOTPLogin/>}
      </div>
      </div>
      </Modal>


      <div className='SignUp'>
      <GoogleLogin
        onSuccess={handleLoginSuccess}
        onError={handleLoginFailure}
      />
    </div>
 
    { decoded?.name &&

    <div style={{margin: 'auto', textAlign: 'center'}}>
      <span>{decoded?.name}</span>
      <br></br>
      <img style={{width: '100%'}} src={decoded?.picture}></img>
      <button onClick={handleLogout}>Log out</button>
    </div>
    }

    </div>
  );
}

export default App;


