import  { useContext,useEffect,useState } from "react";
import assests from "../../assets/assets.js";
import { logout } from "../../config/firebase.js";
import { AppContext } from "../../context/AppContext.jsx";

import "./RightSidebar.css";
const RightSidebar = () => {
  const { userData, chatUser, messages, setMessages, messagesId } =
    useContext(AppContext);
    const[msgImages,setMsgImages]=useState([])
   useEffect(() => {
    let tempVar=[];
    messages.map((msg)=>{
      if(msg.image){
        tempVar.push(msg.image)
      }
    })
    setMsgImages(tempVar)
   }, [messages])

  return chatUser? (
    <div className="rs">
      <div className="rs-profile">
        <img src={chatUser.userData.avatar} alt="" />
        <h3>
         {Date.now()-chatUser.userData.lastSeen<=70000?<img src={assests.green_dot} className="dot" alt="" />:null}{chatUser.userData.name} 
        </h3>
        <p>{chatUser.userData.bio}</p>
      </div>
      <hr />
      <div className="rs-media">
        <p>Media</p>
        <div>
        {msgImages.map((url,ind)=>(
<img onClick={()=>{window.open(url)}} key={ind} src={url} alt="" />

        ))}
        </div>
      </div>
      <button onClick={() => logout()}>Logout</button>
    </div>
  ):( <div className="rs">
<button onClick={()=>logout()}>Logout</button>
  </div> )
};

export default RightSidebar;
