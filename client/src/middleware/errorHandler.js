import { toast } from "react-toastify";

const errorHandle = (error) => {
  if (error.response?.data) {
    const errorResponse = error.response.data;
    if (errorResponse.message) {
      toast.error(errorResponse.message);
    }
  } else {
    toast.error('An error occurred, please try again!');
    console.log(error.message);
  }
}

export default errorHandle;