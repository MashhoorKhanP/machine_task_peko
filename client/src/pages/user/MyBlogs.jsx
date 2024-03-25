import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { deleteMyBlog, myBlogs } from "../../api/post";
import BlogCard from "../../components/BlogCards";
import Loader from "../../components/common/Loader";
import { toast } from "react-toastify";
import deleteFile from "../../firebase/deleteFile";
import Swal from "sweetalert2";
import usePageTitle from "../../hooks/usePageTitle";
import FilterAndSort from "../../components/FilterAndSort";
import Pagination from "../../components/Pagination";

const MyBlogs = () => {
  const navigate = useNavigate();
  usePageTitle("My Blogs");
  const { userId } = useParams();
  const [blogs, setBlogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [filter, setFilter] = useState("");
  const [sorting, setSorting] = useState("latest");
  const pageLimit = 6;

  const { status: getMyBlogsStatus, mutate: myBlogsMutate } = useMutation({
    mutationFn: myBlogs,
    onSuccess: (response) => {
      if (response) {
        const { data, totalPosts } = response.data;
        setBlogs(data);
        setTotalPages(Math.ceil(totalPosts / pageLimit));
      }
    },
  });

  useEffect(() => {
    const fetchBlogs = () => {
      myBlogsMutate({
        userId,
        page: currentPage,
        limit: pageLimit,
        category: filter,
        sorting,
      });
    };
    fetchBlogs();
  }, [currentPage, filter, sorting, myBlogsMutate, userId]);

  const handleOnClick = async (postId) => {
    navigate(`/view-blog/${postId}`);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const handleSortingChange = (event) => {
    setSorting(event.target.value);
  };

  const handleDelete = async (blogId, image) => {
    Swal.fire({
      title: "Are you sure?",
      text: `Do you want to delete blog?`,
      icon: "error",
      showCancelButton: true,
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "No, Go Back!",
      customClass: {
        container: "custom-swal-container",
      },
      width: 400,
      background: "#f0f0f0",
      iconHtml: '<i class="bi bi-x-lg" style="font-size:30px"></i>',
    }).then(async (result) => {
      if (result.isConfirmed) {
        if (image) {
          const deleteImageName = image
            ?.split(`${userId}%2F`)[1]
            ?.split("?")[0];
          await deleteFile(`blog/${userId}/${deleteImageName}`);
        }
        const response = await deleteMyBlog(blogId);
        myBlogsMutate({
          userId,
          page: currentPage,
          limit: pageLimit,
          category: filter,
          sorting,
        });
        toast.success(response.data.messsage);
      }
    });
  };

  return (
    <>
      <div className="bg-gray-300">
        <h2 className="text-3xl p-4 font-bold">My Blogs</h2>
        <FilterAndSort
          handleFilterChange={handleFilterChange}
          filterValue={filter}
          handleSortingChange={handleSortingChange}
          sortingValue={sorting}
        />
        {blogs?.length === 0 ? (
          <div className="flex flex-col w-screen h-screen items-center justify-center">
            <p className="text-2xl font-semibold text-gray-600 mb-4">
              Not posted any blogs yet!
            </p>
            <img src="/vite.svg" alt="Empty Blog" className="h-48" />
          </div>
        ) : (
          <div className="p-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-4">
            {blogs?.map((blog) => (
              <BlogCard
                key={blog?.id}
                title={blog?.title}
                category={blog?.category}
                imageUrl={blog?.image}
                blogId={blog?.id}
                updatedAt={blog?.updatedAt}
                userId={blog?.userId}
                handleClick={() => handleOnClick(blog?.id)}
                handleDelete={() => handleDelete(blog?.id, blog?.image)}
              />
            ))}
          </div>
        )}
        {/* Pagination */}
        <Pagination
          handlePageChange={handlePageChange}
          totalPages={totalPages}
          currentPage={currentPage}
        />
      </div>
      {getMyBlogsStatus === "pending" && <Loader />}
    </>
  );
};

export default MyBlogs;
