import React, { useState,useEffect } from 'react';
import axios from 'axios';

const EditTranscriptModal = ({ content, noteId, onClose, onSave }) => {
  const [editedContent, setEditedContent] = useState(content);

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `https://notesapp-be-lphc.onrender.com/content/notes/${noteId}`,
        { text: editedContent },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onSave(editedContent);
      onClose();
    } catch (error) {
      console.error('Error updating transcript:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-300 bg-opacity-10 flex justify-center items-center">
      <div className="bg-white p-6 rounded shadow-md w-1/2">
        <h2 className="font-bold text-lg mb-4">Edit Transcript</h2>
        <textarea
          value={editedContent}
          onChange={(e) => setEditedContent(e.target.value)}
          className="w-full h-40 p-2 border border-gray-300 rounded"
        ></textarea>

        <div className="flex justify-end gap-2 mt-4">
          <button onClick={handleSave} className="bg-green-500 text-white px-4 py-2 rounded">Save</button>
          <button onClick={onClose} className="bg-red-500 text-white px-4 py-2 rounded">Close</button>
        </div>
      </div>
    </div>
  );
};

const Modal = ({ content, date, time, noteId, title, image, onClose, onUpdate }) => {
  const [modalContent, setModalContent] = useState(content);
  const [modalTitle, setModalTitle] = useState(title || " ");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [modalImages, setModalImages] = useState(image || []);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleExpandToggle = () => {
    setIsFullScreen((prev) => !prev);
  };

  const handleFavoriteToggle = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `https://notesapp-be-lphc.onrender.com/content/favorites/${noteId}`,
        { favorite: !isFavorite },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIsFavorite((prev) => !prev);
    } catch (error) {
      setIsLoading(false);
      console.error('Error updating favorite status:', error);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");  
      const formData = new FormData();
  
      formData.append('title', modalTitle);
      formData.append('text', modalContent);
      formData.append('userId', userId);
  
      const newImages = modalImages.filter(img => img instanceof File);
      const existingImages = modalImages.filter(img => typeof img === 'string');
  
      newImages.forEach(image => formData.append('images', image));
      formData.append('existingImages', JSON.stringify(existingImages));
  
      console.log('New Images:', newImages);
      console.log('Existing Images:', existingImages);
  
      const response = await axios.put(
        `https://notesapp-be-lphc.onrender.com/content/notes/${noteId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
  
      alert('Note updated successfully');
      onUpdate(response.data.updatedNote); 
      onClose();
    } catch (error) {
      console.error('Error updating note:', error.response?.data || error.message);
    }
  };
  
  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length + modalImages.length > 5) {
      alert('You can only upload up to 5 images.');
      return;
    }
    setModalImages((prevImages) => [...prevImages, ...selectedFiles]);
  };

  const handleRemoveImage = (index) => {
    setModalImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const handleImageClick = (src) => {
    window.open(src, '_blank');
  };

  const handleTranscriptSave = (newContent) => {
    setModalContent(newContent);
  };

  return (
    <div className="fixed inset-0 bg-gray-100 bg-opacity-100 flex justify-center items-center">
      <div className={`${isFullScreen ? 'w-full h-full' : 'w-1/2'} bg-white p-6 rounded shadow-md transition-all duration-300 overflow-auto`}>
        <div className='flex flex-row gap-4 justify-between h-8'>
        <button onClick={handleExpandToggle} className='bg-gray-100  rounded-full'>
            <img src="https://raw.githubusercontent.com/Sangavi002/NotesApp_img/refs/heads/main/full.png" alt="expand" width="50%" className='ml-auto mr-auto' />
          </button>
          <div className=' flex flex-row gap-4 justify-end'>
              <button onClick={handleFavoriteToggle} className={`p-2 rounded-full ${isFavorite ? 'bg-yellow-400' : 'bg-gray-200'}`}>
                <img src="https://raw.githubusercontent.com/Sangavi002/NotesApp_img/refs/heads/main/fav.png" alt="favourite" width="50%" className='ml-auto mr-auto' />
              </button>
              <button
                  onClick={onClose}
                  className="-mt-2 text-gray-300 font-bold text-3xl rounded"
                >
                  x
              </button>
          </div>
        </div>
        <div className="flex flex-row gap-5 items-center w-full -mt-2">
          <input
            value={modalTitle}
            onChange={(e) => setModalTitle(e.target.value)}
            className="border-none  w-1/2 font-bold text-2xl mt-1"
            placeholder="Title for notes"
          />
          <button className='border-none'>
            <img src="https://raw.githubusercontent.com/Sangavi002/NotesApp_img/refs/heads/main/text.png" alt="edit" width="40%"/>
          </button>
        </div>

        <div className="flex flex-row gap-5 text-sm text-gray-500 ">
          <p>{date}</p>
          <p>{time}</p>
        </div>

        <div className="w-full p-2 border border-gray-300 rounded mt-5">
          <h6 className="font-bold">Transcript</h6>
          <p className="mt-2 whitespace-nowrap overflow-hidden">{modalContent}</p>
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="text-gray-300 underline mt-2"
          >
            Read More
          </button>
        </div>

        <div className='border border-gray-300 mt-2 p-2'>
          <h6 className="font-bold">Upload Images (Max 5)</h6>
          <div className="flex gap-2 flex-wrap mt-2">
          {modalImages.map((image, index) => (
    <div
        key={index}
        className="relative cursor-pointer"
        onClick={() => handleImageClick(typeof image === 'string' ? image : URL.createObjectURL(image))}
    >
        <img
            src={typeof image === 'string' ? image : URL.createObjectURL(image)}
            alt={`preview-${index}`}
            className="w-20 h-20 object-cover rounded"
        />
        <button
            onClick={(e) => { e.stopPropagation(); handleRemoveImage(index); }}
            className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center"
        >
            ×
        </button>
    </div>
))}

            {modalImages.length < 5 && (
              <label className="w-20 h-20 flex items-center justify-center border border-dashed border-gray-400 rounded cursor-pointer">
                + Image
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            )}
          </div>
        </div>

        <button
          onClick={handleSave}
          className="mt-4 bg-green-500 text-white px-4 py-2 rounded"
        >
          Save
        </button>

        

        {isEditModalOpen && (
          <EditTranscriptModal
            content={modalContent}
            noteId={noteId}
            onClose={() => setIsEditModalOpen(false)}
            onSave={handleTranscriptSave}
          />
        )}
      </div>
    </div>
  );
};

export default Modal;
