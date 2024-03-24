import { Fragment, useEffect, useState } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { setLoggedOut } from "../../store/slices/authSlice";
import { useNavigate } from "react-router-dom";
import { logout } from "../../api/user";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { adminLogout } from "../../api/admin";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const Navbar = ({ role }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [user, setUser] = useState(null);
  const { userLoggedIn } = useSelector((state) => state.auth);

  useEffect(() => {
    if (role === "admin" && userLoggedIn === null) {
      navigate("/admin/login");
    }
    if (role === "user" && userLoggedIn === null) {
      navigate("/login");
    }
    const storedUser = JSON.parse(localStorage.getItem("userLoggedIn"));
    setUser(storedUser);
  }, [userLoggedIn, navigate, role]);

  const handleAddBlog = () => {
    if (userLoggedIn === null) {
      navigate("/login");
    } else {
      navigate(`/add-blog/${user.id}`);
    }
  };

  const handleMyBlogs = () => {
    navigate(`/my-blog/${user.id}`);
  };

  const logoutHandler = async () => {
    if (role === "user") {
      const response = await logout();
      if (response) {
        toast.success(response.data.message);
        dispatch(setLoggedOut());
        navigate("/login");
      }
    }
    if (role === "admin") {
      const response = await adminLogout();
      if (response) {
        toast.success(response.data.message);
        dispatch(setLoggedOut());
        navigate("/admin/login");
      }
    }
  };
  return (
    <Disclosure as="nav" className="bg-gray-800">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {/* Mobile menu button*/}
                <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="absolute -inset-0.5" />
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                <div className="flex flex-shrink-0 items-center">
                  <img
                    className="h-8 w-auto"
                    src="/vite.svg"
                    alt="Your Company"
                  />
                </div>
                <div className="hidden sm:ml-6 sm:block">
                  <div className="flex space-x-4">
                    {role === "user" && (
                      <>
                        <button
                          onClick={() => navigate("/home")}
                          className={classNames(
                            "bg-gray-900 text-white hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
                          )}
                        >
                          All Blogs
                        </button>
                        <button
                          onClick={handleAddBlog}
                          className={classNames(
                            "bg-gray-900 text-white hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
                          )}
                        >
                          Add Blog
                        </button>
                        {userLoggedIn !== null && (
                          <button
                            onClick={handleMyBlogs}
                            className={classNames(
                              "bg-gray-900 text-white hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
                            )}
                          >
                            My Blogs
                          </button>
                        )}
                      </>
                    )}
                    {role === "admin" && (
                      <>
                        <button
                          onClick={() => navigate("/admin/dashboard")}
                          className={classNames(
                            "bg-gray-900 text-white hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
                          )}
                        >
                          Dashboard
                        </button>
                        <button
                          onClick={() => navigate("/admin/all-users")}
                          className={classNames(
                            "bg-gray-900 text-white hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
                          )}
                        >
                          Users
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
              {userLoggedIn ? (
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                  <button
                    type="button"
                    className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                  >
                    <span className="absolute -inset-1.5" />
                    <span className="sr-only">View notifications</span>
                    <BellIcon className="h-6 w-6" aria-hidden="true" />
                  </button>

                  {/* Profile dropdown */}
                  <Menu as="div" className="relative ml-3">
                    <div>
                      <Menu.Button className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                        <span className="absolute -inset-1.5" />
                        <span className="sr-only">Open user menu</span>
                        <img
                          className="h-8 w-8 rounded-full"
                          src={user?.profileImage}
                          alt={user?.name}
                        />
                      </Menu.Button>
                    </div>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute right-0 z-10 mt-2 w-auto origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <Menu.Item>
                          <div className="px-4 py-3">
                            <p className="text-sm text-gray-900 dark:text-black">
                              {user?.name}
                            </p>
                            <p className="text-sm font-medium text-gray-900 truncate dark:text-gray-500">
                              {user?.email}
                            </p>
                          </div>
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <a
                              href="#"
                              className={classNames(
                                active ? "bg-gray-100" : "",
                                "block px-4 py-2 text-sm text-gray-700"
                              )}
                            >
                              Your Profile
                            </a>
                          )}
                        </Menu.Item>

                        <Menu.Item>
                          <button
                            onClick={logoutHandler}
                            className="block px-4 py-2 text-sm text-gray-800  dark:text-gray-500 dark:hover:text-red-500"
                            role="menuitem"
                          >
                            Sign out
                          </button>
                        </Menu.Item>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </div>
              ) : (
                <Disclosure.Button
                  onClick={() =>
                    role === "user"
                      ? navigate("/login")
                        ? role === "admin"
                        : navigate("/admin/login")
                      : navigate("/login")
                  }
                  className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                >
                  Login
                </Disclosure.Button>
              )}
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2">
              <Disclosure.Button
                onClick={() => navigate("/home")}
                className={classNames(
                  "text-gray-300 hover:bg-gray-700 hover:text-white",
                  "rounded-md px-3 py-2 text-sm font-medium"
                )}
              >
                All Blogs
              </Disclosure.Button>
              <Disclosure.Button
                onClick={handleAddBlog}
                className={classNames(
                  "text-gray-300 hover:bg-gray-700 hover:text-white",
                  "rounded-md px-3 py-2 text-sm font-medium"
                )}
              >
                Add Blog
              </Disclosure.Button>
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};

export default Navbar;
