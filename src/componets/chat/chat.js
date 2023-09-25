import axios from 'axios';
import React, { useState, useEffect } from 'react';
import "./chat.css"
import { Link } from 'react-router-dom';

const Chat = () => {
    const [currentUsers, setCurrentUsers] = useState([]);
    const [textmessage, setTextMessage] = useState('');
    const [receiver, setReceiver] = useState('');
    const [messages, setMessages] = useState([]);
    const [selectedReceiverName, setSelectedReceiverName] = useState('');
    const [filteredMessages, setFilteredMessages] = useState([]);

    const userData = JSON.parse(localStorage.getItem('user'));
    const sender = userData._id;
    let CurrentUser = userData.firstName;

    const selectReceiver = async (userId, userName) => {
        setReceiver(userId);
        setSelectedReceiverName(userName);

        try {
            const response = await axios.get("http://localhost:3000/chat/getMessages", {
                params:
                {
                    receiverId: userId, senderId: sender,
                },
            });
            setMessages(response.data.messages);
        } catch (err) {
            console.log(err);
        }
    };
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

    useEffect(() => {
        const filtered = messages.filter((message) => {
            return (message.sender === sender && message.receiver === receiver) ||
                (message.sender === receiver && message.receiver === sender);
        });
        setFilteredMessages(filtered);
    }, [messages, sender, receiver]);

    const sendMassage = async (event) => {
        event.preventDefault();
        try {
            if (textmessage.trim() === '') {
                console.log('Please enter a message.');
                return;
            }
            const response = await axios.post("http://localhost:3000/chat/send", {
                textmassage: textmessage,
                sender: sender,
                receiver: receiver
            });
            console.log(response);
            const newMessage = {
                text: textmessage,
                sender: sender,
                receiver: receiver,
            };
            setMessages([...messages, newMessage]);
            setTextMessage('');
        } catch (err) {
            console.log(err);
        }
    }
    return (
        <div className='container-fluid mt-5'>
            <div className='row'>
                <div className='col-md-4 line'>
                    <div className='chat-view'>
                        <div className='innerDiv'>
                            <h3 className='text'>Welcome, {CurrentUser}!</h3>
                            <hr></hr>
                            <br></br>
                            <hr className='text' />
                            <h4 className='chathedding'>Chat Box</h4>
                            <ul className='list-group'>
                                {currentUsers.map((user, index) => (
                                    <li
                                        className={`list-group-item ${user._id === receiver ? 'active' : ''}`}
                                        key={index}
                                        onClick={() => selectReceiver(user._id, `${user.firstName} ${user.lastName}`)}>
                                        {user.firstName} {user.lastName}
                                    </li>
                                ))}
                            </ul>
                            <Link to="/" className="btn btn-primary mt-3">Sign Out</Link>
                        </div>
                    </div>
                </div>
                <div className='col-md-8'>
                    <h2>{selectedReceiverName}</h2>
                    <hr></hr>
                    <div className='chat-box'>
                        <div className="message-display">
                            {filteredMessages.map((message, index) => (
                                <div key={index} className="message">
                                    <strong>{message.sender === sender ? 'You' : selectedReceiverName} : </strong>{message.textmassage}{message.text}
                                </div>
                            ))}
                        </div>
                        <div className="input-group lastDiv ">
                            <input type="text" className="form-control" value={textmessage} onChange={(e) => setTextMessage(e.target.value)} placeholder="Enter your message"
                            />
                            <div className="input-group-append">
                                <button type="submit" onClick={sendMassage} className="btn btn-outline-primary"> Send</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Chat;
