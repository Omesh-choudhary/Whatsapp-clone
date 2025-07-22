import { createSlice } from "@reduxjs/toolkit";
import localStorage from "redux-persist/es/storage";


 


const initialState = {
    LoginUser:undefined,
    ContactUsers:[],
    OnlineUsers:[],
    ChatUser:undefined,
    Messages:[],
    AddMessage:[],
    MessageSearch:false,
    filteredcontacts:undefined,
    VideoCall:undefined,
    VoiceCall:undefined,
    IncomingVideoCall:undefined,
    IncomingVoiceCall:undefined,
    EndCall:undefined
}


export const UserSlice = createSlice({
    name:"User",
    initialState,
    reducers:{
        SetLoginUser:(state,action)=>{
            state.LoginUser={
                id:action.payload.id,
                name:action.payload.name,
                email:action.payload.email,
                photo:action.payload.avatar
            }
        },

        SetAllUser:(state,action)=>{

            const user={
                id:action.payload,
                name:action.payload,
                email:action.payload,
                photo:action.payload
            }
            
            state.AllUser.push(user)
        },

        SetChatUser:(state,action)=>{
            state.ChatUser={
                id:action.payload.id,
                name:action.payload.name,
                email:action.payload.email,
                photo:action.payload.avatar || action.payload.photo
            }

           
        },
         SetMessages:(state,action)=>{
            
         state.Messages=action.payload
  
        },

        SetAddMessage:(state,action)=>{
            
            state.Messages.push(action.payload)
        
  
        },

        SetContactUsers:(state,action)=>{
            
            state.ContactUsers=action.payload
        
        },

        SetFiltersContacts:(state,action)=>{
            console.log(action.payload)
            console.log(state.ContactUsers)
        console.log(state.filteredcontacts)
        },
        
        SetOnlineUsers:(state,action)=>{
            
            state.OnlineUsers=action.payload
        
  
        },

        SetMessageSearch:(state,action)=>{
            state.MessageSearch=!state.MessageSearch
        },

        SetVideoCall:(state,action)=>{
          state.VideoCall=action.payload
          console.log(state.VideoCall)
        },
        SetVoicCall:(state,action)=>{
          state.VoiceCall=action.payload
        },
        SetIncomingVideoCall:(state,action)=>{
          state.IncomingVideoCall=action.payload
        },
        SetIncomingVoiceCall:(state,action)=>{
          state.IncomingVoiceCall=action.payload
        },
        SetEndCall:(state,action)=>{
          state.IncomingVideoCall=undefined,
          state.IncomingVoiceCall=undefined,
          state.VoiceCall=undefined,
          state.VideoCall=undefined
        }
    }
})


export const {SetAllUser,SetChatUser,SetLoginUser,SetSocket,SetMessages,SetAddMessage,SetMessageSearch,SetContactUsers,SetOnlineUsers,SetFiltersContacts,SetEndCall,SetIncomingVideoCall,SetIncomingVoiceCall,SetVideoCall,SetVoicCall} = UserSlice.actions
export default UserSlice.reducer