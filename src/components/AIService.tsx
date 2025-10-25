import React from 'react';
import { Code2, Database, Globe, Server, Wrench, Bot, ShieldCheck, Layers } from 'lucide-react';
import { useUserStore } from '../store/user/userStore';
import { useRef, useState, useEffect } from "react";
import axios from "axios";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { FaMicrophone } from "react-icons/fa";



interface Room {
    id: number;
    roomName: string;
    roomType: string;
    createdAt: string;
}
  
interface ChatMessageDto {
  type: "EVALUATE" | "TALK";  
  roomId: number;
  sender: string;
  message: string;
  createdAt: string;  
}

const AIService: React.FC = () => {
    const [isRecording, setIsRecording] = useState(false);
    const { isLoggedIn, user} = useUserStore();
    const [rooms, setRooms] = useState<Room[]>([]);
    const [activeRoomId, setActiveRoomId] = useState<number | null>(null);
    const [messages, setMessages] = useState<{ sender: "user" | "ai"; text: string }[]>([]);
    const [input, setInput] = useState("");
    const [stompClient, setStompClient] = useState<Client | null>(null);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const recognitionRef = useRef<any | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showRoomInput, setShowRoomInput] = useState(false);
    const [newRoomName, setNewRoomName] = useState("");
    
    const handleVoiceInput = () => {
      // 이미 녹음 중(isRecording)이고 recognition 인스턴스가(recognitionRef.current) 있다면 중지
      if (isRecording && recognitionRef.current) {
          recognitionRef.current.stop();
          console.log("음성 인식 수동 중지");
          
          // onend 핸들러가 자동으로 isRecording, recognitionRef를 정리
          return;
      }
        
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) {
         alert("이 브라우저는 음성 인식을 지원하지 않습니다.");
         return;
      }
        
      const recognition = new SpeechRecognition();
        
      recognition.lang = "ko-KR"; 
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;
        
      recognitionRef.current = recognition; 
        
      recognition.start();
        
      recognition.onstart = () => {
        setIsRecording(true); 
        console.log("음성 인식 시작");
      };
        
      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[0][0].transcript;
        console.log("인식된 텍스트:", transcript);
        handleSend(transcript);
      };
        
      recognition.onerror = (event: any) => {
        if (event.error === 'aborted') {
          console.log("음성 인식이 (수동으로) 중지되었습니다.");
        } else {
          console.error("음성 인식 오류:", event.error);
        }
      };
        
      recognition.onend = () => {
        setIsRecording(false);
        recognitionRef.current = null; 
        console.log("음성 인식 종료");
      };
    };     


    const handleCreateRoom = (roomName: string) => {
        axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/chat/room`
          , {
              roomName, 
              roomType: "TALK" 
          }
          , { headers: { Authorization: `Bearer ${user?.accessToken}` }})
        .then(res => {
            const newRoom = {
                id: res.data.roomId,
                roomType: res.data.roomType,
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
                        roomType: r.roomType,
                        createdAt: r.createdAt,
                    }));

                    const talkRooms = mapped.filter(room => room.roomType === "TALK");
                    setRooms(talkRooms);
                })
                .catch(err => console.error("채팅방 목록 불러오기 실패: ", err));
        }
    }, [isLoggedIn, user?.accessToken]);

    // ActiveRoomId가 변경이 될 시 메시지 히스토리 재개
    useEffect(() => {
      if (isLoggedIn && user?.accessToken && activeRoomId !== null) {
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/chat/room/${activeRoomId}/messages`, {
          headers: { Authorization: `Bearer ${user.accessToken}` },
        })
        .then(res => {
            const mapped = res.data.map((m:ChatMessageDto)=>({
              sender: m.sender === user?.username ? "user" : "ai",
              text: m.message,
            }));
            setMessages(mapped);
        })
        .catch(err => console.error("채팅 내역 불러오기 실패: ", err));
      }
    }, [isLoggedIn, user?.accessToken, user?.username, activeRoomId]);
    
    const chatContainerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
      }
    }, [messages]);
  
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
            if(body.sender !== user?.username) {
              setMessages(prev => [...prev, 
                  { 
                    sender: "ai", text: body.message 
                  }
              ]);
            }
          });

          setIsLoading(false);
        };
  
        client.activate();
        setStompClient(client);
  
        return () => {
          client.deactivate();
        };
      }  
    }, [isLoggedIn, user?.accessToken, activeRoomId, user?.username]);

    const handleSend = (message?: string) => {
      const messageToSend = message ?? input;

      if (!messageToSend.trim() || activeRoomId === null || !stompClient) return;

      const activeRoom = rooms.find(r => r.id === activeRoomId);
      if (!activeRoom) return;

      const chatMessage = {
        type: activeRoom.roomType,
        roomId: activeRoomId,
        sender: user?.username,
        message: messageToSend.trim(),
      }

      // 사용자 메시지 추가
      setMessages((prev) => [...prev, { sender: "user", text: messageToSend.trim() }]);
  
      setIsLoading(true);

      // STOMP publish
      stompClient.publish({
        destination: "/pub/chat/message",
        body: JSON.stringify(chatMessage),
      });
  
      setInput("");
    };
  

    
    return (
<section id="AIService" className="py-20 px-4 sm:px-6 lg:px-8">
    <div className="">
        <div className="text-center mb-16 fade-in-up">
            <h2 className="text-3xl sm:text-4xl font-bold text-github-text mb-4">
              안녕하세요, {!isLoggedIn ?
                          (
                            <span className="text-blue-400">
                                방문자님
                            </span> 
                          ) : (
                            <span className="text-blue-400">
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
                  onClick={() => setShowRoomInput(prev => !prev)}
                  className="px-3 py-1 bg-github-accent text-white rounded-md hover:bg-github-accent/80 transition"
                >
                방 추가하기
                </button>
                {showRoomInput && (
                <div className="p-2 flex items-center space-x-2">
                  <input
                    type="text"
                    value={newRoomName}
                    onChange={(e) => setNewRoomName(e.target.value)}
                    placeholder="방 이름 입력"
                    className="flex-1 px-2 py-1 rounded-md bg-github-surface text-github-text 
                              focus:outline-none focus:ring-2 focus:ring-github-accent text-sm"
                  />
                  <button
                    onClick={() => {
                      handleCreateRoom(newRoomName);
                      setNewRoomName("");
                      setShowRoomInput(false);
                    }}
                    className="w-8 h-8 flex items-center justify-center rounded-md 
                              bg-github-accent text-white hover:bg-github-accent/80 transition"
                    title="방 생성"
                  >
                    +
                  </button>
                </div>
              )}
              <div className="flex-1 overflow-y-auto">
                  {rooms.map(room => (
                      <div
                          key={room.id}
                          onClick={() => setActiveRoomId(room.id)}
                          className={`p-3 cursor-pointer hover:bg-github-surface ${
                          activeRoomId === room.id ? "bg-github-surface" : ""
                      }`}>
                      
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
                <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-3">
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

                {/* scroll 기준점 */}
                <div ref={messagesEndRef} /> 
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
                    onClick={() => handleSend()}
                    className="px-4 py-2 bg-github-accent text-white rounded-md hover:bg-github-accent/80 transition"
                  >
                    전송
                  </button>
                  <button
                    onClick={handleVoiceInput}
                    className={`flex items-center space-x-2 px-4 py-2 bg-github-dark text-github-text rounded-md hover:bg-github-accent/40 transition
                    ${isRecording ? "bg-red-600 text-white hover:bg-red-700" : "bg-github-dark text-github-text hover:bg-github-accent/40"}`}>
                    <FaMicrophone size={20}/>
                  </button>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col justify-end text-github-text-secondary">
                <div className="p-3 border-t border-github-border flex space-x-2">
                  <input
                    type="text"
                    readOnly
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
