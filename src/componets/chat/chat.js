import axios from 'axios';
import React, { useState, useEffect } from 'react';
import './chat.css'
import { Link } from 'react-router-dom';
const Chat = () => {
    const [currentUsers, setCurrentUsers] = useState([]);
    const [textmassage, setmassage] = useState([]);
    const [receiver, setReceiver] = useState('650d68c2e769bdf99c32b797');

    const userData = JSON.parse(localStorage.getItem('user'));
    const sender = userData._id;

    let CurrentUser = userData.firstName

    useEffect(() => {
        async function fetchData() {
            try {
                const currentUsersResponse = await axios.post("http://localhost:3000/chat/count");
                setCurrentUsers(currentUsersResponse.data.user);
            } catch (err) {
                console.log(err);
            }
        }
        fetchData();
    }, []);
    const sendMassage = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post("http://localhost:3000/chat/send", {
                textmassage: textmassage,
                sender: sender,
                receiver: receiver
            });
            console.log(response)
        } catch (err) {
            console.log(err);
        }
    }
    return (
        <div className='maindiv'>
            <div className='innerDiv'>
                <h3 className='text'>welcome @ "{CurrentUser}"</h3>
                <h2><hr className='text'></hr></h2>
                <h4>
                    <span className='chathedding'>Chat Box</span>
                    <hr className='text'></hr>
                    <ul>
                        {currentUsers.map((user, index) => (
                            <li className='text username' key={index}>{user.firstName} {user.lastName}</li>
                        ))}
                    </ul>
                    <button type="submit" class="btn btn-primary mb-2 "> <Link to="/"></Link>sign out</button>
      
                </h4>
            </div>
            <div className='chatView'>

                <input type="text" className="form-control textfiled" onChange={(e) => setmassage(e.target.value)} id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter your massage" />
                <input type="hidden" className="form-control textfiled" onChange={(e) => setReceiver(e.target.value)} id="exampleInputEmail1" aria-describedby="emailHelp" />

                <button type="submit" onClick={sendMassage} class="btn btn-primary mb-2 sendbutton">Send</button>
            </div>
        </div>
    );
};

export default Chat;