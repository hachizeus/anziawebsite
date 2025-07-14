import React, { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const SignatureCanvas = ({ onSave, initialSignature }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [ctx, setCtx] = useState(null);
  const [hasSignature, setHasSignature] = useState(false);

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    
    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    // Set line style
    context.lineWidth = 2;
    context.lineCap = 'round';
    context.strokeStyle = '#000';
    
    setCtx(context);
    
    // Load initial signature if provided
    if (initialSignature) {
      const img = new Image();
      img.onload = () => {
        context.drawImage(img, 0, 0);
        setHasSignature(true);
      };
      img.src = initialSignature;
    }
    
    // Handle window resize
    const handleResize = () => {
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      context.lineWidth = 2;
      context.lineCap = 'round';
      context.strokeStyle = '#000';
      context.putImageData(imageData, 0, 0);
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [initialSignature]);

  const startDrawing = (e) => {
    const { offsetX, offsetY } = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(offsetX, offsetY);
    setIsDrawing(true);
    setHasSignature(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    
    const { offsetX, offsetY } = getCoordinates(e);
    ctx.lineTo(offsetX, offsetY);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (isDrawing) {
      ctx.closePath();
      setIsDrawing(false);
    }
  };

  const getCoordinates = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    
    // Handle both mouse and touch events
    if (e.type.includes('touch')) {
      const touch = e.touches[0] || e.changedTouches[0];
      return {
        offsetX: touch.clientX - rect.left,
        offsetY: touch.clientY - rect.top
      };
    } else {
      return {
        offsetX: e.clientX - rect.left,
        offsetY: e.clientY - rect.top
      };
    }
  };

  const clearSignature = () => {
    if (ctx) {
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      setHasSignature(false);
    }
  };

  const saveSignature = () => {
    if (hasSignature && canvasRef.current) {
      const dataUrl = canvasRef.current.toDataURL('image/png');
      onSave(dataUrl);
    } else {
      alert('Please sign before saving');
    }
  };

  return (
    <div className="signature-container">
      <div className="border border-gray-300 rounded-md mb-2">
        <canvas
          ref={canvasRef}
          className="w-full h-40 bg-white cursor-crosshair"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
      </div>
      <div className="flex justify-between">
        <button
          type="button"
          onClick={clearSignature}
          className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
        >
          Clear
        </button>
        <button
          type="button"
          onClick={saveSignature}
          disabled={!hasSignature}
          className={`px-3 py-1 rounded ${
            hasSignature
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Save Signature
        </button>
      </div>
    </div>
  );
};

SignatureCanvas.propTypes = {
  onSave: PropTypes.func.isRequired,
  initialSignature: PropTypes.string
};

export default SignatureCanvas;

