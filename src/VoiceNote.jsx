import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';


const VoiceNote = ({fetchNotes}) => {
    const [isRecording, setIsRecording] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [inputText, setInputText] = useState('');
    const [error, setError] = useState(null);

    const recognitionRef = useRef(null);
    const timeoutRef = useRef(null);

    useEffect(() => {
        if ('webkitSpeechRecognition' in window) {
            const recognition = new webkitSpeechRecognition();
            recognition.lang = 'en-US';
            recognition.interimResults = false;
            recognition.maxAlternatives = 1;

            recognition.onresult = (e) => setTranscript(prev => prev + ' ' + e.results[0][0].transcript);
            recognition.onerror = (e) => {
                console.error('Speech recognition error:', e.error);
                setError(e.error);
                setIsRecording(false);
            };

            recognitionRef.current = recognition;
        } else {
            setError('Speech Recognition API not supported in this browser.');
        }

        return () => clearTimeout(timeoutRef.current);
    }, []);

    const saveNote = async (text) => {
        try {
            const token = localStorage.getItem("token");
            const { data } = await axios.post('https://notesapp-be-lphc.onrender.com/content/notes', 
                { text }, 
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchNotes(); 
        } catch (err) {
            console.error('Failed to save note:', err);
        }
    };

    const handleRecording = async () => {
        if (isRecording) {
            recognitionRef.current.stop();
            clearTimeout(timeoutRef.current);
            setIsRecording(false);
            if (transcript.trim()) await saveNote(transcript);
            setTranscript('');
        } else {
            setTranscript('');
            recognitionRef.current.start();
            setIsRecording(true);
            timeoutRef.current = setTimeout(() => {
                recognitionRef.current.stop();
                setIsRecording(false);
            }, 60000);
        }
    };

    const handleKeyDown = async (e) => {
        if (e.key === 'Enter' && inputText.trim()) {
            await saveNote(inputText);
            setInputText('');
        }
    };

    return (
        <>
            <div className='fixed bottom-14 left-100 right-40'>
                <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={handleKeyDown}  
                    className="w-full p-3 pl-25 border border-gray-300 rounded-full focus:outline-none"  
                    placeholder="Type here or use voice input..."
                />
                <img src="https://raw.githubusercontent.com/Sangavi002/NotesApp_img/refs/heads/main/text.png" alt="search" width="3%" className="ml-8 -mt-9" />
                <img src="https://raw.githubusercontent.com/Sangavi002/NotesApp_img/refs/heads/main/image.png" alt="search" width="3%" className="ml-17 -mt-5" />
                
                {error && <p className="text-red-500">Error: {error}</p>}

                <div className="flex justify-end -mt-7 mr-3">
                    <button 
                        onClick={handleRecording} 
                        className={`${
                        isRecording ? 'bg-gray-500' : 'bg-red-500'
                        } pt-2 pb-2 pl-4 pr-4 rounded-full text-white text-sm `}
                    >
                        {isRecording ? 'Stop Recording' : 'Start Recording'}
                    </button>
                </div>
            </div>
        </>
    );
};

export default VoiceNote;
