import { axiosInstance } from "@/app/lib/utils";
import { useAuth } from "@/components/auth-provider";
import FocusedPostCard from "@/components/cards/FocusedPostCard";
import useCustomSearchParams from "@/hooks/useSearchParams";
import { IPost } from "@/types";
import { useEffect, useState } from "react";

const GetFocusedPost = () => {
  const { searchParams, setSearchParams } = useCustomSearchParams();
  const [selectedPost, setSelectedPost] = useState<IPost | null>(null);
  const [isOpen, setIsOpen] = useState(true);
  const { token } = useAuth();
  useEffect(() => {
    const post = searchParams.get("focusedPost");
    if (post) {
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
  }, [token, searchParams, setSearchParams]);

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
