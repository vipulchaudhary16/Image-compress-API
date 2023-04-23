import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";

function App() {
	const [downloadLink, setDownloadLink] = useState(null)
	const [welcomeMessage, setWelcomeMessage] = useState("")
	const [quality, setQuality] = useState(50)
	const [isCompressing, setIsCompressing] = useState(false)
	const [fileMetadata, setFileMetadata] = useState({
		name: "",
		type: "",
		newSize: 0
	})
	const [prevSize, setPrevSize] = useState(0)

	const ALGORITHM_HOST = "http://localhost:5001"

	// const ALGORITHM_HOST = "http://34.202.162.4:5001"
	const handleSubmit = (e) => {
		e.preventDefault()
		if (quality > 100 || quality < 0) {
			alert("Quality must be between 0 and 100")
			return
		}
		const formData = new FormData();
		const imagefile = document.querySelector('#file-to-compress');
		setPrevSize(imagefile.files[0].size/1000)

		try {
			setIsCompressing(true)
			formData.append("file-to-compress", imagefile.files[0]);
			formData.append("quality", quality);
			axios.post(ALGORITHM_HOST + '/file/compress', formData, {
				headers: {
					'Content-Type': 'multipart/form-data'
				}
			}).then((res) => {
				setFileMetadata({
					...fileMetadata,
					name: res.data.name,
					type: res.data.type,
					newSize: res.data.newSize
				})
				setDownloadLink(res.data.downloadURL)
			}).catch((err) => {
				console.log(err)
				setWelcomeMessage(err.message)
			})
				.finally(() => {
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
			{
				isCompressing && <div className="absolute-loader">
					COMPRESSING..........
				</div>
			}
			<p className="title mx-auto py-2 mb-12"> {welcomeMessage}</p>
			<form className="form-container" onSubmit={(e) => handleSubmit(e)}>
				<label htmlFor="">Image quality %</label>
				<input type="number" name="quality_input" id="quality_input" value={quality} onChange={(e) => setQuality(e.target.value)} />
				<input type="file" accept="image/*" id="file-to-compress" required />
				<button type="submit" className="compress-btn" >Compress image</button>
			</form>
			{
				downloadLink &&
				<>
					<button className="basic-btn py-2 px-3" >
						<a href={downloadLink} download>
							Click here to download compressed image
						</a>
					</button>
					<div className="mt-4">
						<p>
							Previous Size: {
								<span>{prevSize} KB</span>
							}
						</p>
						<p>
							New Size: {
								<span>{fileMetadata.newSize / 1000} KB</span>
							}
						</p>
					</div>
				</>
			}
		</div>
	);
}

export default App;
