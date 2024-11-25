import {
  arrayUnion,
  collection,
  doc, // `doc` should be imported from `firebase/firestore` not from your config
  getDocs,
  query,
  serverTimestamp,
  setDoc,getDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { useContext, useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import assests from "../../assets/assets.js"; // Fixed typo `assests` to `assets`
import { db, logout } from "../../config/firebase.js"; // `db` is correct as it's imported from your config
import { AppContext } from "../../context/AppContext.jsx";
import "./LeftSidebar.css";
const LeftSidebar = () => {
  const navigate = useNavigate();
  const { userData, chatData,chatUser,setChatUser,setMessagesId,messagesId,chatVisible,setChatVisible } = useContext(AppContext);
  const [user, setUser] = useState(null);
  const [showSearch, setShowSearch] = useState(false);
 
  const inputHandler = async (e) => {
    try {
      const input = e.target.value;
      if (input) {
        setShowSearch(true);
        const userRef = collection(db, "users");
        const q = query(userRef, where("username", "==", input.toLowerCase()));
        const querySnap = await getDocs(q);
        if (!querySnap.empty && querySnap.docs[0].data().id !== userData.id) {
          let userExist = false;
          chatData.map((user) => {
            if (user.rId === querySnap.docs[0].data().id) {
              userExist = true;
            }
          });
          if (!userExist) {
            setUser(querySnap.docs[0].data());
          }
        } else {
          setUser(null);
        }
      } else {
        setShowSearch(false);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const addChat = async () => {
    const messagesRef = collection(db, "messages");
    const chatRef = collection(db, "chats");
    try {
      const newMessageRef = doc(messagesRef);
      await setDoc(newMessageRef, {
        createAt: serverTimestamp(),
        messages: [],
      });

      await updateDoc(doc(chatRef, user.id), {
        chatsData: arrayUnion({
          messageId: newMessageRef.id,
          lastMessage: "",
          rId: userData.id,
          updatedAt: Date.now(),
          messageSeen: true,
        }),
      });
      await updateDoc(doc(chatRef, userData.id), {
        chatsData: arrayUnion({
          messageId: newMessageRef.id,
          lastMessage: "",
          rId: user.id,
          updatedAt: Date.now(),
          messageSeen: true,
        }),
      });

      const uSnap=await getDoc(doc(db,"users",user.id));
      const uData=uSnap.data()
      setChat({
        messagesId:newMessageRef.id,
        lastMessage:"",
        rId:user.id,
        updatedAt:Date.now(),
        messageSeen:true,
        userData:uData,
      })
        setShowSearch(false)
        setChatVisible(true)
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }
  };


   const setChat=async(item)=>{
   

      setMessagesId(item.messageId)
      setChatUser(item)
       
    setChatVisible(true)
       
   }

   useEffect(() => {
      const updateChatUserData=async()=>{
      if(chatUser)
      {
        const userRef=doc(db,"users",chatUser.id)
        const userSnap=await getDoc(userRef);
        const userData=userSnap.data();
        setChatUser(prev=>({...prev,userData:userData}))
       }
      }
      updateChatUserData()
   }, [chatData])
  return (
    <div className={`ls ${chatVisible?"hidden":""}`}>
      <div className="ls-top">
        <div className="ls-nav">
          <img src={assests.logo} className="logo" alt="" />
          <div className="menu">
            <img src={assests.menu_icon} alt="" />
            <div className="submenu">
              <p onClick={() => navigate("/profile")}>Edit Profile</p>
              <hr />
              <p onClick={()=>logout()}>Logout</p>
            </div>
          </div>
        </div>
      </div>
      <div className="ls-search">
        <img src={assests.search_icon} alt="" />
        <input
          onChange={inputHandler}
          type="text"
          placeholder="Search here"
          name=""
          id=""
        />
      </div>
      <div className="ls-list">
  {showSearch && user ? (
    <div onClick={addChat} className="friends add-user">
      <img src={user.avatar} alt="" />
      <p>{user.name}</p>
    </div>
  ) : (
    (chatData || []).map((item, ind) => (
      <div onClick={()=>setChat(item)} key={ind} className='friends'>
        <img src={item.userData.avatar} alt="" />
        <div>
          <p>{item.userData.name}</p>
          <span>{item.lastMessage}</span>
        </div>
      </div>
    ))
  )}
</div>
    </div>
  );
};

export default LeftSidebar;
