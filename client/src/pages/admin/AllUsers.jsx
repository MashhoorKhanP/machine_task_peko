import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { allUsers, unBlockBlockUser } from "../../api/admin";
import Loader from "../../components/common/Loader";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import usePageTitle from "../../hooks/usePageTitle";

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  usePageTitle("All Users");

  const { status: getAllUsersStatus, mutate: allUserMutate } = useMutation({
    mutationFn: allUsers,
    onSuccess: (response) => {
      if (response) {
        const data = response.data;
        setUsers(data);
      }
    },
  });

  const { status: unBlockBlockUserStatus, mutate: blockUnblockUserMutate } =
    useMutation({
      mutationFn: unBlockBlockUser,
      onSuccess: (response) => {
        if (response) {
          const data = response.data.data;
          if (data) {
            toast.success(response.data.message);
            setUsers((prevUsers) =>
              prevUsers.map((user) => {
                if (user.id === data?.id) {
                  return { ...user, isBlocked: data?.isBlocked };
                }
                return user;
              })
            );
          }
        }
      },
    });

  useEffect(() => {
    if (!users.length) {
      allUserMutate();
    }
  }, [allUserMutate, users.length]);

  const filteredUsers = users.filter((user) => {
    const userName = user.name.toLowerCase();
    const userEmail = user.email;
    const searchValue = search.toLowerCase();
    return userName.includes(searchValue), userEmail.includes(searchValue);
  });

  const handleBlockUnblockUser = async (userId, userName, action) => {
    Swal.fire({
      title: "Are you sure?",
      text: `Do you want to ${action} ${userName}?`,
      icon: "error",
      showCancelButton: true,
      confirmButtonText: "Yes, Block",
      cancelButtonText: "No, Go Back!",
      customClass: {
        container: "custom-swal-container",
      },
      width: 400,
      background: "#f0f0f0",
      iconHtml: '<i class="bi bi-x-lg" style="font-size:30px"></i>',
    }).then(async (result) => {
      if (result.isConfirmed) {
        blockUnblockUserMutate(userId);
      }
    });
  };

  return (
    <>
      <div className="w-screen h-screen p-5">
        <input
          className="border-2 w-1/4 p-2"
          type="text"
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <table className="border-collapse w-full mt-5 text-center overflow-scroll">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2">#</th>
              <th className="border border-gray-300 p-2">Image</th>
              <th className="border border-gray-300 p-2">Name</th>
              <th className="border border-gray-300 p-2">Email</th>
              <th className="border border-gray-300 p-2">Mobile</th>
              <th className="border border-gray-300 p-2">Reportings</th>
              <th className="border border-gray-300 p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users &&
              filteredUsers.map((user, index) => (
                <tr key={index} className="border border-gray-300">
                  <td className="border border-gray-300">{index + 1}</td>
                  <td className="border flex justify-center border-gray-300">
                    <div className="flex">
                      <img
                        src={user?.profileImage}
                        className="w-12 h-12 rounded-full"
                        alt={user?.name}
                      />
                    </div>
                  </td>
                  <td className="border border-gray-300">{user?.name}</td>
                  <td className="border border-gray-300">{user?.email}</td>
                  <td className="border border-gray-300">{user?.mobile}</td>
                  <td className="border border-gray-300">{user?.reports}</td>

                  <td className="border border-gray-300">
                    {user?.isBlocked ? (
                      <button
                        onClick={() =>
                          handleBlockUnblockUser(
                            user?.id,
                            user?.name,
                            "Unblock"
                          )
                        }
                        className="bg-green-500 text-white py-1 px-2 rounded-md ml-2"
                      >
                        Unblock
                      </button>
                    ) : (
                      <button
                        onClick={() =>
                          handleBlockUnblockUser(user?.id, user?.name, "Block")
                        }
                        className="bg-red-500 text-white py-1 px-2 rounded-md ml-2"
                      >
                        Block
                      </button>
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      {getAllUsersStatus === "pending" ||
        (unBlockBlockUserStatus === "pending" && <Loader />)}
    </>
  );
};

export default AllUsers;
