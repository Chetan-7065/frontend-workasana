import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Login() {
  const [type, setType] = useState("password");
  const [icon, setIcon] = useState("bi bi-eye");
   const navigate = useNavigate()
   const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    if (value.trim() === "") {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
      return; 
    }
    
    let errorMessage = "";

    if (name === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (value && !emailRegex.test(value)) {
        errorMessage = "Invalid email format.";
      }
    }

    if (name === "password") {
      const hasUppercase = /[A-Z]/.test(value);
      const hasNumber = /[0-9]/.test(value);
      const hasSpecialChar = /[^A-Za-z0-9]/.test(value);

      if (value.length < 8) {
        errorMessage = "Must be at least 8 characters.";
      } else if (!hasUppercase) {
        errorMessage = "Requires at least one uppercase letter.";
      } else if (!hasNumber) {
        errorMessage = "Requires at least one number.";
      } else if (!hasSpecialChar) {
        errorMessage = "Requires at least one special character.";
      }
    }
    setErrors((prevErrors) => ({ ...prevErrors, [name]: errorMessage }));
  }


  async function handleLoginBtn(e) {
    e.preventDefault();
    if (errors.email || errors.password) {
    toast.error("Please fix the validation errors before submitting.");
    return;
  }

  if (!formData.email || !formData.password) {
    toast.error("Please fill out all required fields.");
    return;
  }
    try {
      const response = await axios.post(
        "https://backend-workasana-ruby.vercel.app/auth/login",
        formData,
      );
      console.log("Success: ",response.data);
      if(response.data){
        localStorage.setItem("token", response.data.token)
      }
      setFormData({
      email: "",
      password: "",
    });
    toast.success("Login Successfully")
    navigate("/")
    } catch (error) {
      console.dir(error)
      if (error.response) {
        console.log("Status:", error.response.status);
        console.log("Data:", error.response.data);
        if(error.response.status === 404){
          toast.error("Please create an account")
          navigate("/signup")
        }
      } else if (error.request) {
        console.log("Network error: Is the backend running?");
      } else {
        console.log("Setup error: ", error.message);
      }
    }
    
  }


  return (
    <div className="bg-light d-flex align-items-center justify-content-center min-vh-100 py-5">
      <div className="container">
        <div
          className="row justify-content-center g-4"
          style={{
            maxWidth: "900px",
            marginBlock: "0",
            marginInline: "auto",
          }}
        >
          <div className="col-12  text-center mb-1">
            {/* Purple color via inline style since Bootstrap doesn't have a default 'purple' class */}
            <h1 style={{ color: "#6f42c1" }} className="fw-bold">
              workasana
            </h1>
            <p className="text-dark fs-2 mb-1">Log in into your account</p>
            <p className="text-muted small">Please enter your details</p>
          </div>
          <div className="col-12 col-md-6">
            <div className="card shadow-sm p-4 h-100">
              <h2 className="text-center mb-4 text-secondary fw-bold">Login</h2>

              <form onSubmit={handleLoginBtn}>
                <div className="mb-3">
                  <label
                    htmlFor="signupEmail"
                    className="form-label fw-semibold text-muted"
                  >
                    Email address
                  </label>
                  <input
                    type="email"
                    name= "email"
                    value={ formData.email}
                    onChange={handleChange}
                    className="form-control"
                    id="signupEmail"
                    placeholder="Enter your email"
                    required
                  />
                  {errors.email && <div className="text-danger small mt-1">{errors.email}</div>}
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="signupPassword"
                    className="form-label fw-semibold text-muted"
                  >
                    Password
                  </label>

                  <div className="input-group">
                    <input
                      type={`${type}`}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="form-control"
                      id="signupPassword"
                      placeholder="Enter your password"
                      required
                    />
                    <button
                      className="btn border border-start-0 bg-white text-muted"
                      type="button"
                      id="togglePassword"
                      onClick={() => {
                        if (type === "password") {
                          setType("text");
                          setIcon("bi bi-eye-slash");
                        } else {
                          setType("password");
                          setIcon("bi bi-eye");
                        }
                      }}
                    >
                      <i id="signupEyeIcon" className={`${icon}`}></i>
                    </button>
                  </div>
                  {errors.password && <div className="text-danger small mt-1">{errors.password}</div>}
                </div>

                <button
                  type="submit"
                  className="btn btn-success w-100 py-2 fw-bold"
                >
                  Sign In
                </button>
                 <div className="text-center small mt-1">
                    <span className="text-muted">Don't have an account? </span>
                    <Link
                      to={"/signup"}
                      className="text-decoration-none fw-semibold"
                      style={{ color: "#6f42c1" }}
                    >
                      Sign up
                    </Link>
                  </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
