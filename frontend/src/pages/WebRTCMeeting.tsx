import { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Video, VideoOff, PhoneOff, Users, MessageCircle, Share2, Settings } from 'lucide-react';

const UnoptimizedWebRTCMeeting = () => {
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isMeetingStarted, setIsMeetingStarted] = useState(false);
  const [participants, setParticipants] = useState([
    { id: 1, name: '나', isLocal: true },
    { id: 2, name: '참여자 1', isLocal: false },
    { id: 3, name: '참여자 2', isLocal: false }
  ]);
  
  const localVideoRef = useRef(null);
  const localStreamRef = useRef(null);
  const peerConnectionRef = useRef(null);

  // ❌ 최적화 안된 미디어 스트림 획득
  const startLocalStream = async () => {
    try {
      // 비효율적인 설정 - 너무 높은 해상도와 프레임레이트
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: 1920,  // ❌ 너무 높음
          height: 1080, // ❌ 너무 높음
          frameRate: 60 // ❌ 불필요하게 높음
        },
        audio: true // ❌ 오디오 최적화 없음
      });
      
      localStreamRef.current = stream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      
      setIsMeetingStarted(true);
      
      // ❌ PeerConnection 생성 시 최적화 없음
      createPeerConnection();
    } catch (error) {
      console.error('미디어 접근 오류:', error);
      alert('카메라/마이크 접근에 실패했습니다.');
    }
  };

  // ❌ 최적화 안된 PeerConnection 설정
  const createPeerConnection = () => {
    // ❌ 기본 설정만 사용, TURN 서버 없음
    const configuration = {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' }
      ]
      // ❌ bundlePolicy, rtcpMuxPolicy 등 최적화 옵션 없음
    };
    
    const pc = new RTCPeerConnection(configuration);
    
    // ❌ 트랙 추가 시 최적화 없음
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => {
        pc.addTrack(track, localStreamRef.current);
        // ❌ Simulcast 없음
        // ❌ 비트레이트 제한 없음
      });
    }
    
    peerConnectionRef.current = pc;
  };

  const toggleAudio = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioEnabled(audioTrack.enabled);
      }
    }
  };

  const toggleVideo = () => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoEnabled(videoTrack.enabled);
      }
    }
  };

  const endCall = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
    }
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
    }
    setIsMeetingStarted(false);
  };

  useEffect(() => {
    return () => {
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Video className="w-6 h-6 text-indigo-400" />
            <h1 className="text-xl font-bold text-white">스터디 미팅 (최적화 전)</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-gray-400">
              <Users className="w-5 h-5" />
              <span className="text-sm">{participants.length}명</span>
            </div>
            <span className="px-3 py-1 bg-red-500 text-white text-sm rounded-full">
              ⚠️ 비최적화
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Video Grid */}
        <div className="flex-1 p-4">
          {!isMeetingStarted ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <div className="w-32 h-32 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Video className="w-16 h-16 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-4">미팅 시작하기</h2>
                <p className="text-gray-400 mb-8">
                  카메라와 마이크를 켜고 미팅에 참여하세요
                </p>
                <button
                  onClick={startLocalStream}
                  className="bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                >
                  미팅 참여
                </button>
                <div className="mt-6 p-4 bg-yellow-900 border border-yellow-700 rounded-lg max-w-md mx-auto">
                  <p className="text-yellow-200 text-sm">
                    ⚠️ 이 버전은 최적화되지 않았습니다<br/>
                    • 높은 해상도 (1920x1080)<br/>
                    • 높은 프레임레이트 (60fps)<br/>
                    • 비트레이트 제한 없음<br/>
                    • Simulcast 미지원<br/>
                    → 끊김 현상 발생 가능
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full">
              <div className="grid grid-cols-2 gap-4 h-full">
                {/* Local Video */}
                <div className="relative bg-gray-800 rounded-lg overflow-hidden">
                  <video
                    ref={localVideoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                  {!isVideoEnabled && (
                    <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-3">
                          <span className="text-3xl">👤</span>
                        </div>
                        <p className="text-white font-medium">나</p>
                      </div>
                    </div>
                  )}
                  <div className="absolute bottom-4 left-4 bg-black bg-opacity-60 px-3 py-1 rounded-lg">
                    <span className="text-white text-sm font-medium">나 (호스트)</span>
                  </div>
                  {!isAudioEnabled && (
                    <div className="absolute top-4 right-4 bg-red-500 p-2 rounded-full">
                      <MicOff className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>

                {/* Remote Participants */}
                {participants.filter(p => !p.isLocal).map(participant => (
                  <div key={participant.id} className="relative bg-gray-800 rounded-lg overflow-hidden">
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-3">
                          <span className="text-4xl">👤</span>
                        </div>
                        <p className="text-white font-medium">{participant.name}</p>
                        <p className="text-gray-400 text-sm mt-1">연결 대기 중...</p>
                      </div>
                    </div>
                    <div className="absolute bottom-4 left-4 bg-black bg-opacity-60 px-3 py-1 rounded-lg">
                      <span className="text-white text-sm font-medium">{participant.name}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Performance Warning */}
              <div className="mt-4 p-3 bg-red-900 border border-red-700 rounded-lg">
                <p className="text-red-200 text-sm flex items-center">
                  <span className="mr-2">⚠️</span>
                  <strong>성능 경고:</strong>&nbsp;
                  1920x1080@60fps로 전송 중 - CPU 사용량 높음, 끊김 가능성 높음
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="w-80 bg-gray-800 border-l border-gray-700 p-4">
          <h3 className="text-white font-bold mb-4">참여자 ({participants.length})</h3>
          <div className="space-y-2">
            {participants.map(participant => (
              <div key={participant.id} className="bg-gray-700 rounded-lg p-3 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center">
                    <span className="text-white">👤</span>
                  </div>
                  <div>
                    <p className="text-white font-medium">{participant.name}</p>
                    {participant.isLocal && (
                      <span className="text-xs text-gray-400">나</span>
                    )}
                  </div>
                </div>
                {participant.isLocal && (
                  <span className="px-2 py-1 bg-indigo-600 text-white text-xs rounded">
                    호스트
                  </span>
                )}
              </div>
            ))}
          </div>

          <div className="mt-6">
            <h3 className="text-white font-bold mb-4">문제점</h3>
            <div className="space-y-2 text-sm">
              <div className="bg-red-900 border border-red-700 rounded p-2">
                <p className="text-red-200">❌ 해상도: 1920x1080 (과도함)</p>
              </div>
              <div className="bg-red-900 border border-red-700 rounded p-2">
                <p className="text-red-200">❌ 프레임레이트: 60fps (불필요)</p>
              </div>
              <div className="bg-red-900 border border-red-700 rounded p-2">
                <p className="text-red-200">❌ 비트레이트 제한 없음</p>
              </div>
              <div className="bg-red-900 border border-red-700 rounded p-2">
                <p className="text-red-200">❌ Simulcast 미사용</p>
              </div>
              <div className="bg-red-900 border border-red-700 rounded p-2">
                <p className="text-red-200">❌ 오디오 최적화 없음</p>
              </div>
              <div className="bg-red-900 border border-red-700 rounded p-2">
                <p className="text-red-200">❌ 네트워크 모니터링 없음</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      {isMeetingStarted && (
        <div className="bg-gray-800 border-t border-gray-700 px-6 py-4">
          <div className="flex items-center justify-center space-x-4">
            <button
              onClick={toggleAudio}
              className={`p-4 rounded-full transition-colors ${
                isAudioEnabled 
                  ? 'bg-gray-700 hover:bg-gray-600' 
                  : 'bg-red-600 hover:bg-red-700'
              }`}
            >
              {isAudioEnabled ? (
                <Mic className="w-6 h-6 text-white" />
              ) : (
                <MicOff className="w-6 h-6 text-white" />
              )}
            </button>

            <button
              onClick={toggleVideo}
              className={`p-4 rounded-full transition-colors ${
                isVideoEnabled 
                  ? 'bg-gray-700 hover:bg-gray-600' 
                  : 'bg-red-600 hover:bg-red-700'
              }`}
            >
              {isVideoEnabled ? (
                <Video className="w-6 h-6 text-white" />
              ) : (
                <VideoOff className="w-6 h-6 text-white" />
              )}
            </button>

            <button
              onClick={endCall}
              className="p-4 bg-red-600 hover:bg-red-700 rounded-full transition-colors"
            >
              <PhoneOff className="w-6 h-6 text-white" />
            </button>

            <button className="p-4 bg-gray-700 hover:bg-gray-600 rounded-full transition-colors">
              <Share2 className="w-6 h-6 text-white" />
            </button>

            <button className="p-4 bg-gray-700 hover:bg-gray-600 rounded-full transition-colors">
              <MessageCircle className="w-6 h-6 text-white" />
            </button>

            <button className="p-4 bg-gray-700 hover:bg-gray-600 rounded-full transition-colors">
              <Settings className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UnoptimizedWebRTCMeeting;