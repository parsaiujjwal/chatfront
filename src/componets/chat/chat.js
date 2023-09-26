import axios from 'axios';
import React, { useState, useEffect } from 'react';
import "./chat.css"
import { Link, redirect } from 'react-router-dom';

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
            setInterval(async () => {
                const response = await axios.get("http://localhost:3000/chat/getMessages", {
                    params:
                    {
                        receiverId: userId, senderId: sender,
                    },
                });
                setMessages(response.data.messages);
            }, 2000);
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
    const logout = () => {
        localStorage.removeItem('user')
        localStorage.removeItem('token');
    }
    return (
        <div className="container-fluid mt-5">
            <div className="row">
                <div className="col-md-4 chat-sidebar">
                    {/* Left chat box */}
                    <div className="chat-view">
                        <div className="innerDiv bg-info">
                            <h3 className="text">Welcome, {CurrentUser.charAt(0).toUpperCase() + CurrentUser.slice(1)}!</h3>
                            <hr></hr>
                            <br></br>
                            <hr className="text" />
                            <h4 className="chathedding">Chat Box</h4>
                            <ul className="list-group">
                                {currentUsers.map((user, index) => (
                                    <li
                                        className={`list-group-item ${user._id === receiver ? 'active' : ''}`}
                                        key={index}
                                        onClick={() => selectReceiver(user._id, `${user.firstName} ${user.lastName}`)}
                                    >
                                        {user.firstName.toUpperCase()} {user.lastName.toUpperCase()}
                                    </li>
                                ))}
                            </ul>
                            <Link to="/" onClick={logout} className="btn btn-outline-primary mt-3">
                                Sign Out
                            </Link>
                        </div>
                    </div>
                </div>
                <div></div>
                <div className="col-md-8 rightbox">
                    {/* Right chat view */}
                    <h2>{selectedReceiverName.charAt(0).toUpperCase() + selectedReceiverName.slice(1)}</h2>
                    <hr className=''></hr>
                    <div className="message-display" id='flex-container'>
                        {filteredMessages.map((message, index) => (
                            <div
                                key={index}
                                className={`message ${message.sender === sender ? 'sender-message' : 'receiver-message'}`}>
                                <strong>{message.sender === sender ? 'You' : selectedReceiverName.charAt(0).toUpperCase() + selectedReceiverName.slice(1)} : </strong>
                                {message.textmassage}
                                {message.text}
                            </div>
                        ))}
                    </div>

                    <div className="input-container">
                        <input type="text" className="form-control message-input"value={textmessage}onChange={(e) => setTextMessage(e.target.value)}
                            placeholder="Enter your message" /><button type="submit" onClick={sendMassage} className="btn btn-outline-primary send-button"> Send
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}


export default Chat;
