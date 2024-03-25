import { useEffect, useState } from "react";
import BlogCard from "./BlogCards";
import { useMutation } from "@tanstack/react-query";
import Loader from "../../components/common/Loader";
import { allBlogs } from "../../api/post";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import usePageTitle from "../../hooks/usePageTitle";

const Home = () => {
  const navigate = useNavigate();
  usePageTitle('All Blogs');
  const [blogs, setBlogs] = useState([]);
  const { userLoggedIn } = useSelector((state) => state.auth);

  const { status: getAllPostStatus, mutate: allPostMutate } = useMutation({
    mutationFn: allBlogs,
    onSuccess: (response) => {
      if (response) {
        const data = response.data;
        setBlogs(data);
      }
    },
  });

  useEffect(() => {
    if (!blogs.length) {
      allPostMutate();
    }
  }, [allPostMutate, blogs.length]);

  const handleOnClick = async (postId) => {
    if (userLoggedIn === null) {
      navigate("/login");
      toast.warning("Please login for this viewing blog!");
      return;
    }
    navigate(`/view-blog/${postId}`);
  };

  return (
    <>
      <div className="bg-gray-300">
        <h2 className="text-3xl p-4 font-bold">Explore Blogs...</h2>
        {blogs.length === 0 ? (
          <div className="flex flex-col w-screen h-screen items-center justify-center">
            <p className="text-2xl font-semibold text-gray-600 mb-4">
              Nothing to show yet! Add a blog
            </p>
            <img src="/vite.svg" alt="Empty Blog" className="h-48" />
          </div>
        ) : (
          <div className="p-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-4">
            {blogs.map((blog) => (
              <BlogCard
                key={blog.id}
                title={blog.title}
                category={blog.category}
                imageUrl={blog.image}
                handleClick={() => handleOnClick(blog.id)}
              />
            ))}
          </div>
        )}
      </div>
      {getAllPostStatus === "pending" && <Loader />}
    </>
  );
};

export default Home;
