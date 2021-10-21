import './App.css';
import { useState } from 'react';
import CryptoJS from "crypto-js";

function App() {
  const [state, setState] = useState({
    nombres: "",
    apellidos: "",
    email: "",
    password: ""
  });

  const onChange = (event) => {
    const value = event.target.value;
    setState({
      ...state,
      [event.target.name]: value
    });
  };

  function simetrico() {
    if (state.password !== '') {
      let encryptedPassword = CryptoJS.AES.encrypt(state.password, 'Seguridad').toString();
      alert(`Su contraseña ${state.password} se encriptó usando AES:  ${encryptedPassword}`);
    } else {
      alert('Ingrese una contraseña');
    }
  }

  async function asimetrico() {
    if (state.password !== '') {
      let encoder = new TextEncoder();
      let password = encoder.encode(state.password)
      let keyPair = await window.crypto.subtle.generateKey(
        {
          name: "RSA-OAEP",
          modulusLength: 4096,
          publicExponent: new Uint8Array([1, 0, 1]),
          hash: "SHA-256"
        },
        true,
        ["encrypt", "decrypt"]
      );

      const encryptedData = await window.crypto.subtle.encrypt(
        {
          name: "RSA-OAEP"
        },
        keyPair.publicKey,
        password
      );

      let buffer = new Uint8Array(encryptedData, 0, 5);

      alert(`La contraseña ${state.password} se encriptó usando RSA con una llave pública:  ${buffer}...[${encryptedData.byteLength} bytes total]`);
    } else {
      alert('Ingrese una contraseña');
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <div action="no-script-url" className="form-register">
          <input className="input" onChange={onChange} value={state.nombres} type="text" name="nombres" id="nombres" placeholder="Ingrese su Nombre"></input>
          <input className="input" onChange={onChange} value={state.apellidos} type="text" name="apellidos" id="apellidos" placeholder="Ingrese su Apellido"></input>
          <input className="input" onChange={onChange} value={state.email} type="email" name="email" id="email" placeholder="Ingrese su Correo"></input>
          <input className="input" onChange={onChange} type="password" value={state.password} name="password" id="password" placeholder="Ingrese su Contraseña"></input>
          <button className="button" onClick={simetrico}>Cifrar de manera simétrica</button>
          <button className="button" onClick={asimetrico}>Cifrar de manera asimétrica</button>
        </div>
      </header>
    </div>
  );
}

export default App;
