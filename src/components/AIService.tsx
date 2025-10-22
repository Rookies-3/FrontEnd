import React from 'react';
import { Code2, Database, Globe, Server, Wrench, Bot, ShieldCheck, Layers } from 'lucide-react';
import { useUserStore } from '../store/user/userStore';

const AIService: React.FC = () => {
    // TODO: db에서 어떤 값들을 들고오자. 뭘 들고올지는 모르겠지만 값을 들고와서 뿌려야함.
    const { isLoggedIn, user} = useUserStore();

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
                </div>
        </div>
        </section>
    )
};

export default AIService;