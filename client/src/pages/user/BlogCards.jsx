import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const BlogCard = ({
  title,
  imageUrl,
  category,
  handleClick,
  userId,
  updatedAt,
  blogId,
  handleDelete,
}) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const { userLoggedIn } = useSelector((state) => state.auth);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("userLoggedIn"));
    setUser(storedUser);
  }, [userLoggedIn]);

  return (
    <div className="relative bg-white w-100 rounded-lg overflow-hidden shadow-2xl">
      {/* Delete Button */}
      {userId && userId === user?.id && (
        <div className="flex justify-between">
          <button
            title="Delete Blog"
            onClick={handleDelete}
            className="absolute top-0 right-0 m-2 p-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <i className="bi bi-trash"></i>
          </button>
          <button
            title="Edit Blog"
            onClick={() => navigate(`/edit-blog/${blogId}`)}
            className="absolute top-0 right-10 m-2 p-2 bg-black text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <i className="bi bi-pencil"></i>
          </button>
        </div>
      )}

      {/* Blog Image */}
      <img
        className="w-full h-40 sm:h-60 object-cover"
        src={imageUrl}
        alt="Blog"
      />

      {/* Blog Content */}
      <div className="p-4 bg-gray-400">
        {/* Blog Title */}
        <h2 className="text-xl font-bold">{title}</h2>
        <p className="text-sm font-semibold text-gray-600 pb-2">{category}</p>
        {userId && (
          <p className="text-sm font-semibold text-gray-600 pb-2">
            <span className="pr-1">Last updated:</span>
            {updatedAt ? new Date(updatedAt).toDateString() : ""}
          </p>
        )}

        {/* View More Button */}
        <button
          onClick={handleClick}
          className="bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          View More
        </button>
      </div>
    </div>
  );
};

export default BlogCard;
