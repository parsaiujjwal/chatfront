import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './signup.css'


const Signup = () => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [thumbnailFile, setthumbnail] = useState(null);
    const navigate = useNavigate();

    const handleFileChange1 = (event) => {
        setthumbnail(event.target.files[0]);
    };

    function validateForm() {
        if (firstName.length == 0) {
            toast.error('first name is requrid', {
                position: toast.POSITION.TOP_CENTER
            })
            return false;
        }

        if (lastName.length == 0) {
            toast.error("lastname requried", {
                position: toast.POSITION.TOP_CENTER
            })
            return false;
        }
        if (email.length == 0) {
            toast.error("email requried", {
                position: toast.POSITION.TOP_CENTER
            })
            return false;
        }
        if (password.length < 8) {
            toast.error(
                'Invalid Form, Password must contain greater than or equal to 8 characters.', {
                position: toast.POSITION.TOP_CENTER
            }
            )
            return false;
        }
        let countUpperCase = 0
        let countLowerCase = 0
        let countDigit = 0
        let countSpecialCharacters = 0
        for (let i = 0; i < password.length; i++) {
            const specialChars = ['!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '_', '-', '+', '=', '[', '{', ']', '}', ':', ';', '<', '>']

            if (specialChars.includes(password[i])) {
                countSpecialCharacters++
            } else if (!isNaN(password[i] * 1)) {
                countDigit++
            } else {
                if (password[i] == password[i].toUpperCase()) {
                    countUpperCase++
                }
                if (password[i] == password[i].toLowerCase()) {
                    countLowerCase++
                }
            }
        }
        if (countLowerCase == 0) {
            toast.error('Invalid Form, 0 lower case or a upper case characters in password', {
                position: toast.POSITION.TOP_CENTER
            })
            return false
        }
        if (countUpperCase == 0) {
            toast.error("atleast 1 uppercase is require", {
                position: toast.POSITION.TOP_CENTER
            });
            return false
        }
        if (countDigit == 0 || countSpecialCharacters == 0) {
            toast.error('Invalid Form, 0 digit characters and special characters in password', {
                position: toast.POSITION.TOP_CENTER
            })
            return false
        }
        if (countSpecialCharacters == 0) {
            toast.error('atlest 1 special Character require', {
                position: toast.POSITION.TOP_CENTER
            })
            return false
        }
        return true;
    }

    const handleUpload = async (event) => {
        try {
            if (!validateForm()) {
                return;
            }
            event.preventDefault();

            const formData = new FormData();
            formData.append('file', thumbnailFile);
            formData.append('firstName', firstName);
            formData.append('lastName', lastName);
            formData.append('email', email);
            formData.append('password', password);
            console.log(formData)
            const response = await axios.post("http://localhost:3000/user/signup",formData)
            if (response.data.status) {
                toast.success('Success Notification !', {
                    position: toast.POSITION.TOP_CENTER
                });
                navigate("/signin");
            }
        } catch (err) {
            console.log(err);
        }
    }
    return (
        <div> <from>
                <div className="container  d-flex justify-content-center align-items-center vh-100">
                    <div className="card p-4">
                        <h2 className="mb-4 text-center">Sign Up</h2>           
                            <div className="row mb-3">
                                <div className="col-md-4">
                                    <label htmlFor="firstName" className="form-label">First Name:</label>
                                    <input type="text" className="form-control" id="firstName" placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                                </div>
                                <div className="col-md-4">
                                    <label htmlFor="lastName" className="form-label">Last Name:</label>
                                    <input type="text" className="form-control" id="lastName" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                                </div>
                                <div className="col-md-4">
                                    <label htmlFor="email" className="form-label">Email:</label>
                                    <input type="email" className="form-control" id="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                                </div>
                            </div>
                            <div className="row mb-3">
                                <div className="col-md-4">
                                    <label htmlFor="password" className="form-label">Password:</label>
                                    <input type="password" className="form-control" id="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                                </div>
                                <div className="col-md-4">
                                    <label htmlFor="file" className="form-label">profile pic:</label>
                                    <input type="file" name="thumbnail" className="form-control img" filename={thumbnailFile}
                                        onChange={handleFileChange1} placeholder="click hear" />
                                </div>
                            </div>
                            <button type="submit" onClick={handleUpload}  encType="multipart/form-data"className="btn btn-primary lastbtn">Sign Up</button>
                        
                        <p className="mt-3 text-center">
                            Already have an account? <Link to="/signin">Sign in</Link>
                        </p>
                    </div>
                </div>
                </from>
            <ToastContainer />
        </div>

    );
};

export default Signup;