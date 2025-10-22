import React from 'react';
import { Code2, Database, Globe, Server, Wrench, Bot, ShieldCheck, Layers } from 'lucide-react';
import { useUserStore } from '../store/user/userStore';
import { useState, useEffect } from "react";
import axios from "axios";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";


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
    const [stompClient, setStompClient] = useState<Client | null>(null);


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
                        createdAt: r.createdAt,
                    }));
                    setRooms(mapped);
                })
                .catch(err => console.error("채팅방 목록 불러오기 실패: ", err));
        }
    }, [isLoggedIn, user?.accessToken]);

    // STOMP 연결 (방 선택시 구독처리)
    useEffect(() => {
      if (isLoggedIn && user?.accessToken && activeRoomId) {
        const client = new Client({
          webSocketFactory: () => new SockJS(`${import.meta.env.VITE_API_BASE_URL}/ws-stomp`),
          connectHeaders: {
            Authorization: `Bearer ${user.accessToken}`,
          },
          reconnectDelay: 5000,
          debug: (str) => console.log(str),
        });
  
        client.onConnect = () => {
          console.log("STOMP Connected");
  
          // 방 구독
          client.subscribe(`/sub/chat/room/${activeRoomId}`, (message) => {
            const body = JSON.parse(message.body);
            setMessages(prev => [...prev, { sender: body.sender, text: body.message }]);
          });
        };
  
        client.activate();
        setStompClient(client);
  
        return () => {
          client.deactivate();
        };
      }  
    }, [isLoggedIn, user?.accessToken, activeRoomId]);

    const handleSend = () => {
      if (!input.trim() || activeRoomId === null || !stompClient) return;
      
      const chatMessage = {
        type: "TALK",
        roomId: activeRoomId,
        sender: user?.username,
        message: input,
      }

      // 사용자 메시지 추가
      setMessages((prev) => [...prev, { sender: "user", text: input }]);
  
      // STOMP publish
      stompClient.publish({
        destination: "/pub/chat/message",
        body: JSON.stringify(chatMessage),
      });
  
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
        <div className="flex h-[500px] bg-github-surface rounded-xl shadow-lg overflow-hidden">
          {/* 채팅방 목록 */}
          <div className="w-64 border-r border-github-border bg-github-dark flex flex-col">

            {isLoggedIn ? (
            <>
            <div className="p-4 font-bold text-github-accent">채팅방 목록</div>
                <button
                  onClick={handleCreateRoom}
                  className="px-3 py-1 bg-github-accent text-white rounded-md hover:bg-github-accent/80 transition"
                >
                방 추가하기
                </button>
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
            </>
            ) 
            : (
            <>
            <div className="p-4 font-bold text-github-accent">채팅방 목록</div>
            <button className="px-3 py-1 bg-github-accent text-white rounded-md hover:bg-github-accent/80 transition">
                방 추가하기
            </button>           
            </>
            )}
     </div>           

          {/* 채팅창 */}
          <div className="flex-1 flex flex-col">
            {activeRoomId !== null && isLoggedIn ? (
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
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col justify-end text-github-text-secondary">
                <div className="p-3 border-t border-github-border flex space-x-2">
                  <input
                    type="text"
                    readOnly
                    placeholder="로그인해주세요."
                    className="flex-1 px-3 py-2 rounded-md bg-github-dark text-github-text focus:outline-none focus:ring-2 focus:ring-github-accent"
                  />
                  <button
                    className="px-4 py-2 bg-github-accent text-white rounded-md hover:bg-github-accent/80 transition"
                  >
                    전송
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AIService;
