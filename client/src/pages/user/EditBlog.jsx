import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { findBlog, updateBlog } from "../../api/post";
import uploadFile from "../../firebase/upload";
import { useEffect, useState } from "react";
import Loader from "../../components/common/Loader";
import deleteFile from "../../firebase/deleteFile";
import { useMutation } from "@tanstack/react-query";
import usePageTitle from "../../hooks/usePageTitle";

const EditBlog = () => {
  const { postId } = useParams();
  usePageTitle('Edit Blog');
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(blog?.category);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(blog?.image);

  const { status: getBlogStatus, mutate: getBlogMutate } = useMutation({
    mutationFn: findBlog,
    onSuccess: (response) => {
      if (response) {
        const data = response.data;
        setBlog(data);
        setTitle(data.title);
        setDescription(data.description);
        setCategory(data.category);
        setImage(data.image);
        setImagePreview(data.image);
      }
    },
  });
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("userLoggedIn"));
    setUser(storedUser);
    if (!blog) {
      getBlogMutate(postId);
    }
  }, [blog, getBlogMutate, postId]);

  // Handle image upload
  const handleImageChange = async (e) => {
    const selectedImage = e.target.files[0];
    if (selectedImage) {
      // Check image size
      if (selectedImage.size <= 1048576) {
        // 1MB in bytes

        setImage(selectedImage);
        // Display image preview
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
        };
        reader.readAsDataURL(selectedImage);
      } else {
        toast.error("Image size should be less than 1MB.");
      }
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const titleRegex = /^[a-zA-Z\s]+$/;

    if (!titleRegex.test(title)) {
      toast.error("Title should contain only alphabets.");
      return;
    }

    if (description.length < 200) {
      toast.error("Description should be at least 200 characters long.");
      return;
    }
    if (!image) {
      toast.error("Select an image size < 1MB.");
    }
    if (image) {
      try {
        const timestamp = new Date().getTime();
        const randomString = Math.random().toString(36).substring(7);
        const uniqueId = timestamp + "_" + randomString;
        let url;
        if (blog?.image !== image) {
          const deleteImageName = blog?.image
            ?.split(`${user?.id}%2F`)[1]
            ?.split("?")[0];
          await deleteFile(`blog/${user?.id}/${deleteImageName}`);
          const imageName =
            "happlyBlogs_" + uniqueId + "." + image?.name?.split(".")?.pop();
          url = await uploadFile(image, `blog/${user?.id}/${imageName}`);
        }

        const data = {
          title,
          description,
          image: url,
          category,
          userId: user?.id,
        };

        const response = await updateBlog(postId, data);
        setBlog(response.data.data);
        toast.success(response.data.message);
        // Reset form fields
        setTitle(blog?.title);
        setDescription(blog?.description);
        setCategory(blog?.category);
        setImage(blog?.image);
        setImagePreview(blog?.image);
        navigate("/home");
      } catch (error) {
        toast.error(error.message);
        console.log(error);
      }
    }
  };

  // Sample categories
  const categories = ["Web Development", "Art", "Technology"];
  return (
    <>
      <div className="max-w-lg mx-auto mt-4 mb-4 p-6 bg-white rounded-lg shadow-2xl">
        <h2 className="text-2xl font-bold mb-4">Edit Blog</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              Title:
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 p-2 block w-full border-2 border-black rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Description:
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 p-2 block w-full h-96 border-2 border-black rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Category:
            </label>
            <div className="mt-1 flex space-x-4">
              {categories.map((cat) => (
                <div key={cat} className="flex items-center">
                  <input
                    id={cat}
                    type="radio"
                    value={cat}
                    checked={category === cat}
                    onChange={(e) => setCategory(e.target.value)}
                    className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-2 border-black"
                  />
                  <label htmlFor={cat} className="ml-2 text-sm text-gray-700">
                    {cat}
                  </label>
                </div>
              ))}
            </div>
          </div>
          <div className="mb-4">
            <label
              htmlFor="image"
              className="block text-sm font-medium text-gray-700"
            >
              Image:
            </label>
            <input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="mt-1 block w-full border-black rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                className="mt-2 rounded-md"
                style={{ maxWidth: "200px" }}
              />
            )}
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-indigo-500 text-white py-2 px-4 rounded-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
      {getBlogStatus === "pending" && <Loader />}
    </>
  );
};

export default EditBlog;
