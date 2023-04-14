import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";

function App() {
  const [downloadLink, setDownloadLink] = useState(null)
  const [welcomeMessage, setWelcomeMessage] = useState("")
  const [isCompressing, setIsCompressing] = useState(false)
  const ALGORITHM_HOST = "http://localhost:8000"

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
    <>
      {
        isCompressing && <div className="absolute-loader">
          COMPRESSING
        </div>
      }
      {welcomeMessage}
      <form action="" onSubmit={(e) => handleSubmit(e)}>
        <input type="file" accept="image/*" id="file-to-compress" />
        <button type="submit" >Compress image</button>
      </form>
      {
        downloadLink &&
        <button className="btn btn-primary mt-4" >
          <a href={downloadLink} download>
            Download compressed image
          </a>
        </button>
      }
    </>
  );
}

export default App;
