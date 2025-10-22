import React from 'react';
import { Code2, Database, Globe, Server, Wrench, Bot, ShieldCheck, Layers } from 'lucide-react';
import { useUserStore } from '../store/user/userStore';
import { useState, useEffect } from "react";
import axios from "axios";

interface Room {
    id: number;
    roomName: string;
    createdAt: string;
}
  
const AIService: React.FC = () => {
    const { isLoggedIn, user} = useUserStore();

    const [rooms, setRooms] = useState<Room[]>([]);
    const [activeRoomId, setActiveRoomId] = useState<number | null>(null);
    const [messages, setMessages] = useState<{ sender: "user" | "ai"; text: string }[]>([]);
    const [input, setInput] = useState("");

    const handleCreateRoom = () => {
        axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/chat/room`, {}, {
            headers: { Authorization: `Bearer ${user?.accessToken}` }
        })
        .then(res => {
            const newRoom = {
                id: res.data.roomId,
                roomName: res.data.roomName,
                createdAt: res.data.createdAt
            };

            setRooms(prev => [...prev, newRoom]);
            setActiveRoomId(newRoom.id);
        })
        .catch(err => console.error("채팅방 생성 실패 : ", err));
      };
      
    useEffect(() => {
        if(isLoggedIn && user?.accessToken) {
            axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/chat/rooms`, {
                headers: {
                    Authorization: `Bearer ${user.accessToken}`,
                  },            
            })
                .then(res => {
                    const mapped: Room[] = res.data.map((r:any) => ({
                        id: r.roomId,
                        roomName: r.roomName,
                        craetedAt: r.craetedAt,
                    }));
                    setRooms(mapped);
                })
                .catch(err => console.error("채팅방 목록 불러오기 실패: ", err));
        }
    }, [isLoggedIn, user?.accessToken]);

    const handleSend = () => {
      if (!input.trim()) return;
  
      // 사용자 메시지 추가
      setMessages((prev) => [...prev, { sender: "user", text: input }]);
  
      // AI 응답 (임시)
      setTimeout(() => {
        setMessages((prev) => [...prev, { sender: "ai", text: "AI 응답 예시: " + input }]);
      }, 500);
  
      setInput("");
    };
  

    
    return (
        <section id="AIService" className="py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16 fade-in-up">
                    <h2 className="text-3xl sm:text-4xl font-bold text-github-text mb-4">
                     안녕하세요, {!isLoggedIn ?
                                 (
                                    <span className="text-github-accent">
                                        방문자님
                                    </span> 
                                  ) : (
                                    <span className="text-github-accent">
                                        {user?.username} 님
                                    </span>
                                  )}
                    </h2> 
                    {!isLoggedIn ? (
                        <p className="text-lg text-github-text-secondary max-w-2xl mx-auto">
                            로그인이 필요한 서비스입니다.  
                        </p>     
                    ) : (
                        <p className="text-lg text-github-text-secondary max-w-2xl mx-auto">
                            오늘은 무엇을 도와드릴까요?  
                        </p>   
                    )}             
                </div>
{/* 
                <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
                    <div className="fade-in-left">
                        <div className="relative">
                            <div className="w-full h-80 bg-gradient-to-br from-github-accent/10 to-github-purple/10 rounded-2xl flex items-center justify-center">
                                <div className="text-center">
                                   
                                    <p className="text-github-text-secondary">
                                    </p>
                                </div>                       
                            </div>
                            <div className="absolute -top-4 -right-4 w-24 h-24 bg-github-accent/10 rounded-full flex items-center justify-center animate-pulse">
                                <Layers className="w-8 h-8 text-github-accent" />
                            </div>         
                        </div>
                    </div>

                    <div className="fade-in-right">
                                <h3 className="text-2xl font-bold text-github-text mb-6">
                                    
                                </h3>
                            <div className="space-y-4 text-github-text-secondary">
                            <p>
                            어떤 내용 추가해보기 
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-3 sm:gap-4 mt-8">
                            <div className="text-center p-3 sm:p-4 bg-github-surface rounded-lg">
                                <div className="text-xl sm:text-2xl font-bold text-github-accent">빈공간</div>
                                <div className="text-xs sm:text-sm text-github-text-secondary">빈공간</div>
                            </div>
                        </div>
                    </div>
                </div> */}

        <div className="flex h-[500px] bg-github-surface rounded-xl shadow-lg overflow-hidden">
          {/* 채팅방 목록 */}
          <div className="w-64 border-r border-github-border bg-github-dark flex flex-col">
            <div className="p-4 font-bold text-github-accent">채팅방 목록</div>
            <div className="flex-1 overflow-y-auto">
              {rooms.map(room => (
                <div
                  key={room.id}
                  onClick={() => setActiveRoomId(room.id)}
                  className={`p-3 cursor-pointer hover:bg-github-surface ${
                    activeRoomId === room.id ? "bg-github-surface" : ""
                  }`}
                >
                  <div className="font-semibold text-github-text">{room.roomName}</div>
                  <div className="text-xs text-github-text-secondary truncate">
                    {room.createdAt}
                  </div>
                </div>
              ))}
            </div>

            {/* 새 방 추가 UI */}
            <div className="p-3 border-t border-github-border flex space-x-2">

            </div>
          </div>

          {/* 채팅창 */}
          <div className="flex-1 flex flex-col">
            {activeRoomId !== null ? (
              <>
                <div className="p-4 border-b border-github-border font-bold text-github-text">
                  {rooms.find(r => r.id === activeRoomId)?.roomName}
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {messages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`px-4 py-2 rounded-lg max-w-xs ${
                          msg.sender === "user"
                            ? "bg-github-accent text-white rounded-br-none"
                            : "bg-github-dark text-github-text rounded-bl-none"
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-3 border-t border-github-border flex space-x-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    placeholder="메시지를 입력하세요..."
                    className="flex-1 px-3 py-2 rounded-md bg-github-dark text-github-text focus:outline-none focus:ring-2 focus:ring-github-accent"
                  />
                  <button
                    onClick={handleSend}
                    className="px-4 py-2 bg-github-accent text-white rounded-md hover:bg-github-accent/80 transition"
                  >
                    전송
                  </button>
                  <button
                    onClick={handleCreateRoom}
                    className="px-3 py-1 bg-github-accent text-white rounded-md hover:bg-github-accent/80 transition"
                  >
                  +
                  </button>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-github-text-secondary">
                채팅방을 선택하세요
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AIService;
