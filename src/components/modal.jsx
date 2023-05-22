import { useRef, useState } from "react";

const Modal = ({ setModalOpen, selectedImage, setSelectedImage, generateVariations, setBufferOpen }) => {
  const [error, setError] = useState(null);
  const ref = useRef(null);

  console.log('selectedImage ', selectedImage)

  const closeModal = () => {
    setModalOpen(false);
    setSelectedImage(null);
  }

  const checkSize = () => {
    if (ref.current.width == 256 && ref.current.height == 256) {
      generateVariations();
      closeModal();
    } else {
      setError('Error: Choose 256 x 256 image');
      setBufferOpen(false);
    }
  }
  // image compression/size
 // 


  return (
    <div className="modal">
      <div onClick={ closeModal }>&#128942;</div>
      <div className="img-container">
        { selectedImage && <img 
          src={ URL.createObjectURL(selectedImage) } 
          alt="uploaded image" 
          ref={ ref }
          /> 
        }
      </div>
      <p>{ error || "* Image must be 256 x 256" }</p>
      { !error && <button onClick={ checkSize } >Generate</button> }
      { error && <button onClick={ closeModal } >Close this and try again</button> }
    </div>
  )
}

export default Modal
