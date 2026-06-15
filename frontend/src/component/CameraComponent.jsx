import React from 'react';
import Webcam from 'react-webcam';

const CameraCapture = ({ webcamRef }) => {
  const videoConstraints = {
    width: 320,
    height: 240,
    facingMode: "user",
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '15px 0' }}>
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        videoConstraints={videoConstraints}
        style={{ borderRadius: '8px', width: '100%', maxWidth: '320px', border: '2px solid #ccc' }}
      />
      <small style={{ color: '#666', marginTop: '5px' }}>Camera Preview Active</small>
    </div>
  );
};

export default CameraCapture;