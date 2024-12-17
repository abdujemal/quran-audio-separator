import { collection, getDocs, query, where } from 'firebase/firestore'
import React, { useEffect, useRef, useState } from 'react'
import { db } from './firebase'

const Evaluate = () => {
    const audioRef = useRef(null);

    const surahs = Array.from({ length: 114 }, (_, index) => `Surah ${index + 1}`);
    const [surah, setSurah] = useState(-1)
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [ayats,setAyats] = useState([])
    const [audio, setAudio] = useState(-1)
    const [audios, setAudios] = useState([])
    const [loading, setLoading] = useState(false);
    const [selectedSura, setSelectedSura] = useState({})

    useEffect(() => {

        const audio = audioRef.current;
    
        // Set duration once audio metadata is loaded
        audio.onloadedmetadata = () => {
          setDuration(audio.duration);
        };
    
        // Update currentTime while audio is playing
        const updateCurrentTime = () => {
          setCurrentTime(audio.currentTime);
        };
    
        audio.addEventListener('timeupdate', updateCurrentTime);
        
    
        // Clean up the event listener when the component unmounts
        return () => {
          audio.removeEventListener('timeupdate', updateCurrentTime);
        };
      }, []);

   const getSurah = (index) =>{
    fetch('/tefsir.json') // This path is relative to the public folder
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to load JSON');
        }
        return response.json();
      })
      .then(async (jsonData) => {
        
        setSelectedSura(jsonData[index])
        console.log(index);
        setAudio(-1)
        setAudios(jsonData[index].courseIds.split(","))
        console.log(jsonData[index]);
        // setLoading(false);
      })
      .catch((err) => {
        console.log(err)
        // setLoading(false);
      });
   }

   const getAyats = async (audioNo) => {
    try{
        setLoading(true)
        setAyats([])
        
        const qu = query(collection(db, "Ayats"),where("surah","==", selectedSura.title),where("audioNo","==",`${audioNo+1}`))
        const qs = await getDocs(qu)
        setAyats(qs.docs.map((e)=>e.data()))
        console.log(qs.docs.length);
        
        setLoading(false)
    }catch(e){
        console.log(e);
        setLoading(false)        
    }
   }

    const handleSurahChange = (e) =>{
        setSurah(Number(e.target.value))
        getSurah(Number(e.target.value))

    }

    const handleAudioChange = (e) => {
        console.log(audios[Number(e.target.value)])
        setAudio(Number(e.target.value))
        getAyats(Number(e.target.value))
    }

    const seekAudio = (newTime) => {
        audioRef.current.currentTime = newTime;
        setCurrentTime(newTime);
      };

    return (
        <div className='flex flex-col items-center'>
            <h1 className='pb-2'>Evaluation</h1>
            {loading ?  <p>Loading...</p>:<p></p>}
            <div className='flex gap-2 pt-8 pb-8'>
                
                <select value={surah} onChange={handleSurahChange}>
                    <option value={-1} key={0}>Select Surah</option>
                    {
                        surahs.map((e,i)=>
                            <option key={i} value={i}>
                                {e}
                            </option>
                        )
                    }
                </select>
                {
                surah == -1 ?
                <div></div>:
                <select value={audio} onChange={handleAudioChange}>
                    <option value={-1} key={0}>Select Audio</option>
                    {
                        audios.map((e,i)=>
                        <option value={i} key={i+1}>{i+1} Audio</option>
                        )
                    }
                </select>
                }
            </div>
            <h2 className='text-3xl'>{selectedSura?.title}</h2>
            {audio !== -1 ? <p>{Number(audio) + 1}th Audio</p> : <div></div>}
            <audio className=' self-center' controls ref={audioRef} src={audios[audio]} />
            <div className='pt-5 flex flex-col'>
                {    

                    ayats.length == 0 ?
                    <p>No Ayats</p>:
                    ayats.map((e, i)=>
                      <div className='flex gap-3 items-center' key={i}>
                       <p>Aya {e.ayaName}</p>
                       <button onClick={()=>{seekAudio(Number(e.start))}}>Seek</button>
                      </div>
                    )
                }
            </div>
        </div>
    )
}

export default Evaluate
