import axios from "axios";
import { useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import { Link, useNavigate } from "react-router-dom";

function SignIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    function validateForm() {

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
    const handleFormSubmit = async (event) => {
        event.preventDefault();
        if (!validateForm()) {
            return;
        }
        try {
            const response = await axios.post("http://localhost:3000/user/signIn", { email: email, password: password });
            if (response.data.status) {
                localStorage.setItem("user", JSON.stringify(response.data.user));
                localStorage.setItem("token", JSON.stringify(response.data.token));
                alert("Sign in done");
                toast.success('Success Notification !', {
                    position: toast.POSITION.TOP_CENTER
                });
                navigate("/chat");
            }
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <div>
            <div className="container d-flex justify-content-center align-items-center vh-100">
                <div className="card p-4">
                    <h2 className="mb-4 text-center">Sign In</h2>
                    <form onSubmit={handleFormSubmit}>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email:</label>
                            <input type="email" className="form-control" onChange={(event) => setEmail(event.target.value)} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">Password:</label>
                            <input type="password" className="form-control" onChange={(event) => setPassword(event.target.value)} />
                        </div>
                        <button type="submit" className="btn btn-primary">Login</button>
                    </form>

                </div>
            </div>
            <ToastContainer />
        </div>
    );
}
export default SignIn;