import { useAdmin } from "@/lib/AdminContext";
import { useState } from "react";
import styles from "@/styles/admin/Login.module.css";

import { toast } from "react-toastify";

export default function Login() {
    const [loginPassword, setLoginPassword] = useState("");

    const { setPassword } = useAdmin();

    const submit = () => {
        if (!loginPassword) {
            toast.error("Please enter a password");
            return;
        }
        setPassword(loginPassword);
    };

    return (
        <>
            <div className={styles.login}>
                <div>
                    <h1 className="display-6 mb-4">Login</h1>
                    <h6>Password</h6>
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        submit();
                    }}>
                        <input
                            type="password"
                            className="form-control mb-4"
                            placeholder="Type the password here"
                            onChange={(e) => setLoginPassword(e.target.value)}
                        />
                        <button className="btn btn-secondary" type="submit">
                            Login
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}
