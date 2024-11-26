import { createClientAxiosInstance } from "@/app/lib/utils";
import FocusedPostCard from "@/components/cards/FocusedPostCard";
import useCustomSearchParams from "@/hooks/useSearchParams";
import { IPost } from "@/types";
import { getCookie } from "cookies-next";
import { useEffect, useState } from "react";

const GetFocusedPost = () => {
  const { searchParams, setSearchParams } = useCustomSearchParams();
  const [selectedPost, setSelectedPost] = useState<IPost | null>(null);
  const [isOpen, setIsOpen] = useState(true);
  const token = getCookie("token");
  useEffect(() => {
    const post = searchParams.get("focusedPost");
    if (post) {
      const axiosInstance = createClientAxiosInstance();
      axiosInstance
        .get(`/posts/${post}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          setSelectedPost(res.data.data);
          setSearchParams({
            focusedPost: "",
          });
        })
        .catch((err) => {
          console.log(err);
          setSearchParams({
            focusedPost: "",
          });
        });
    }
  }, []);

  return (
    <>
      {selectedPost && (
        <FocusedPostCard
          post={selectedPost}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
        />
      )}
    </>
  );
};

export default GetFocusedPost;
