import { useRef, useEffect, useState, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCamera,
  faCircleCheck,
  faTriangleExclamation,
  faXmark,
  faSpinner,
  faVideo,
  faFaceSmile
} from '@fortawesome/free-solid-svg-icons';
import api from '../services/api';

interface FaceCaptureModalProps {
  employeeId: number;
  mode: 'register' | 'verify';
  onClose: () => void;
  onSuccess: (result?: { match: boolean; confidence: number }) => void;
  onError?: (message: string) => void;
}

type CaptureState = 'LOADING' | 'READY' | 'PROCESSING' | 'SUCCESS' | 'ERROR';

export const FaceCaptureModal = ({
  employeeId,
  mode,
  onClose,
  onSuccess,
  onError
}: FaceCaptureModalProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [captureState, setCaptureState] = useState<CaptureState>('LOADING');
  const [errorMessage, setErrorMessage] = useState('');
  const [confidence, setConfidence] = useState<number | null>(null);

  const stopStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user' }
        });

        if (!mounted) {
          stream.getTracks().forEach(t => t.stop());
          return;
        }

        streamRef.current = stream;

        // videoRef is always in the DOM now — safe to assign immediately
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          // Do NOT call play() here — autoPlay attr + onCanPlay handler manages it.
          // Calling play() manually races with autoPlay and can throw AbortError.
        }
      } catch {
        if (mounted) {
          setCaptureState('ERROR');
          setErrorMessage('No se pudo acceder a la cámara. Verifica los permisos.');
        }
      }
    };

    startCamera();

    return () => {
      mounted = false;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
        streamRef.current = null;
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCanPlay = () => {
    // Only transition from LOADING → READY (not from PROCESSING or other states)
    setCaptureState(prev => prev === 'LOADING' ? 'READY' : prev);
  };

  const handleCapture = async () => {
    if (!videoRef.current || !canvasRef.current || captureState !== 'READY') return;

    const video = videoRef.current;

    if (!video.videoWidth || !video.videoHeight) {
      setCaptureState('ERROR');
      setErrorMessage('La cámara no tiene frames. Cierra y vuelve a intentar.');
      return;
    }

    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Mirror to match the flipped display — face_recognition needs a normal-orientation image
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0);

    const dataURL = canvas.toDataURL('image/jpeg', 0.9);
    const imageBase64 = dataURL.replace('data:image/jpeg;base64,', '');

    setCaptureState('PROCESSING');

    try {
      if (mode === 'register') {
        await api.post(`/employees/${employeeId}/register-face`, { imageBase64 });
        stopStream();
        setCaptureState('SUCCESS');
        setTimeout(() => onSuccess(), 1500);
      } else {
        const result = await api.post('/auth/employee/verify-face', {
          employeeId,
          imageBase64
        });
        stopStream();
        if (result.match) {
          setConfidence(result.confidence);
          setCaptureState('SUCCESS');
          setTimeout(() => onSuccess({ match: true, confidence: result.confidence }), 1500);
        } else {
          setCaptureState('ERROR');
          setErrorMessage(result.message || 'Biometría no coincide');
          setTimeout(() => {
            if (onError) onError(result.message || 'Biometría no coincide');
          }, 1500);
        }
      }
    } catch (err: any) {
      setCaptureState('ERROR');
      const msg = err?.message || 'Error en verificación facial';
      setErrorMessage(msg);
      setTimeout(() => {
        if (onError) onError(msg);
      }, 1500);
    }
  };

  const statusColor = {
    LOADING: 'border-white/10',
    READY: 'border-room-primary',
    PROCESSING: 'border-room-primary',
    SUCCESS: 'border-room-success shadow-[0_0_30px_rgba(16,211,152,0.2)]',
    ERROR: 'border-room-error shadow-[0_0_30px_rgba(255,89,89,0.2)]'
  }[captureState];

  const showCamera = captureState === 'LOADING' || captureState === 'READY' || captureState === 'PROCESSING';

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[200] flex items-center justify-center p-4">
      <div className={`w-full max-w-lg bg-[#1f2a3c] border-2 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col transition-all duration-500 ${statusColor}`}>

        {/* Header */}
        <div className="p-4 border-b border-white/5 bg-[#152031] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-2 h-2 rounded-full animate-pulse ${captureState === 'SUCCESS' ? 'bg-room-success' : captureState === 'ERROR' ? 'bg-room-error' : 'bg-room-primary'}`} />
            <span className="text-[10px] font-mono text-white/40 uppercase tracking-[0.2em]">
              {mode === 'register' ? 'Face_Registration // V1.0' : 'Biometric_Verification // V1.0'}
            </span>
          </div>
          <button onClick={() => { stopStream(); onClose(); }} className="text-white/20 hover:text-white transition-colors">
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>

        {/* Camera / Status Area */}
        <div className="p-6 flex flex-col items-center gap-4 bg-gradient-to-b from-[#040e1f] to-[#1f2a3c]">

          {/*
            Video element is ALWAYS rendered while camera states are active.
            This ensures videoRef.current is valid when startCamera() attaches the stream.
            Visibility is controlled via overlays, not conditional mounting.
          */}
          {showCamera && (
            <div className="w-full aspect-video relative rounded-xl overflow-hidden border border-room-primary/30">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                onCanPlay={handleCanPlay}
                className="w-full h-full object-cover scale-x-[-1]"
              />

              {/* Loading overlay — sits on top of the video while stream initializes */}
              {captureState === 'LOADING' && (
                <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
                  <FontAwesomeIcon icon={faSpinner} className="text-4xl text-room-primary animate-spin" />
                </div>
              )}

              {/* Face guide oval */}
              {captureState === 'READY' && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-48 h-56 border-2 border-room-primary/60 rounded-full opacity-50" />
                </div>
              )}

              {/* Processing overlay */}
              {captureState === 'PROCESSING' && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <FontAwesomeIcon icon={faSpinner} className="text-4xl text-room-primary animate-spin" />
                </div>
              )}
            </div>
          )}

          {captureState === 'SUCCESS' && (
            <div className="w-full aspect-video bg-room-success/5 rounded-xl flex flex-col items-center justify-center border border-room-success/30 gap-3">
              <FontAwesomeIcon icon={faCircleCheck} className="text-6xl text-room-success" />
              <p className="text-room-success font-bold uppercase tracking-widest text-sm">
                {mode === 'register' ? 'Rostro Registrado' : 'Identidad Verificada'}
              </p>
              {confidence !== null && (
                <p className="text-white/40 text-xs font-mono">
                  Confianza: {(confidence * 100).toFixed(1)}%
                </p>
              )}
            </div>
          )}

          {captureState === 'ERROR' && (
            <div className="w-full aspect-video bg-room-error/5 rounded-xl flex flex-col items-center justify-center border border-room-error/30 gap-3">
              <FontAwesomeIcon icon={faTriangleExclamation} className="text-6xl text-room-error" />
              <p className="text-room-error font-bold uppercase tracking-widest text-sm text-center px-4">
                {errorMessage || 'Error de captura'}
              </p>
            </div>
          )}

          {/* Instructions */}
          {captureState === 'READY' && (
            <div className="flex items-center gap-2 text-white/30 text-xs font-mono">
              <FontAwesomeIcon icon={faFaceSmile} />
              <span>Centra tu rostro en el encuadre y presiona capturar</span>
            </div>
          )}
        </div>

        {/* Hidden canvas for capture */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Actions */}
        <div className="p-5 bg-[#152031] flex gap-3">
          <button
            onClick={() => { stopStream(); onClose(); }}
            className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white/50 hover:text-white text-sm font-bold uppercase tracking-widest transition-all border border-white/5"
          >
            {mode === 'register' ? 'Omitir' : 'Cancelar'}
          </button>
          <button
            onClick={handleCapture}
            disabled={captureState !== 'READY'}
            className="flex-1 py-3 rounded-xl bg-room-primary/20 hover:bg-room-primary/30 text-room-primary text-sm font-bold uppercase tracking-widest transition-all border border-room-primary/20 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <FontAwesomeIcon
              icon={captureState === 'PROCESSING' ? faSpinner : faCamera}
              className={captureState === 'PROCESSING' ? 'animate-spin' : ''}
            />
            {captureState === 'PROCESSING' ? 'Procesando...' : 'Capturar'}
          </button>
        </div>

        {/* Footer */}
        <div className="p-3 bg-[#040e1f] text-center">
          <p className="text-[9px] text-white/20 font-mono uppercase tracking-widest flex items-center justify-center gap-2">
            <FontAwesomeIcon icon={faVideo} />
            BIOMETRIC_MODULE: ROOM_911 SECURE_SYSTEM
          </p>
        </div>
      </div>
    </div>
  );
};
