import React, { useRef, useState } from 'react';
import './App.css';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import 'firebase/compat/analytics';
import { useCollectionData } from 'react-firebase-hooks/firestore';

import { useAuthState } from 'react-firebase-hooks/auth';
firebase.initializeApp({
  apiKey: "AIzaSyA12TdDwTTAROZ7OCjbCKuQ0boQXGIPofs",
  authDomain: "react-chatbotapp.firebaseapp.com",
  projectId: "react-chatbotapp",
  storageBucket: "react-chatbotapp.appspot.com",
  messagingSenderId: "678910201917",
  appId: "1:678910201917:web:0ba34e0d209233a3175a54",
  measurementId: "G-9Z1TP2JHEN"
})

const auth = firebase.auth();
const firestore = firebase.firestore();


function App() {

  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <header>
        <h1>⚛️🔥💬</h1>
        {user ? <SignOut /> : 'CopyRight © Ali Chaabane'}
      </header>

      <section>
        {user ? <ChatRoom /> : <SignIn />}
      </section>

    </div>
  );
}

function SignIn() {

  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }

  return (
    <>
    <div className='classi'>
         <div className='g-sign-in-button' onClick={signInWithGoogle}>
    <div className='content-wrapper'>
        <div className='logo-wrapper'>
            <img src='https://developers.google.com/identity/images/g-logo.png' alt='signin' />
        </div>
        <span className='text-container'>
      <span>Sign in with Google</span>
    </span>
    </div>
</div>
</div>
    </>
  )

}

function SignOut() {
  return auth.currentUser && (
    <button className="sign-out" onClick={() => auth.signOut()}>Sign Out</button>
  )
}

function ChatRoom() {
  const dummy = useRef();
  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(25);

  const [messages] = useCollectionData(query, { idField: 'id' });

  const [formValue, setFormValue] = useState('');


  const sendMessage = async (e) => {
    e.preventDefault();

    const { uid, photoURL } = auth.currentUser;

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    })

    setFormValue('');
    dummy.current.scrollIntoView({ behavior: 'smooth' });
  }

  return (<>
    <main>

      {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}

      <span ref={dummy}></span>

    </main>

    <form onSubmit={sendMessage}>

      <input value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="say something nice" />

      <button type="submit" disabled={!formValue}>🕊️</button>

    </form>
  </>)
}


function ChatMessage(props) {
  const { text, uid, photoURL } = props.message;

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  return (<>
    <div className={`message ${messageClass}`}>
      <img src={photoURL || 'https://api.adorable.io/avatars/23/abott@adorable.png'} alt="User" />
      <p>{text}</p>
    </div>
  </>)
}


export default App;
