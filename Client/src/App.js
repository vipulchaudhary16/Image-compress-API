import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";
import {
  CircularProgress,
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';

function App() {
  const [downloadLink, setDownloadLink] = useState(false)
  const [welcomeMessage, setWelcomeMessage] = useState("")
  const [isCompressing, setIsCompressing] = useState(false)
  // const ALGORITHM_HOST = "http://34.202.162.4:5001"
  const ALGORITHM_HOST = "http://localhost:5001"

  const handleSubmit = (e) => {
    e.preventDefault()
    const formData = new FormData();
    const imagefile = document.querySelector('#file-to-compress');
    try {
      setIsCompressing(true)
      formData.append("file-to-compress", imagefile.files[0]);
      axios.post(ALGORITHM_HOST + '/file/compress', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then((res) => {
        setDownloadLink(res.data.downloadURL)
        setIsCompressing(false)
      })
    } catch (error) {
      console.log(error)
      setIsCompressing(false)
    }
  }

  useEffect(() => {
    const fetchMessage = async () => {
      await axios.get(`${ALGORITHM_HOST}/file`).then((res) => {
        setWelcomeMessage(res.data)
      }).catch((err) => {
        setWelcomeMessage(err.message)
      })
    }
    fetchMessage()
  }, [])

  return (
    <div className="main">
      <p className="title mx-auto py-2 mb-12">
        {welcomeMessage}
      </p>
      <form className="form-container" action="" onSubmit={(e) => handleSubmit(e)}>
        <input type="file" accept="image/*" id="file-to-compress" required/>

        {
          downloadLink ?
            <button className="basic-btn py-2 px-3" >
              <a href={downloadLink} download>
                <DownloadIcon/> Compressed Image
              </a>
            </button> :
            <button type="submit" className="basic-btn py-2 px-3">
              {
                isCompressing ? (<div className="btn-box">
                  Compressing
                  <CircularProgress size={16} />
                </div>) : <div className="btn-box">
                  Compress Image
                </div>
              }
            </button>
        }
      </form>
    </div>
  );
}

export default App;
