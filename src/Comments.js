import React from "react";
import "./Comments.css";
import { db } from "./firebase";
import HighlightOffOutlinedIcon from "@material-ui/icons/HighlightOffOutlined";

function Comments(props) {
  function handleDeleteComment(postId, commentId) {
    db.collection("posts")
      .doc(postId)
      .collection("comments")
      .doc(commentId)
      .delete()
      .then(() => {
        console.log("Deleted");
      })
      .catch((err) => console.log(err));
  }

  function timeSince(timeStamp) {
    var now = new Date(),
      secondsPast = (now.getTime() - timeStamp.getTime()) / 1000;
    if (secondsPast < 0) {
      return "0 seconds ago";
    }
    if (secondsPast < 60) {
      return parseInt(secondsPast) + " seconds ago";
    }
    if (secondsPast < 3600) {
      return parseInt(secondsPast / 60) + " mins ago";
    }
    if (secondsPast <= 86400) {
      return parseInt(secondsPast / 3600) + " hours ago";
    }
    if (secondsPast > 86400) {
      let day = timeStamp.getDate();
      let month = timeStamp
        .toDateString()
        .match(/ [a-zA-Z]*/)[0]
        .replace(" ", "");
      let year =
        timeStamp.getFullYear() === now.getFullYear()
          ? ""
          : " " + timeStamp.getFullYear();
      return day + " " + month + year;
    }
  }

  return (
    <div>
      {props.comments.map(({ id, data }) => (
        <div className="post__comments" key={id}>
          <span className="post__comments__username">{data.username}</span>{" "}
          <span className="post__comments__text">{data.text}</span>
          {props.postUserId === props.signedInUser?.uid ||
          data.userId === props.signedInUser?.uid ? (
            <HighlightOffOutlinedIcon
              className="post__comment__delete"
              onClick={() => handleDeleteComment(props.postId, id)}
            />
          ) : (
            ""
          )}
        </div>
      ))}
      <div className="post__timestamp">
        {timeSince(new Date(props.serverTime?.seconds * 1000))}
      </div>
    </div>
  );
}

export default Comments;
