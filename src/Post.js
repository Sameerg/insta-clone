import React, { useState, useEffect } from "react";
import "./Styles/Post.css";
import Comments from "./Comments";
import Avatar from "@material-ui/core/Avatar";
import { db, storage } from "./firebase";
import firebase from "firebase/app";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";

function Post(props) {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [heartClass, setheartClass] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    let unsubscribe;
    if (props.postId) {
      unsubscribe = db
        .collection("posts")
        .doc(props.postId)
        .collection("comments")
        .orderBy("timestamp", "desc")
        .onSnapshot((snapshot) => {
          setComments(
            snapshot.docs.map((doc) => ({
              id: doc.id,
              data: doc.data(),
            }))
          );
        });
    }
    return () => {
      unsubscribe();
    };
  }, [props.postId]);

  const postComment = (e) => {
    e.preventDefault();
    if (!comment)
    alert("Comment can't be blank");
    db.collection("posts").doc(props.postId).collection("comments").add({
      text: comment,
      username: props.signedInUser.displayName,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      userId: props.signedInUser.uid,
    });
    setComment("");
  };

  function handleDeletePost(postId, imgUrl) {
    db.collection("posts")
      .doc(postId)
      .delete()
      .then(() => {
        console.log("Document successfully deleted!");

        let imgRef = storage.refFromURL(imgUrl);
        // delete image from storage
        imgRef
          .delete()
          .then(() => {
            console.log("Image successfully deleted!");
          })
          .catch((err) => console.log(err));
      })
      .catch((error) => {
        console.error("Error removing document: ", error);
      });
  }

  const handleLike = (signedInUser, postId) => {
    if (signedInUser) {
      setheartClass(true);
      db.collection("posts")
        .doc(postId)
        .update({ likes: firebase.firestore.FieldValue.increment(1) });
      setTimeout(function () {
        setheartClass(false);
      }, 1000);
    } else {
      alert("Please login to like a post!");
    }
  };

  const handleToggleComments = (postId, disableComments) => {
    db.collection("posts")
      .doc(postId)
      .update({ isCommentsDisabled: disableComments })
      .then(() => {
        alert(disableComments ? "Comments Disabled!" : "Comments Enabled!");
      })
      .catch((error) => {
        console.error("handleToggleComments: ", error);
      });

    handleClose();
  };

  return (
    <div className="post">
      <div className="post__header">
        <Avatar className="post__avatar">
          {props.username ? props.username[0] : "?"}
        </Avatar>
        <h3 className="post__username">{props.username}</h3>
        {props.postUserId === props.signedInUser?.uid ? (
          <div className="post__delete">
            <MoreHorizIcon onClick={handleClick} />
            <Menu
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem
                onClick={() => handleDeletePost(props.postId, props.imageUrl)}
              >
                Delete
              </MenuItem>
              <MenuItem
                onClick={() =>
                  handleToggleComments(props.postId, !props.isCommentsDisabled)
                }
              >
                {!props.isCommentsDisabled ? "Disable" : "Enable"} comments
              </MenuItem>
            </Menu>
          </div>
        ) : (
          ""
        )}
      </div>
      {/* image */}

      <div className="image-container">
        <img
          className="post__image"
          src={props.imageUrl}
          alt="Error processing"
          onDoubleClick={() => handleLike(props.signedInUser, props.postId)}
        />
        <div className={heartClass ? "instagram-heart" : ""}></div>
      </div>

      {props.likes && <h4 className="post__text">{props.likes} likes</h4>}

      <h4 className="post__text">
        <strong>{props.username}</strong> {props.caption}
      </h4>
      <Comments comments={comments} postUserId={props.postUserId} signedInUser={props.signedInUser} postId={props.postId} serverTime={props.serverTime}/>

      {props.signedInUser && !props.isCommentsDisabled ? (
        <form className="post__commentBox" onSubmit={postComment}>
          <input
            className="post__input"
            type="text"
            placeholder="Add a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button
            className="post__button"
            type="button"
            disabled={!comment}
            onClick={postComment}
          >
            Post
          </button>
        </form>
      ) : (
        ""
      )}
    </div>
  );
}

export default Post;
