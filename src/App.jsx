import { useState } from "react";

const App = () => {
  const [images, setImages] = useState(null);
  const [inputValue, setInputValue] = useState(null);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);


  const surpriseOptions = [
    'A blue ostrich eating melon',
    'A matisse style shark on the telephone',
    'A pineapple sunbathing on an island'
  ];

  const surpriseMe = () => {
    setImages(null);
    const randomValue = surpriseOptions[Math.floor(Math.random() * surpriseOptions.length)];
    setInputValue(randomValue);
  }
  
  const getImages = async() => {
    setImages(null)
    if (inputValue === null) {
      setError('Error! Must have a search term.');
      return;     
    }
    try {
      const options = {
        method: "POST",
        body: JSON.stringify({
          message: inputValue
        }),
        headers: {
          "Content-Type": "application/json"
        }
      }
      const response = await fetch('http://localhost:8000/images', options);
      const data = await response.json()
      console.log(data);
      setImages(data);
    } catch (error) {
      console.error(error);
    }
  }

  const uploadImage = async (e) => {
    console.log(e.target.files)
    const formData = new FormData();
    formData.append('file', e.target.files[0]);
    setSelectedImage(e.target.files[0]);
    
    try {
      const options = {
        method: "POST",
        body: formData
      }
      const response = await fetch('http://localhost:8000/upload', options)
      const data = await response.json();
      console.log(data)

    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="app">
      <section className="search-section">
        <p>Start with a detailed description 
          <span className="surprise" onClick={ surpriseMe }>Surprise me</span>
        </p>
        <div className="input-container">
          <input 
            type="text" 
            placeholder="An impressionist oil painting of a sunflower in a purple vase..."
            onChange={ (e) => setInputValue(e.target.value) }
            value={ inputValue }
          />
          <button onClick={getImages}>Generate</button>
        </div>
        <p className="extra-info">Or,
          <span>
            <label htmlFor="files"> upload an image </label>
            <input 
              onChange={ uploadImage }
              type="file" 
              id="files" 
              accept="image/*" 
              hidden
            />
          </span>
           to edit.
        </p>
        { error && <p>{ error }</p> }
      </section>
      <section className="image-section">
        {images?.map((image, _index) => (
          <img 
            key={_index} 
            src={image.url} 
            alt={`Generated image of ${ inputValue }`} 
          />
        ))}
      </section>
    </div>
  )
}

export default App


// 4:00:22 https://www.youtube.com/watch?v=uRQH2CFvedY  