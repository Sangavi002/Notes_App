import VoiceNote from './VoiceNote';
import { useNavigate,useLocation } from 'react-router-dom';
import { useEffect,useState } from 'react';
import axios from 'axios';
import Modal from './Modal';

const HomePage = () => {
    const navigate = useNavigate();
    const location = useLocation(); 
    const [loading, setLoading] = useState(true);
    const [notes, setNotes] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    const [modalContent, setModalContent] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [modalDate, setModalDate] = useState('');
    const [modalTime, setModalTime] = useState('');
    const [selectedNoteId, setSelectedNoteId] = useState(null);
    const [modalTitle, setModalTitle] = useState('');
    const [modalImages, setModalImages] = useState([]);

    const fetchNotes = async () => {
        try {
            const token = localStorage.getItem("token");
            const { data } = await axios.get('https://notesapp-be-lphc.onrender.com/content/notes', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNotes(data);
        } catch (err) {
            console.error('Error fetching notes:', err);
        }finally {
            setLoading(false);
        }};

    useEffect(() => { fetchNotes(); }, []);

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text).then(() => {
          alert('Text copied to clipboard!');
        });
    };

    const handleExpand = (content, date, time, noteId,title,image) => {
        setModalContent(content);
        setModalDate(date);
        setModalTime(time);
        setSelectedNoteId(noteId);
        setModalTitle(title)
        setModalImages(image)
        setIsModalOpen(true);
      };

    const handleDelete = async (noteId) => {
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`https://notesapp-be-lphc.onrender.com/content/notes/${noteId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNotes((prevNotes) => prevNotes.filter((note) => note._id !== noteId));
        } catch (err) {
            console.error('Error deleting note:', err);
        }
    };

    const filteredNotes = notes.filter(note =>
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.text.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const updateNoteInState = (updatedNote) => {
        setNotes((prevNotes) =>
          prevNotes.map((note) => (note._id === updatedNote._id ? updatedNote : note))
        );
      };

    return (
        <div className="flex flex-row gap-5 min-h-screen p-5">
            <div className="border-1 w-1/4 p-4 rounded-xl" style={{ borderColor: '#d7d7d5' }}>
                <div className="flex flex-row gap-2">
                    <img src="https://raw.githubusercontent.com/Sangavi002/NotesApp_img/refs/heads/main/logo.jpeg" alt="logo" width="13%" />
                    <h1 className="font-bold">AI Notes</h1>
                </div>
                <hr className="mt-3" style={{ color: '#d7d7d5' }} />
                <div className={`flex flex-row gap-2 mt-5 p-2 rounded ${location.pathname === '/home' ? 'bg-purple-300' : ''}`}>
                    <img src="https://raw.githubusercontent.com/Sangavi002/NotesApp_img/refs/heads/main/home.png" alt="home" width="13%" />
                    <button onClick={() => navigate("/home")} className={`font-bold ${location.pathname === '/home' ? 'text-purple-500' : 'text-gray-300'}`}>Home</button>
                </div>

                <div className={`flex flex-row gap-2 mt-2 p-2 rounded ${location.pathname === '/favorite' ? 'bg-purple-300 text-purple-500' : ''}`}>
                    <img src="https://raw.githubusercontent.com/Sangavi002/NotesApp_img/refs/heads/main/star.png" alt="fav" width="13%" />
                    <button onClick={() => navigate("/favorite")} className={`font-bold ${location.pathname === '/favorite' ? 'text-purple-500' : 'text-gray-300'}`}>Favourites</button>
                </div>
                <div className="mt-2">
                    <button onClick={() => navigate("/login")} className="font-bold text-gray-300">Logout</button>
                </div>
            </div>
            <div className="w-3/4 p-4 relative">
                <div className="relative">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search"
                        className="w-3/4 p-2 pl-10 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <img src="https://raw.githubusercontent.com/Sangavi002/NotesApp_img/refs/heads/main/search.png" alt="search" width="2%" className="ml-4 -mt-7" />
                </div>
                <div className="mb-4 flex flex-nowrap gap-5 overflow-x-auto" style={{"scrollbar-width": "none"}}>
                {loading ? (
                        <div className="flex justify-center items-center w-full h-screen">
                            <div className="text-center">
                                <div className="w-12 h-12 border-4 border-green-500 border-dashed rounded-full animate-spin"></div>
                                <p className="mt-2 text-gray-600">Loading...</p>
                            </div>
                        </div>
                    ) : (
                        filteredNotes.length > 0 ? (
                            filteredNotes.map((note) => {
                                const dateObj = new Date(note.createdAt);
                                const date = dateObj.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
                                const time = dateObj.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'Asia/Kolkata' });

                                return (
                                    <div key={note._id} className="border border-gray-300 p-5 rounded w-60 mt-10 h-80 flex-shrink-0">
                                        <div className="text-sm text-gray-500 flex flex-row gap-3">
                                            <p>{date}</p>
                                            <p>{time}</p>
                                        </div>
                                        <h6 className='font-bold h-6'>{note.title}</h6>
                                        <p className="text-md h-54 overflow-hidden mt-1">{note.text}</p>
                                        <div className='flex flex-row justify-end mt-1'>
                                            <button onClick={() => handleCopy(note.text)}>
                                                <img src="https://raw.githubusercontent.com/Sangavi002/NotesApp_img/refs/heads/main/copy.png" alt="copy" width="15%" className='ml-30'/>
                                            </button>
                                            <button onClick={() => handleDelete(note._id)}>
                                                <img src="https://raw.githubusercontent.com/Sangavi002/NotesApp_img/refs/heads/main/delete.png" alt="delete" width="70%" className='mr-2'/>
                                            </button>
                                            <button onClick={() => handleExpand(note.text,date,time,note._id,note.title,note.images)}>
                                                <img src="https://raw.githubusercontent.com/Sangavi002/NotesApp_img/refs/heads/main/expand.png" alt="expand" width="100%" className='-mr-7'/>
                                            </button>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <p className="text-gray-400 mt-10">No notes found.</p>
                        )
                    )}
                </div>
                {isModalOpen && <Modal content={modalContent} date={modalDate} time={modalTime}  noteId={selectedNoteId} title={modalTitle} image={modalImages} onClose={() => setIsModalOpen(false)} onUpdate={updateNoteInState}  />}
                {!isModalOpen && <VoiceNote fetchNotes={fetchNotes} />}
            </div>
        </div>
    );
};

export default HomePage;