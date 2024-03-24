import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { signUp } from "../../api/user";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const { userLoggedIn } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (userLoggedIn) {
      navigate("/home");
    }
  }, [navigate, userLoggedIn]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
    role: "",
    showPassword: false,
  });

  const { name, email, mobile, role, password, confirmPassword, showPassword } =
    formData;

  const togglePasswordVisibility = () => {
    setFormData({ ...formData, showPassword: !showPassword });
  };

  const inputHandler = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (name.trim().length < 1 || !name.match(/^[a-zA-Z ]{2,30}$/)) {
      toast.error("Enter a valid name!");
      return;
    } else if (
      email.trim().length < 1 ||
      !email.match(/^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/)
    ) {
      toast.error("Enter a valid email!");
      return;
    } else if (mobile.trim().length < 1 || !mobile.match(/^[6-9]\d{9}$/)) {
      toast.error("Enter a valid mobile no!");
      return;
    } else if (role.trim().length < 1 || !role.match(/^[a-zA-Z ]{2,50}$/)) {
      toast.error("Enter a valid role! eg: Software Developer");
      return;
    } else if (
      password.trim().length < 5 ||
      !password.match(/^[a-zA-Z\d_@\-!#$%^&*()+=?<>{}[\]\\|~`';,.:/" ]{8,}$/)
    ) {
      toast.error("Enter a strong password! ie.[Aa.., 12.., @,%..]");
      return;
    } else if (confirmPassword !== password) {
      toast.error("Passwords does not match!");
      return;
    }
    const res = await signUp({ name, email, mobile, password, role });
    if (res) {
      toast.success(res?.data.message);
      navigate("/login");
    }
  };

  return (
    <div className="w-screen flex items-center justify-center">
      <div className="container max-w-md mx-auto xl:max-w-3xl flex bg-white rounded-lg  overflow-hidden bg-opacity-50">
        <div className="relative hidden xl:block xl:w-1/2 ">
          <img
            className="w-full object-cover pt-10"
            alt="image"
            src="/vite.svg"
          />
        </div>
        <div className="w-full xl:w-1/2 p-8  ">
          <form onSubmit={submitHandler}>
            <h1 className=" text-2xl font-bold">Create a new account</h1>
            <div className="mb-4 mt-4">
              <input
                className="text-sm appearance-none rounded w-full py-2 px-3 text-gray-700 bg-gray-200 leading-tight focus:outline-none focus:shadow-outline h-10"
                id="name"
                type="text"
                placeholder="Enter your full name"
                onChange={inputHandler}
              />
            </div>
            <div className="mb-4 mt-4">
              <input
                className="text-sm appearance-none rounded w-full py-2 px-3 text-gray-700 bg-gray-200 leading-tight focus:outline-none focus:shadow-outline h-10"
                id="email"
                type="text"
                placeholder="Enter your email address"
                onChange={inputHandler}
              />
            </div>
            <div className="mb-4 mt-4">
              <input
                className="text-sm appearance-none rounded w-full py-2 px-3 text-gray-700 bg-gray-200 leading-tight focus:outline-none focus:shadow-outline h-10"
                id="mobile"
                type="number"
                placeholder="Enter your mobile no."
                onChange={inputHandler}
              />
            </div>
            <div className="mb-4 mt-4">
              <input
                className="text-sm appearance-none rounded w-full py-2 px-3 text-gray-700 bg-gray-200 leading-tight focus:outline-none focus:shadow-outline h-10"
                id="role"
                type="text"
                placeholder="What is your role? eg: Software Developer"
                onChange={inputHandler}
              />
            </div>
            <div className="mb-4 mt-4 relative">
              <input
                className="text-sm appearance-none rounded w-full py-2 px-3 text-gray-700 bg-gray-200 leading-tight focus:outline-none focus:shadow-outline h-10"
                id="password"
                type={showPassword ? "text" : "password"} // Toggle input type based on showPassword state
                placeholder="Enter your password"
                onChange={inputHandler}
              />
              {/* Toggle eye icon */}
              <span
                className="absolute inset-y-0 right-0 flex items-center pr-3 pb-6 cursor-pointer"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? (
                  <i className="bi bi-eye-slash"></i>
                ) : (
                  <i className="bi bi-eye"></i>
                )}
              </span>
              <span className="text-xs text-gray-900">
                Min length 5 characters
              </span>
            </div>
            <div className="mt-4 mb-4">
              <input
                className="text-sm bg-gray-200 appearance-none rounded w-full py-2 px-3 text-gray-700 mb-1 leading-tight focus:outline-none focus:shadow-outline h-10"
                id="confirmPassword"
                type="password"
                placeholder="Confirm password"
                onChange={inputHandler}
              />
            </div>
            <div className="flex w-full mt-8 mb-3">
              <button
                className="w-full bg-indigo-600 hover:bg-grey-900 text-white text-sm py-2 px-4 font-semibold rounded focus:outline-none focus:shadow-outline h-10"
                type="submit"
              >
                Sign up
              </button>
            </div>

            <div className="text-center m-2">
              <span className="text-indigo-600 text-sm">Already a member?</span>
              <button
                onClick={() => navigate("/login")}
                className="text-gray-700 text-sm ml-1 font-semibold"
              >
                Log in!
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
