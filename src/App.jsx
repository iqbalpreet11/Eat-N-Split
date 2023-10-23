import React, { useState } from 'react'


const initialFriends = [
  {
    id: 118836,
    name: "Sony",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -70,
  },
  {
    id: 933372,
    name: "Rajni",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Vinod",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];


const App = () => {
const[friends,setFriends]=useState(initialFriends)
const [showAdd,setShowAdd] = useState(false);
const[selectedFriend,setSelectedFriend]=useState(null)

function addHandleFriend(){
  setShowAdd(!showAdd)
}
  
function handleFriend(friend){
  setFriends((friends) => [...friends,friend])
  setShowAdd(false)
}

function handleSelection(friend){
   setSelectedFriend((curr)=> curr?.id === friend.id ? null :friend)
   setShowAdd(false)
}

function handleSplitBill(value){
  console.log(value);
   setFriends(friends => friends.map(friend => friend.id === selectedFriend.id ? {...friend, balance: friend.balance + value} : friend ))
   setSelectedFriend(null)
}
  return (
    <div className='app'>
    <div className='sidebar'>
      <FriendsList friends={friends} 
      selectedFriend={selectedFriend} 
      onSlection={handleSelection}/>

      {showAdd && <FormAddFriend onAddFriend={handleFriend} />}

      <Button onClick={addHandleFriend}>{showAdd ?"Close":"Add Friend"}</Button>
    </div>
    {selectedFriend && <FormSplitBill selectedFriend={selectedFriend}
     onSplitBill={handleSplitBill} 
      key={selectedFriend.id}
     />}
    </div>
  )
}

export default App

function FriendsList({friends,onSlection,selectedFriend}){


  return (<ul>
    {friends.map((friend)=> (
      <Friend friend={friend} key={friend.id} selectedFriend={selectedFriend} onSlection={onSlection}/>
      )
      )}

  </ul>)
}

function Friend({friend,onSlection,selectedFriend}){

  const isSelected = selectedFriend?.id === friend.id;

  return (<li className={isSelected ? "selected" : ""}>
  <img src={friend.image} alt={friend.name} />
    <h3>{friend.name}</h3>

    {friend.balance < 0 &&( <p className="red" >You owe {friend.name} ₹{Math.abs(friend.balance)} </p>)}

    {friend.balance > 0 &&( <p className="green" > {friend.name} owes you ₹{Math.abs(friend.balance)} </p>)}

    {friend.balance === 0 &&( <p>You and {friend.name} are even </p>)}

    <Button onClick={()=>onSlection(friend)}>{isSelected ? "Close" :"Select"} </Button>
  </li>)
}

function Button({children,onClick}){

  return <button className='button' onClick={onClick}>{children}</button>
}

function FormAddFriend({onAddFriend}){

  const [name,setName] = useState("");
  const [image,setImage] = useState("https://i.pravatar.cc/48");

  
function handleSubmit(e){
  e.preventDefault()

if(!name || !image) return;

  const id = crypto.randomUUID()
  const newFriend = {
    id: id,
    name,
    image:`${image}?=${id}`,
    balance: 0,
   
  }
  onAddFriend(newFriend);

  setName('');
  setImage("https://i.pravatar.cc/48")
}


  return ( <form className='form-add-friend' onSubmit={handleSubmit}>
 <label>🧑🏽‍🤝‍🧑🏻 Friend name</label>
 <input type='text' value={name} onChange={e =>setName( e.target.value)} />
 <label>🌅   Image URL</label>
 <input type='text' value={image} onChange={e =>setImage( e.target.value)} />

<Button >ADD</Button>

  </form>)
}

function FormSplitBill({selectedFriend,onSplitBill}){
 const [bill, setBill]= useState("")
 const [paidByUser, setPaidByUser]= useState("")
 const paidByFriend = bill ? bill - paidByUser : "";
 const [whoIsPaying, setWhoIsPaying]= useState("user")

 function handleSubmit(e){
  e.preventDefault();

  if(!bill || !paidByUser) return ;
  onSplitBill(whoIsPaying === "user" ? paidByFriend : -paidByUser) 
 }

  return<form className='form-split-bill' onSubmit={handleSubmit} >

   <h2>Split a bill with {selectedFriend.name}</h2>

   <label>💰 Bill value</label>
 <input type='text' value={bill} onChange={(e)=>setBill(Number(e.target.value))} />

 <label>🧍‍♂️ Your expense</label>
 <input type='text' value={paidByUser} onChange={(e)=>setPaidByUser(Number(e.target.value) > bill ? paidByUser :Number(e.target.value) )} />

 <label>🧑🏽‍🤝‍🧑🏻 {selectedFriend.name}'s expense</label>
 <input type='text' value={paidByFriend}  disabled/>

 <label>🤑 Who is paying</label>
 <select value={whoIsPaying} onChange={(e)=>setWhoIsPaying(e.target.value)}>
   <option value='user'>You</option>
   <option value='friend'>{selectedFriend.name}</option>
 </select>

<Button>ADD</Button>
  </form>
}