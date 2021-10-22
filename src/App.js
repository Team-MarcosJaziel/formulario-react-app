import './App.css';
import { useState } from 'react';
import CryptoJS from "crypto-js";
import sha256 from 'js-sha256';

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
      alert(`La contraseña '${state.password}' se encriptó usando AES:  ${encryptedPassword}`);
    } else {
      alert('Ingrese una contraseña');
    }
  }

  function hash() {
    if (state.password !== '') {
      let hashedPassword = sha256(state.password);
      alert(`La contraseña '${state.password}' se encriptó usando hash (SHA-256):  ${hashedPassword}`);
    } else {
      alert('Ingrese una contraseña');
    }
  }

  async function asimetrico(event) {
    let keyType = event.target.value;
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
      let encryptedData;
      if (keyType === 'private') {
        encryptedData = await window.crypto.subtle.encrypt(
          {
            name: "RSA-OAEP"
          },
          keyPair.privateKey,
          password
        );
      }

      if (keyType === 'public') {
        encryptedData = await window.crypto.subtle.encrypt(
          {
            name: "RSA-OAEP"
          },
          keyPair.publicKey,
          password
        );
      }

      let buffer = new Uint8Array(encryptedData, 0, 5);

      alert(`La contraseña '${state.password}' se encriptó usando RSA con una llave pública:  ${buffer}...[${encryptedData.byteLength} bytes total]`);
    } else {
      alert('Ingrese una contraseña');
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <div className="form-register">
          <input className="input" onChange={onChange} value={state.nombres} type="text" name="nombres" id="nombres" placeholder="Ingrese su Nombre"></input>
          <input className="input" onChange={onChange} value={state.apellidos} type="text" name="apellidos" id="apellidos" placeholder="Ingrese su Apellido"></input>
          <input className="input" onChange={onChange} value={state.email} type="email" name="email" id="email" placeholder="Ingrese su Correo"></input>
          <input className="input" onChange={onChange} type="password" required value={state.password} name="password" id="password" placeholder="Ingrese su Contraseña"></input>
          <button className="button" onClick={asimetrico} value='public'>Cifrar de manera asimétrica usando llave pública (RSA)</button>
          <button className="button" onClick={simetrico}>Cifrar de manera simétrica (AES)</button>
          <button className="button" onClick={hash}>Cifrar utilizando hash (SHA-256)</button>
        </div>
      </header>
    </div>
  );
}

export default App;
