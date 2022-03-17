import VideoPlayer from './components/Player/VideoPlayer';
import './App.css';

// const mp4Src =
//   'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4';

const hslSrc =
  'https://multiplatform-f.akamaihd.net/i/multi/april11/sintel/sintel-hd_,512x288_450_b,640x360_700_b,768x432_1000_b,1024x576_1400_m,.mp4.csmil/master.m3u8';

function App() {
  return (
    <div className="App">
      <VideoPlayer src={hslSrc} autoPlay={true} />
    </div>
  );
}

export default App;
