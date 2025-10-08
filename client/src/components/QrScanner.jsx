import React, { useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";

export default function QrScanner({ onScan, onClose }) {
  const divRef = useRef(null);
  const scannerRef = useRef(null);
  const scannedRef = useRef(false);
  const mountedRef = useRef(true);

  // Keep latest callbacks
  const onScanRef = useRef(onScan);
  const onCloseRef = useRef(onClose);
  onScanRef.current = onScan;
  onCloseRef.current = onClose;

  // Aggressively stop all leftover media streams and remove video/canvas nodes
  const forceStopAllStreams = () => {
    document.querySelectorAll("video").forEach((video) => {
      try {
        if (video.srcObject) {
          video.srcObject.getTracks().forEach((track) => track.stop());
          video.srcObject = null;
        }
        if (video.parentNode) video.parentNode.removeChild(video);
      } catch (e) {}
    });

    document.querySelectorAll("canvas").forEach((canvas) => {
      try {
        if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
      } catch (e) {}
    });
  };

  // Stop camera and cleanup
  const stopCamera = async () => {
    const scanner = scannerRef.current;
    if (scanner) {
      try {
        await Promise.race([
          scanner.stop(),           // stop html5-qrcode
          new Promise((res) => setTimeout(res, 1000)), // fallback
        ]);
      } catch (e) {}
      try {
        await scanner.clear();
      } catch (e) {}
      scannerRef.current = null;
    }

    forceStopAllStreams();

    try {
      if (divRef.current) divRef.current.innerHTML = "";
    } catch (e) {}
  };

  useEffect(() => {
    mountedRef.current = true;
    scannedRef.current = false;

    const startScanner = async () => {
      if (!divRef.current) return;

      const containerId = "qr-reader-container";

      // Clear previous content and set stable ID
      try {
        divRef.current.innerHTML = "";
        divRef.current.id = containerId;
      } catch (e) {}

      // Stop any existing streams
      forceStopAllStreams();

      if (scannerRef.current) return;

      const scanner = new Html5Qrcode(containerId, { verbose: false });
      scannerRef.current = scanner;

      try {
        await scanner.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: 250 },
          async (decodedText) => {
            if (scannedRef.current) return;

            // Call onScan callback first
            if (mountedRef.current && onScanRef.current) {
              try {
                onScanRef.current(decodedText);
              } catch (e) {
                console.error("onScan handler error", e);
              }
            }

            // Then mark as scanned and stop camera
            scannedRef.current = true;
            await stopCamera();
          },
          () => {
            // ignore decode errors
          }
        );
      } catch (err) {
        console.error("QR scanner start failed:", err);
        await stopCamera();
        if (mountedRef.current && onCloseRef.current) onCloseRef.current();
      }
    };

    startScanner();

    return () => {
      mountedRef.current = false;
      stopCamera();
    };
  }, []);

  const handleClose = async () => {
    scannedRef.current = true;
    await stopCamera();
    if (onCloseRef.current) onCloseRef.current();
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-black via-gray-900 to-black rounded-2xl overflow-hidden shadow-2xl">
      {/* Close button */}
      <button
        onClick={handleClose}
        className="absolute top-4 right-4 text-white/90 hover:text-white bg-white/10 hover:bg-white/20 transition-all backdrop-blur-md p-2 rounded-full"
        title="Close Scanner"
      >
        ✕
      </button>

      {/* QR Scanner container */}
      <div
        ref={divRef}
        className="w-[340px] h-[340px] border-[3px] border-white/40 rounded-xl relative shadow-[0_0_30px_rgba(255,255,255,0.15)] flex items-center justify-center"
      >
        {/* Frame corners */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-green-400 rounded-tl-lg" />
        <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-green-400 rounded-tr-lg" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-green-400 rounded-bl-lg" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-green-400 rounded-br-lg" />
      </div>

      {/* Instructions */}
      <div className="absolute bottom-6 text-gray-200 text-sm tracking-wide">
        Align <span className="text-green-400 font-medium">QR code</span> inside the box
      </div>
    </div>
  );
}
