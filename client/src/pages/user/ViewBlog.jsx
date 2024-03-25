import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../../components/common/Loader";
import { useMutation } from "@tanstack/react-query";
import {
  addComment,
  addDislike,
  addLike,
  addReport,
  deleteComment,
  findBlog,
  undoDisLike,
  undoLike,
} from "../../api/post";
import { toast } from "react-toastify";
import usePageTitle from "../../hooks/usePageTitle";

const ViewBlog = () => {
  const navigate = useNavigate();
  const { postId } = useParams();
  const [blog, setBlog] = useState(null);
  const [user, setUser] = useState(null);
  const [hasLiked, setHasLiked] = useState(false);
  const [hasDisliked, setHasDisliked] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  usePageTitle(`${blog?.title} - ${blog?.category}`);
  const { status: getBlogStatus, mutate: getBlogMutate } = useMutation({
    mutationFn: findBlog,
    onSuccess: (response) => {
      if (response) {
        const data = response.data;
        setBlog(data);
        // Check if the user has already liked the blog
        if (user && data.likedBy.includes(user.id)) {
          setHasLiked(true);
        }
        // Check if the user has already disliked the blog
        if (user && data.dislikedBy.includes(user.id)) {
          setHasDisliked(true);
        }
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

  const handleUndoLike = async () => {
    const response = await undoLike(postId, user.id);
    setBlog(response.data.data);
    setHasLiked(false);
  };

  const handleLike = async () => {
    const response = await addLike(postId, user.id);
    setBlog(response.data.data);
    setHasLiked(true);
  };
  const handleUndoDislike = async () => {
    const response = await undoDisLike(postId, user.id);
    setBlog(response.data.data);
    setHasDisliked(false);
  };
  const handleDislike = async () => {
    const response = await addDislike(postId, user.id);
    setBlog(response.data.data);
    setHasDisliked(true);
  };

  const handleReport = async (e) => {
    e.preventDefault();
    if (reportReason.trim().length === 0) {
      toast.error("Please enter a reason!");
      return;
    }
    const data = {
      reason: reportReason,
    };
    const response = await addReport(user.id, user.name, postId, data);
    toast.success(response.data.message);
    setBlog(response.data.data);
    setShowReportModal(false);
    setReportReason("");
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (newComment.trim().length === 0) {
      toast.error("Please enter a comment!");
      return;
    }
    const data = {
      comment: newComment,
    };
    const response = await addComment(user.id, user.name, postId, data);
    setBlog(response.data.data);
    setComments([
      ...comments,
      { id: comments.length + 1, userId: user?.id, content: newComment },
    ]);

    setNewComment(""); // Clear the comment input field
  };

  const handleDeleteComment = async (commentId) => {
    const response = await deleteComment(commentId, postId);
    toast.success(response.data.message);
    setBlog(response.data.data);
    setComments(comments.filter((comment) => comment.commentId !== commentId));
  };

  const handleEditBlog = () => {
    navigate(`/edit-blog/${postId}`);
  };
  return (
    <>
      <div className="container mx-auto mt-4 p-4">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold">{blog?.title}</h1>
            <h1 className="text-xl text-gray-700 font-semibold">
              {blog?.category}
            </h1>
          </div>
          {blog?.userId === user?.id && (
            <div className="flex items-center">
              <button
                onClick={handleEditBlog}
                className="bg-black text-white font-semibold px-4 py-2 rounded-md"
              >
                <i className="bi bi-pencil-square pr-2"></i>Edit Blog
              </button>
            </div>
          )}
        </div>

        <div className="flex flex-wrap mb-4">
          <div className="w-full h-svh bg-gray-400 p-4 md:w-full md:pr-4 flex justify-center">
            <img
              src={blog?.image}
              alt="Blog Cover"
              className="max-w-full h-auto mb-4 object-cover"
            />
          </div>
          <div className="w-full p-4 md:w-full lg:w-full lg:pl-4">
            <div className="flex justify-between">
              <div>
                <p>
                  Author:
                  <span className="font-semibold pl-1"> {blog?.uName}</span>
                </p>
                <p>
                  Job:<span className="font-semibold pl-1">{blog?.role}</span>{" "}
                </p>
                <p>
                  Date Posted:
                  <span className="font-semibold pl-1">
                    {blog?.createdAt
                      ? new Date(blog.createdAt).toDateString()
                      : ""}
                  </span>{" "}
                </p>
              </div>
              <div className=" justify-evenly mt-4 lg:mt-0">
                <button
                  disabled={hasDisliked}
                  onClick={hasLiked ? handleUndoLike : handleLike}
                  className={
                    hasLiked
                      ? "bg-blue-500 w-100 text-white px-4 py-2 mr-2 rounded-md"
                      : "border border-blue-500 text-blue-500 px-4 py-2 mr-2 rounded-md"
                  }
                >
                  <i className="bi bi-hand-thumbs-up"></i> Like
                </button>
                <span className="text-gray-500 pr-2">
                  {blog?.likes || 0} Likes
                </span>
                <button
                  disabled={hasLiked}
                  onClick={hasDisliked ? handleUndoDislike : handleDislike}
                  className={
                    hasDisliked
                      ? "bg-red-500 w-100 text-white px-4 py-2 mr-2 rounded-md"
                      : "border border-red-500 text-red-500 px-4 py-2 mr-2 rounded-md"
                  }
                >
                  <i className="bi bi-hand-thumbs-down"></i> Dislike
                </button>
                <span className="text-gray-500 pr-2">
                  {blog?.dislikes || 0} Dislikes
                </span>
                <button
                  className="bg-gray-500 w-100 text-white px-4 py-2 rounded-md"
                  onClick={() => setShowReportModal(true)}
                >
                  <i className="bi bi-flag"></i> Report
                </button>
                <span className="text-gray-500 pl-2 pr-2">
                  {blog?.reportings?.length || 0} Reports
                </span>
              </div>
            </div>
          </div>
        </div>
        <p className="text-lg p-4 font-semibold">{blog?.description}</p>

        {/* Comment Section */}
        <div className="mt-4 p-4">
          <h3 className="text-xl font-semibold pb-2">Comments</h3>
          <form onSubmit={handleCommentSubmit} className="mb-3">
            <input
              type="text"
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md mb-2"
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md"
            >
              Submit
            </button>
          </form>
          <div className="border-2 p-4">
            {!blog?.comments?.length && (
              <h2 className="text-lg font-bold text-gray-400">
                No comments to show, Add comment
              </h2>
            )}
            {blog?.comments.map((comment) => (
              <div
                key={comment.id}
                className={`mb-3 w-2/4 border-2 p-3 rounded-lg flex flex-col relative ${
                  comment.userId == user?.id
                    ? "bg-gray-300 ml-auto"
                    : "bg-gray-400"
                }`}
              >
                <div className="flex justify-between items-center mb-2">
                  <p className="font-semibold">
                    {comment.uName === user.name ? "Me" : comment.uName}
                  </p>
                  {comment.userId == user.id && (
                    <button
                      className="absolute right-2 top-2  text-red-500 font-semibold p-2"
                      onClick={() => handleDeleteComment(comment.commentId)}
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  )}
                </div>
                <p>{comment.comment}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Report Modal */}
        <div
          className={`fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 ${
            showReportModal ? "" : "hidden"
          }`}
        >
          <div className="flex justify-center items-center h-full">
            <div className="bg-white p-6 rounded-lg w-full md:w-1/2">
              <h2 className="text-xl mb-4">Report Blog</h2>
              <input
                type="text"
                placeholder="Enter reason"
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md mb-2"
              />
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-md mr-2"
                onClick={handleReport}
              >
                Submit Report
              </button>
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded-md"
                onClick={() => setShowReportModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
      {getBlogStatus === "pending" && <Loader />}
    </>
  );
};

export default ViewBlog;
