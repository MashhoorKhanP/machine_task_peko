import { useEffect, useState } from "react";
import BlogCard from "../../components/BlogCards";
import { useMutation } from "@tanstack/react-query";
import Loader from "../../components/common/Loader";
import { allBlogs } from "../../api/post";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import usePageTitle from "../../hooks/usePageTitle";
import FilterAndSort from "../../components/FilterAndSort";
import Pagination from "../../components/Pagination";

const Home = () => {
  const navigate = useNavigate();
  usePageTitle("All Blogs");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [blogs, setBlogs] = useState([]);
  const [filter, setFilter] = useState("");
  const [sorting, setSorting] = useState("latest");
  const { userLoggedIn } = useSelector((state) => state.auth);
  const pageLimit = 6;

  const { status: getAllPostStatus, mutate: allPostMutate } = useMutation({
    mutationFn: allBlogs,
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
      allPostMutate({
        page: currentPage,
        limit: pageLimit,
        category: filter,
        sorting,
      });
    };
    fetchBlogs();
  }, [currentPage, filter, sorting, allPostMutate]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const handleSortingChange = (event) => {
    setSorting(event.target.value);
  };

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
      <div className="bg-gray-300 min-h-screen flex flex-col justify-between">
        <div>
          <h2 className="text-3xl p-4 font-bold">Explore Blogs...</h2>
          {/* Fiter and Sort */}
          <FilterAndSort
            handleFilterChange={handleFilterChange}
            filterValue={filter}
            handleSortingChange={handleSortingChange}
            sortingValue={sorting}
          />

          {blogs?.length === 0 ? (
            <div className="flex flex-col w-screen h-screen items-center justify-center">
              <p className="text-2xl font-semibold text-gray-600 mb-4">
                Nothing to show yet! Add a blog
              </p>
              <img src="/vite.svg" alt="Empty Blog" className="h-48" />
            </div>
          ) : (
            <div className="p-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-4">
              {blogs?.map((blog) => (
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

        {/* Pagination */}
        <Pagination
          handlePageChange={handlePageChange}
          totalPages={totalPages}
          currentPage={currentPage}
        />
      </div>
      {getAllPostStatus === "pending" && <Loader />}
    </>
  );
};

export default Home;
