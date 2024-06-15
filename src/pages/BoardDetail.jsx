import axios from "axios";
import { useEffect, useState } from "react";
import "../styles/boardDetail.scss";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useLocation, useNavigate } from "react-router-dom";
import BoardDetailContent from "../components/BoardDetailContent";
import BoardCommentContent from "../components/BoardCommentContent";

const BoardDetail = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      alert("로그인 회원만 이용할 수 있습니다");
      navigate(`/login`);
    }
    // 페이지 로드 시 스크롤을 맨 위로 설정
    window.scrollTo(0, 0);
  }, [navigate]);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const boardId = queryParams.get("boardId");
  //   console.log(boardId);

  // state
  const [boardDetails, setBoardDetails] = useState();
  const [commentList, setCommentList] = useState([]);

  // get
  const getDetails = async () => {
    try {
      const storedToken = localStorage.getItem("token");
      const res = await axios.get(process.env.REACT_APP_API_SERVER + `/getBoardDetail/${boardId}`, {
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      });
      const result = await axios.get(
        process.env.REACT_APP_API_SERVER + `/getBoardComments/${boardId}`,
        {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        }
      );
      //   console.log(res.data);
      console.log(result.data);
      setBoardDetails(res.data);
      setCommentList(result.data);
    } catch (error) {
      console.error("게시글 정보를 불러오는 중 오류 발생:", error);
      alert("게시글 정보를 불러오는 중 오류가 발생했습니다.");
    }
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      getDetails();
    }
  }, []);

  return (
    <>
      <Header />
      <div className="BoardDetail">
        <div className="BoardDetailBox">
          {/* 중앙 정렬될 컨텐츠 */}
          <BoardDetailContent boardDetails={boardDetails} />
          <BoardCommentContent
            commentList={commentList}
            boardId={boardId}
            getDetails={getDetails}
          />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default BoardDetail;
