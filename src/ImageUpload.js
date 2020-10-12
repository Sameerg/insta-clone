import React, { useState } from "react";
import { Button } from "@material-ui/core";
import firebase from "firebase/app";
import { storage, db } from "./firebase";
import "./ImageUpload.css";
import uuid from "uuid";
import imageCompression from "browser-image-compression";

function ImageUpload({ user, onImageUpload }) {
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState(null);
  const [progres, setProgres] = useState(0);
  const [imageSrc, setImageSrc] = useState(null);

  const handleChange = (event) => {
    var file = event.target.files[0];
    if (file) {
      var reader = new FileReader();
      reader.onload = function (event) {
        setImageSrc(event.target.result);
      };
      reader.readAsDataURL(file);
      
      setImage(event.target.files[0]);
    }
  };

  const handleUpload = () => {
    //var imageFile = image;
    //console.log('originalFile instanceof Blob', image instanceof Blob); // true
    //console.log(`originalFile size ${image.size / 1024 / 1024} MB`);

    if (image.size > 200000) {
      // 200kb
      var options = {
        // maxSizeMB: .25,
        maxWidthOrHeight: 500,
        useWebWorker: true,
      };

      imageCompression(image, options)
        .then(function (compressedFile) {
          // console.log('compressedFile instanceof Blob', compressedFile instanceof Blob); // true
          //console.log(`compressedFile size ${compressedFile.size / 1024 / 1024} MB`); // smaller than maxSizeMB

          uploadToServer(compressedFile);
        })
        .catch(function (error) {
          console.log(error.message);
        });
    } else {
      uploadToServer(image);
    }
  };

  function uploadToServer(compressedFile) {
    let imageUuid = uuid.v4() + "." + image.name.split(".").pop();

    const uploadTask = storage.ref(`images/${imageUuid}`).put(compressedFile);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // progress function...
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgres(progress);
      },
      (error) => {
        console.log(error);
      },
      () => {
        //Upload Complete
        storage
          .ref("images")
          .child(imageUuid)
          .getDownloadURL()
          .then((url) => {
            // post image inside db

            db.collection("posts").add({
              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
              caption: caption,
              imageUrl: url,
              username: user.displayName,
              userId: user.uid,
            });
          });
        alert("Image Uploaded!");
        setProgres(0);
        setImage(null);
        setCaption("");
        setImageSrc(null);

        onImageUpload();
      }
    );
  }

  return (
    <div className="imageupload">
      <input
        className="imageupload__caption"
        type="text"
        placeholder="Enter a caption.."
        onBlur={(event) => setCaption(event.target.value)}
      />
      <input
        className="imageupload__file"
        type="file"
        onChange={handleChange}
        accept="image/*"
      ></input>
      {image ? (
        <progress className="imageupload__progress" value={progres} max="100" />
      ) : (
        ""
      )}
      {imageSrc && (
        <div className="imageupload__preview">
          <img className="imageupload__preview" src={imageSrc} alt="Preview" />
        </div>
      )}

      <Button disabled={!image} onClick={handleUpload}>
        Upload
      </Button>
    </div>
  );
}

export default ImageUpload;
