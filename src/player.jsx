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
  const [surah, setSurah] = useState(-1);

  const [no, setNo] = useState(-1)
  const [ayats, setAyats] = useState([])
  const [versesCount, setVersesCount] = useState(0)
  const [surahs, setSurahs] = useState([])
  const [audios, setAudios] = useState([])

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
    
    getSurahs()

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

  const getSurahs = () => {
    
    // setLoading(true);
    // setError("")
    // setAyats([])
    fetch('/tefsir.json') // This path is relative to the public folder
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to load JSON');
        }
        return response.json();
      })
      .then(async (jsonData) => {
        
        setSurahs(jsonData.slice(77,114))

        // Math.floor(Math.random() * (max - min + 1)) + min

        // let surano;
        // let audiono;
        // for(;;){          
        //   surano =  Math.floor(Math.random() * 114)
        //   audiono = Math.floor(Math.random() * jsonData[surano].courseIds.split(",").length)         
        //   // console.log(`attempt ${surano+1}`);
        //   // const key = `${jsonData[surano].title}` // audioNo
        //   try{
        //     console.log("attempt surah", jsonData[surano].title);
        //     console.log("attempt audio no", audiono+1);           
        //     const qu = query(collection(db, "Ayats"),where("surah","==", jsonData[surano].title),where("audioNo","==",`${audiono+1}`))  
        //     const ag  = await getCountFromServer(qu)
        //     console.log("attempt count", ag.data().count);            
        //     if(ag.data().count === 0){              
        //       break
        //     }
        //   }catch(e){
        //     console.log(e);
        //   }
        // }

        // fetch(`https://api.quran.com/api/v4/chapters/${surano+1}`).then((response)=>{
        //   if (!response.ok) {
        //     throw new Error('Network response was not ok');
        //   }
        //   response.json().then((e)=>{
        //     setVersesCount(Number(e.chapter.verses_count))
        //     console.log(e.chapter.verses_count);
        //   })
        // })
        // setAudio(jsonData[surano].courseIds.split(",")[audiono])
        // setTitle(jsonData[surano].title)
        // setNo(audiono + 1)
        console.log(jsonData[surano].courseIds.split(",")[audiono]);
        // setLoading(false);
      })
      .catch((err) => {
        setError(err)
        // setLoading(false);
      });
  }

  // Function to seek to a specific time
  const seekAudio = (newTime) => {
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
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
      setAyats([])
      setSurah(-1)
      setTitle("")
      setAudios("")
      setNo(-1)
      setAudio("")
      alert("This Audio has been done")
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
  const handleSurahChange = (event) => {
    setSurah(event.target.value)
    setTitle(surahs[event.target.value].title)
    setAudios(surahs[event.target.value].courseIds.split(","))
    setNo(-1)
    setAudio("")
    
    // console.log(event.target.value.title);
  };

  const handleAudioChange = (event) => {
    setNo(event.target.value)
    setAudio(surahs[surah].courseIds.split(",")[event.target.value -1])

    checkValidity(event.target.value)
  }

  const checkValidity = async (no) => {
    try{
      console.log("attempt surah", surahs[surah].title);
      console.log("attempt audio no", no);           
      const qu = query(collection(db, "Ayats"),where("surah","==", surahs[surah].title),where("audioNo","==",`${no}`))  
      const ag  = await getCountFromServer(qu)
      console.log("attempt count", ag.data().count);            
      if(ag.data().count === 0){              
        
      }else{
        setSurah(-1)
        setTitle("")
        setAudios("")
        setNo(-1)
        setAudio("")
        alert("This Audio has been done")
      }
    }catch(e){
      console.log(e);
    }
  }


  return (
    <div className='mt-10 flex flex-col items-center max-h-screen'>
      <div className='mt-10 mb-10 flex gap-2'>
        <select value={surah} onChange={handleSurahChange}>
          <option value={-1} key={0}>Select Surah</option>
          {
            surahs.map((e,i)=>
            <option value={i} key={i+1}>{e.title}</option>
            )
          }
        </select>

        {
          surah == -1 ?
          <div></div>:
          <select value={no} onChange={handleAudioChange}>
            <option value={-1} key={0}>Select Audio</option>
            {
              audios.map((e,i)=>
              <option value={i+1} key={i+1}>{i+1} Audio</option>
              )
            }
          </select>
        }
      </div>
      {
        loading ? <p>Loading</p> : <p></p>
      }
      <h2 className='text-3xl'>{title}</h2>
      {no !== -1 ? <p>{no}th Audio</p> : <div></div>}
      <audio className=' self-center' controls ref={audioRef} src={audio} />

      <div style={{
        paddingTop: '10px',
        display: 'flex', 
        gap: "5px", 
        justifyContent: "center", 
       }}>
        <button className='bg-slate-300 text-black' onClick={()=>{seekAudio(audioRef.current.currentTime - 5);}}>-5 sec</button>
       
        <button className='bg-slate-300 text-black' onClick={()=>{seekAudio(audioRef.current.currentTime - 3);}}>-3 sec</button>

        <button className='bg-slate-300 text-black' onClick={()=>{seekAudio(audioRef.current.currentTime + 3);}}>+3 sec</button>
       
        <button className='bg-slate-300 text-black' onClick={()=>{seekAudio(audioRef.current.currentTime + 5);}}>+5 sec</button>
      </div>
      <div className='flex-1 overflow-y-auto'>
        {
          ayats.map((e, i)=>
          <div key={i} className='flex mt-2 gap-1 items-center'>
            <p onClick={()=>{seekAudio(Number(e.start))}}>Jump</p>
            <div className='flex flex-col'>
              <input placeholder='Start' value={e.start ?? 0} className='w-24 border border-black p-2' type='number' onChange={(e)=>{updateData({...e, start: Math.floor(Number(e.target.value))}, i)}}/>
              <button 
                onClick={()=>updateData({...e, start: Math.floor(audioRef.current.currentTime)}, i)}  
                className='text-sm bg-green-200 text-black'>pick
              </button>
            </div>
            <input type="number" value={e.ayaName} className='w-12 border border-black p-2'  name="ayaNo" placeholder='Aya' id="ayaNo" onChange={(ev)=>{updateData({...e,ayaName: ev.target.value }, i);
            }}/>
            {/* <p> {e.end === "" ? "End" : e.end}</p> */}
            <div className='flex flex-col'>
              <input placeholder='End' value={e.end ?? 0} className='w-24 border border-black p-2' type='number' onChange={(e)=>{updateData({...e, end: Math.floor(Number(e.target.value))}, i)}}/>
              <button 
                onClick={()=>updateData({...e, end: Math.floor(audioRef.current.currentTime)}, i)}  
                className='text-sm bg-green-200 text-black'>pick
              </button>
            </div>
            <button onClick={()=>deleteItem(i)} className='text-sm bg-red-300'>Delete</button>
          </div>
        )
        }
      </div>
    { loading ? <div></div> : <button className='bg-blue-50 text-black w-20 mt-6' onClick={()=>{addAya()}}>Add</button>}
    { loading ? <div></div> : <button className='bg-green-300 text-black mt-10 w-32' onClick={()=>{saveData()}}>Save</button>}
    </div>
  );
}

export default AudioPlayer;
