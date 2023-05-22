import { useState } from "react";
import Modal from "./components/modal";
import LinearBuffer from "./LinearBuffer";


const App = () => {
  const [images, setImages] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [bufferOpen, setBufferOpen] = useState(false);

  const surpriseOptions = [
    'A small mouse chasing a scared cat with a cartoon hammer',
    'A baseball player swinging a bat at the moon',
    'A sloth and a monkey swinging from jungle trees',
    'A turkey eating french fries in a nightclub',
    'Gigantic bumblebees pollinating an apple orchard',
    'Dinosaurs doing their taxes',
    'A cute dog flying a magic carpet'
  ];

  const surpriseMe = () => {
    setImages(null);
    const randomValue = surpriseOptions[Math.floor(Math.random() * surpriseOptions.length)];
    setInputValue(randomValue);
  }
  
  const getImages = async() => {
    setImages(null);
    if (inputValue === '') {
      setError('Error! Must have a search term.');
      return;     
    }
    try {
      setError(null);
      setBufferOpen(true);
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
      setBufferOpen(false);
      setImages(data);
    } catch (error) {
      console.error(error);
    }
  }

  const uploadImage = async (e) => {
    setBufferOpen(true);
    const formData = new FormData();
    formData.append('file', e.target.files[0]);
    setModalOpen(true);
    setSelectedImage(e.target.files[0]);
    e.target.value = null;
    try {
      const options = {
        method: "POST",
        body: formData
      }
      const response = await fetch('http://localhost:8000/upload', options)
      const data = await response.json();
      console.log(data)
      setBufferOpen(false);
    } catch (error) {
      console.error(error);
    }
  }

  const generateVariations = async () => {
    setImages(null)
    if (selectedImage === null) {
      setError('Error! Must have an existing image')
      setModalOpen(false)
      return
    }
    try {
      setError(null);
      setBufferOpen(true);
      const options = {
        method: 'POST'
      }
      const response = await fetch('http://localhost:8000/variations', options);
      setModalOpen(false);
      const data = await response.json();
      // console.log(data)
      setImages(data);
      setBufferOpen(false);

    } catch (error) {
      console.error(error);
    }
  }

  const clearInput = () => {
    setImages(null);
    setInputValue('');
    setError(null);
    setSelectedImage(null);
    setBufferOpen(false);
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
          <button className="clearBtn" onClick={ clearInput } >X</button>
          <button className="generateBtn" onClick={ getImages }>Generate</button>
        </div>
        <p className="extra-info">Or,
          <span>
            <label className="upload" htmlFor="files"> upload an image </label>
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
        { modalOpen && <div className="overlay">
          <Modal 
            setModalOpen={ setModalOpen }
            selectedImage={ selectedImage } 
            setSelectedImage={ setSelectedImage }
            generateVariations={ generateVariations }
            setBufferOpen={ setBufferOpen }
          />
        </div> }
      </section>
      <section className="image-section">
        { bufferOpen && (
          <>
            <p>ChatGPT is creating your images, hang tight!</p>
            <LinearBuffer />
          </>
        ) }
        { 
          images?.map((image, _index) => (
            <img 
              key={_index} 
              src={image.url} 
              alt={`Generated image of ${ inputValue }`} 
            />
          ))
        }
      </section>
    </div>
  )
}

export default App
