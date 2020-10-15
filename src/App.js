import React, { useRef, useState } from 'react';
import './App.css';

import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'

import {useAuthState} from 'react-firebase-hooks/auth'
import {useCollectionData} from 'react-firebase-hooks/firestore'

firebase.initializeApp({
  apiKey: "AIzaSyBM1PhJnoViue2SB4PmfTGjCh9Oi2XcqqM",
    authDomain: "superchat-e857f.firebaseapp.com",
    databaseURL: "https://superchat-e857f.firebaseio.com",
    projectId: "superchat-e857f",
    storageBucket: "superchat-e857f.appspot.com",
    messagingSenderId: "319306623411",
    appId: "1:319306623411:web:d1b0541e7afc91692e43c6",
    measurementId: "G-LC7EYKQ1JY"
})

const auth = firebase.auth()
const firestore = firebase.firestore()

function App() {

const [user] = useAuthState(auth)

  return (
    <div className="App">
      <header >
      <h1>⚛️🔥💬</h1>
        <SignOut />
      </header>

  <section>{user ? <ChatRoom /> : <SignIn />}</section>
    </div>
  );
}

function SignIn() {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }
  return (
    <button onClick={signInWithGoogle}>Sign in with Google</button>
  )
}

function SignOut() {
  return auth.currentUser && (
    <button onClick={() => auth.signOut()}>Sign Out</button>
  )
}

function ChatRoom() {

  const dummy = useRef()
  const messageRef = firestore.collection('messages');
  const query = messageRef.orderBy('createdAt').limit(25);

  const [messages] = useCollectionData(query, {idField: 'id'});

  const [formValue, setFormValue] = useState('');

  const sendMessage = async(e) => {
    e.preventDefault();
    const { uid, photoURL } = auth.currentUser;
    await messageRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    })
    setFormValue('');
    dummy.current.scrollIntoView({ behavior: 'smooth' });
  }


  return(
    <>
    <main>
      {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg}/>)}
      <div ref={dummy}></div>
    </main>
    <form onSubmit={sendMessage}>
<input value={formValue} onChange={(e) => setFormValue(e.target.value)} />
<button type="submit">🕊</button>
    </form>
    </>
  )
}

function ChatMessage(props) {
  const {text, uid, photoURL} = props.message;
  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';
  return (
    <div className={`message ${messageClass}`}>
      <img src={photoURL} alt="" />
      <p>{text}</p>
    </div>
  )
}


export default App;
