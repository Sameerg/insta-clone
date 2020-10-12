import React, { useState, useEffect } from "react";
import "./App.css";
import Post from "./Post";
import Header from "./Header";
import { db } from "./firebase";
import firebase from "firebase/app";

function App() {
  const [posts, setPosts] = useState([]);
  //  {   username: "Sameer",    caption: "Started learning React",  imageUrl: "https://www.andreasreiterer.at/wp-content/uploads/2017/11/react-logo-825x510.jpg.webp"  }]);
  const [username, setUsername] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((authUser) => {
      if (authUser) {
        //user logged in
        setUser(authUser);
        if (authUser.displayName) {
          // Don't update username
        } else {
          // Update user profile & set username
          return authUser.updateProfile({
            displayName: username,
          });
        }
      } else {
        // user logged out
        setUser(null);
      }
    });
    return () => {
      //cleanup
      unsubscribe();
    };
  }, [user, username]);

  // useEffect - Runs piece of code based on specific condition
  useEffect(() => {
    db.collection("posts")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        //every time a new post is added this code fires
        setPosts(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            post: doc.data(),
          }))
        );
      });
  }, []);

  return (
    <div className="app">
      <Header
        setUsername={setUsername}
        setUser={setUser}
        user={user}
        username={username}
      />
      {posts.map(
        ({ id, post }) =>
          post.imageUrl && (
            <Post
              key={id}
              postId={id}
              signedInUser={user}
              username={post.username}
              caption={post.caption}
              imageUrl={post.imageUrl}
              postUserId={post.userId}
              serverTime={post.timestamp}
              likes={post.likes}
              isCommentsDisabled={
                post.isCommentsDisabled === undefined
                  ? false
                  : post.isCommentsDisabled
              }
            />
          )
      )}
    </div>
  );
}

export default App;
