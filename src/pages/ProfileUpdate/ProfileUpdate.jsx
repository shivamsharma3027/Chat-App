import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc,updateDoc } from "firebase/firestore";
import { useEffect, useState,useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import assests from "../../assets/assets.js";
import { auth, db } from "../../config/firebase.js";
import "./ProfileUpdate.css";
import upload from "../../lib/Upload.js";

import  {AppContext } from "../../context/AppContext.jsx";
const ProfileUpdate = () => {
  const [image, setImage] = useState(false);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [uid, setUid] = useState("");
  const [prevImage, setPrevImage] = useState("");
  const navigate = useNavigate();
  const {setUserData}=useContext(AppContext)
  const profileUpdate = async (event) => {
    event.preventDefault();
    try {
      if (!prevImage && !image) {
        toast.error("Upload profile picture ");
      }
      const docRef=doc(db,'users',uid)
      if(image)
      {
          const imageUrl=await upload(image);
          setPrevImage(imageUrl)
          await updateDoc(docRef,{
            avatar:imageUrl, 
            bio:bio,
            name:name,
          })
      }else{
        await updateDoc(docRef,{
         
          bio:bio,
          name:name,
        })
        const snap=await getDoc(docRef);
        setUserData(snap.data());
        navigate('/chat')
      }
    } catch (err) {
      console.log(err);
      toast.error(err.message);
    }
  };


  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUid(user.uid);
        const docRef =  doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.data().name) {
          setName(docSnap.data().name);
        }
        if (docSnap.data().bio) {
          setBio(docSnap.data().bio);
        }
        if (docSnap.data().avatar) {
          setPrevImage(docSnap.data().avatar);
        }
      } else {
        navigate("/");
        
      }
    });
  }, []);
  return (
    <div className="profile">
      <div className="profile-container">
        <form onSubmit={profileUpdate}>
          <h3>Profile Details</h3>
          <label htmlFor="avatar">
            <input
              onChange={(e) => setImage(e.target.files[0])}
              type="file"
              id="avatar"
              accept=".png .jpg .jpeg "
              hidden
            />
            <img
              src={image ? URL.createObjectURL(image) : assests.avatar_icon}
              alt=""
            /> upload profile image
          </label>
          <input
            onChange={(e) => setName(e.target.value)}
            value={name}
            type="text"
            placeholder="Your name"
            required
          />
          <textarea
            onChange={(e) => setBio(e.target.value)}
            value={bio}
            placeholder="Write profile bio"
            required
          ></textarea>
          <button type="submit">Save</button>
        </form>
        <img
          className="profile-pic"
          src={image ? URL.createObjectURL(image) : prevImage? prevImage:assests.logo_icon}
          alt=""
        />
      </div>
    </div>
  );
};

export default ProfileUpdate;