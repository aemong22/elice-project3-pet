import { Grid, ButtonBase, InputBase, Button } from "@mui/material";
import { Container } from "@mui/system";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import IconButton from "@mui/material/IconButton";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CloseIcon from "@mui/icons-material/Close";

import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import PostingEditor from "./PostingEditor";
import CommentDetail from "./CommentData";
import PostAuthor from "./PostAuthor";

import * as Api from "../../api";

import {
    Left,
    Right,
    Title,
    Content,
    PostImg,
    PostTag,
    PostInfo,
    Comment,
    CommentWrite,
    Tag,
    Comments,
    EditButton,
} from "./PostStyle";

const Post = () => {
    const navigate = useNavigate();
    const user = useSelector((state) => state.auth.value);
    const params = useParams();
    const [post, setPost] = useState("");
    const [allComment, setAllComment] = useState(null);
    const [WriteComment, setWriteComment] = useState("");
    const [postEdit, setPostEdit] = useState(false);
    const [like, setLike] = useState([]);

    const fetchData = async () => {
        const res = await Api.get(`boards/${params.boardId}`);
        setPost(res.data);
        console.log("게시글 데이터", res.data);
    };

    useEffect(() => {
        fetchData();
        fetchCommentData();
    }, []);

    // 댓글 데이터 들고오기
    const fetchCommentData = async () => {
        await Api.get(`comments/${params.boardId}`).then((res) => {
            setAllComment(res.data);
        });
    };

    useEffect(() => {
        if (allComment != null && allComment?.length >= 6) {
            messagesEndRef?.current?.scrollIntoView({
                behavior: "smooth",
            });
        }
    }, [allComment]);

    const postDelete = () => {
        if (window.confirm("정말 삭제합니까?")) {
            Api.delete("boards", post.boardId);
            alert("삭제되었습니다.");
            navigate("/board");
        } else {
            alert("취소합니다.");
        }
    };

    const messagesEndRef = useRef(null);

    // 댓글 제출 post
    const submitComment = async (e) => {
        e.preventDefault();
        await Api.post("comments", {
            boardId: params.boardId,
            authorId: user.userId,
            content: WriteComment,
        })
            .then(() => {
                fetchCommentData();
                console.log("댓글 입력");
            })
            .then(setWriteComment(""));
    };

    // 좋아요 데이터 불러오기
    const fetchLikeData = async () => {
        try {
            await Api.get("likes").then((res) => {
                setLike(res.data.boardIdArray);
                console.log("여기", res.data);
            });
        } catch (err) {
            console.log(err);
        }
    };

    // 좋아요 클릭 핸들러
    const handleLikeClick = async () => {
        await Api.put("likes", {
            boardId: post.boardId,
        })
            .then(fetchLikeData)
            .then(fetchData);
    };

    useEffect(() => {
        fetchLikeData();
    }, []);

    return (
        <>
            {post && like && allComment && (
                <>
                    {user?.userId === post.author.userId && !postEdit && (
                        <>
                            <EditButton
                                style={{
                                    background: "#C2937E",
                                    marginLeft: "20px",
                                }}
                                onClick={() => setPostEdit(true)}
                            >
                                수정
                            </EditButton>
                            <EditButton
                                sx={{
                                    background: "#FE6C63",
                                }}
                                onClick={() => postDelete()}
                            >
                                삭제
                            </EditButton>
                        </>
                    )}

                    {!postEdit && (
                        <EditButton
                            style={{
                                background: "#C2937E",
                                float: "right",
                                marginRight: "20px",
                            }}
                            onClick={() => {
                                navigate("/board");
                            }}
                        >
                            뒤로가기
                        </EditButton>
                    )}
                    <Grid container>
                        {!postEdit ? (
                            <>
                                <Left
                                    item
                                    lg={7}
                                    md={7}
                                    sm={11}
                                    xs={12}
                                    style={{ margin: "10px auto" }}
                                >
                                    <PostAuthor
                                        post={post}
                                        setPostEdit={setPostEdit}
                                    />
                                    <Grid
                                        style={{
                                            display: "flex",
                                            minHeight: "550px",
                                            flexDirection: "column",
                                            justifyContent: "space-between",
                                            padding: "1% 3%",
                                        }}
                                    >
                                        <Grid>
                                            <Title>{post.title}</Title>
                                            {post?.imageUrl && (
                                                <PostImg>
                                                    <img
                                                        src={post.imageUrl}
                                                        alt="이미지 없음"
                                                        style={{
                                                            width: "100%",
                                                            borderRadius:
                                                                "10px",
                                                        }}
                                                    />
                                                </PostImg>
                                            )}
                                            <Content>{post.content}</Content>
                                        </Grid>
                                        <Grid>
                                            <PostTag>
                                                {post?.hashTagArray.map(
                                                    (tag) => (
                                                        <Tag key={tag}>
                                                            {tag}
                                                        </Tag>
                                                    )
                                                )}
                                            </PostTag>
                                        </Grid>
                                    </Grid>
                                </Left>
                                <Right
                                    item
                                    lg={4}
                                    md={4}
                                    sm={11}
                                    xs={12}
                                    style={{ margin: "10px auto" }}
                                >
                                    <PostInfo>
                                        <Grid>
                                            <IconButton
                                                onClick={() => {
                                                    handleLikeClick();
                                                }}
                                            >
                                                {like?.includes(
                                                    post.boardId
                                                ) ? (
                                                    <FavoriteIcon
                                                        sx={{
                                                            margin: "0 5px 0 0",
                                                        }}
                                                    />
                                                ) : (
                                                    <FavoriteBorderIcon
                                                        sx={{
                                                            margin: "0 5px 0 0",
                                                        }}
                                                    />
                                                )}
                                            </IconButton>
                                            {post.likeCount}
                                        </Grid>
                                    </PostInfo>
                                    <Comments>
                                        {allComment?.map((commentData, idx) => (
                                            <Comment key={idx}>
                                                <CommentDetail
                                                    commentData={commentData}
                                                    fetchCommentData={
                                                        fetchCommentData
                                                    }
                                                />
                                            </Comment>
                                        ))}
                                        <div ref={messagesEndRef} />
                                    </Comments>
                                    <form onSubmit={submitComment}>
                                        <CommentWrite>
                                            <InputBase
                                                variant="standard"
                                                placeholder="댓글을 입력해 주세요."
                                                sx={{ ml: 1, flex: 1 }}
                                                value={WriteComment}
                                                onChange={(e) => {
                                                    setWriteComment(
                                                        e.target.value
                                                    );
                                                }}
                                            />

                                            <Button
                                                type="submit"
                                                size="small"
                                                sx={{
                                                    color: "white",
                                                    backgroundColor: "#C2937E",
                                                    borderRadius: "10px",
                                                    fontSize: "16px",
                                                    cursor: "pointer",
                                                    width: "45px",
                                                }}
                                            >
                                                입력
                                            </Button>
                                        </CommentWrite>
                                    </form>
                                </Right>
                            </>
                        ) : (
                            <>
                                <PostingEditor
                                    post={post}
                                    setPostEdit={setPostEdit}
                                    fetchData={fetchData}
                                />
                            </>
                        )}
                    </Grid>
                </>
            )}
        </>
    );
};

export default Post;
