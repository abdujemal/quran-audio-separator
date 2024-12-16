import React, { useState, useRef, useEffect } from 'react';
import { setDoc, getDocs, collection, doc, getCountFromServer, where, query } from 'firebase/firestore'
import { app, db } from './firebase';

function AudioPlayer() {
  // Reference to the audio element
  const audioRef = useRef(null);

  // State to control audio status (play/pause) and other properties
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1); // Volume: 0 to 1
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [audio, setAudio] = useState("");
  const [title, setTitle] = useState("");
  const [no, setNo] = useState(0)
  const [ayats, setAyats] = useState([])
  const [versesCount, setVersesCount] = useState(0)

  // Update current time when audio is playing
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
    
    getAudio()

    // Clean up the event listener when the component unmounts
    return () => {
      audio.removeEventListener('timeupdate', updateCurrentTime);
    };
  }, []);

  // Function to play the audio
  const playAudio = () => {
    audioRef.current.play();
    setIsPlaying(true);
  };

  // Function to pause the audio
  const pauseAudio = () => {
    audioRef.current.pause();
    setIsPlaying(false);
  };

  // Function to stop the audio (pause and reset to start)
  const stopAudio = () => {
    audioRef.current.pause();
    audioRef.current.currentTime = 0; // Reset audio to the beginning
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const getAudio = () => {
    
    setLoading(true);
    setError("")
    setAyats([])
    fetch('/tefsir.json') // This path is relative to the public folder
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to load JSON');
        }
        return response.json();
      })
      .then(async (jsonData) => {
        
        // Math.floor(Math.random() * (max - min + 1)) + min

        let surano;
        let audiono;
        for(;;){           
          
          surano =  Math.floor(Math.random() * 114)
          audiono = Math.floor(Math.random() * jsonData[surano].courseIds.split(",").length)
          
          // console.log(`attempt ${surano+1}`);
          // const key = `${jsonData[surano].title}` // audioNo

          try{

            console.log("attempt surah", jsonData[surano].title);
            console.log("attempt audio no", audiono+1);
            

            
            const qu = query(collection(db, "Ayats"),where("surah","==", jsonData[surano].title),where("audioNo","==",`${audiono+1}`))
  
            const ag  = await getCountFromServer(qu)
            console.log("attempt count", ag.data().count);
            
            if(ag.data().count === 0){
              
              break
            }
          }catch(e){
            console.log(e);

          }


        }



        fetch(`https://api.quran.com/api/v4/chapters/${surano+1}`).then((response)=>{
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          response.json().then((e)=>{
            setVersesCount(Number(e.chapter.verses_count))
            console.log(e.chapter.verses_count);
          })
        })
        setAudio(jsonData[surano].courseIds.split(",")[audiono])
        console.log(jsonData[surano].courseIds.split(",")[audiono]);
        setTitle(jsonData[surano].title)
        setNo(audiono + 1)
        setLoading(false);
      })
      .catch((err) => {
        setError(err)
        setLoading(false);
      });
  }

  // Function to seek to a specific time
  const seekAudio = (newTime) => {
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  // Function to handle volume change
  const handleVolumeChange = (event) => {
    const newVolume = event.target.value;
    audioRef.current.volume = newVolume;
    setVolume(newVolume);
  };

  // Function to handle progress bar change
  const handleProgressBarChange = (event) => {
    const newTime = event.target.value;
    seekAudio(newTime);
  };

  const addAya = ()=>{
    setAyats([...ayats,{id: "", ayaName: ayats.length == 0 ? "" : `${Number(ayats[ayats.length -1].ayaName) + 1}`, surah: `${title}`, audioNo: `${no}`, start: "", end: ""}])
  }

  const updateData = (data, index)=> {
    setAyats(e=>
      e.map((item, i)=>
        i === index ? {...data, id: `${data.surah}${data.ayaName}`} : item
      )
    )
  } 
  
  const deleteItem = (index) => {
    setAyats(prevItems => 
      prevItems.filter((item, i) => i !== index)
    );
  };

  const saveData = async () => {
    setLoading(true)
    try{
      for(var i in ayats.filter(e=>e.id !== "")){
        const docref = doc(db, "Ayats",`${ayats[i].id}`)
        await setDoc(docref, ayats[i])
      }
  
      alert("Successfully added")
      getAudio()
      setLoading(false)
    }    
    catch(e){
      setLoading(false)
      alert(e)
    }
  }

  // if (loading) {
  //   return <div>Loading...</div>;
  // }

  // if (error) {
  //   return <div>Error: {error}</div>;
  // }

  return (
    <div className='mt-10 flex flex-col items-center'>
      {/* The audio element */}
      {
        loading ? <p>Loading</p> : <p></p>
      }
      <h2 className='text-3xl'>{title}</h2>
      <p>{no}th Audio</p>
      <audio className=' self-center' controls ref={audioRef} src={audio} />

      <div style={{
        paddingTop: '10px',
        display: 'flex', 
        gap: "5px", 
        justifyContent: "center", 
       }}>
        <button className='bg-slate-300' onClick={()=>{seekAudio(audioRef.current.currentTime - 5);}}>-5 sec</button>
       
        <button className='bg-slate-300' onClick={()=>{seekAudio(audioRef.current.currentTime - 3);}}>-3 sec</button>

        <button className='bg-slate-300' onClick={()=>{seekAudio(audioRef.current.currentTime + 3);}}>+3 sec</button>
       
        <button className='bg-slate-300' onClick={()=>{seekAudio(audioRef.current.currentTime + 5);}}>+5 sec</button>
      </div>
      <div className='flex-1'>
        {
          ayats.map((e, i)=>
          <div key={i} className='flex mt-2 gap-1 items-center'>
            <p onClick={()=>{seekAudio(Number(e.start))}}> {e.start === "" ? "Start" : e.start}</p>
            <button 
              onClick={()=>updateData({...e, start: Math.floor(audioRef.current.currentTime)}, i)}  
              className='text-sm bg-green-200'>pick
            </button>
            <input type="number" value={e.ayaName} className='w-12 border border-black p-2'  name="ayaNo" placeholder='Aya' id="ayaNo" onChange={(ev)=>{updateData({...e,ayaName: ev.target.value }, i);
            }}/>
            <p> {e.end === "" ? "End" : e.end}</p>
            <button 
              onClick={()=>updateData({...e, end: Math.floor(audioRef.current.currentTime)}, i)}  
              className='text-sm bg-green-200'>pick
            </button>
            <button onClick={()=>deleteItem(i)} className='text-sm bg-red-300'>Delete</button>
          </div>
        )
        }
      </div>
     { loading ? <div></div> : <button className='bg-blue-50 w-20 mt-2' onClick={()=>{addAya()}}>Add</button>}
    { loading ? <div></div> : <button className='bg-green-300 mt-10 w-32' onClick={()=>{saveData()}}>Save</button>}
    </div>
  );
}

export default AudioPlayer;
