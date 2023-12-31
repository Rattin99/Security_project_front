
import {useRef, useState} from 'react';

export default function Home() {

  const [algo,setAlgo] = useState('AES-128-CBC')
  const [opt,setOpt] = useState("")
  const [file,setFile] = useState(null)
  const [encryptedFileInfo, setEncryptedFileInfo] = useState(null)
  const [text,setText] = useState(null)
  const [textEncryptData,setTextEncryptData] = useState(null)
  
  const textAreaRef = useRef()

  const handleSubmit = async (e:any) => {
    e.preventDefault();
    
    let a = algo;
    if(a == 'RSA' || a =='DH' || a == 'Substitution' || a == 'Elgamal' ) {a = 'AES-128-CBC'}

    console.log(a)

    const formData = new FormData();

    formData.append("file",file,file.name,a);

    const url = `http://localhost:5000/file/${a}`
    const res = await fetch(url,{
      method: 'POST',
      body: formData
    })

    const response = await res.json();

  
    setEncryptedFileInfo(response)
    console.log(response)

  }
  const changeHandler = (e:any) => {
    setFile(e.target.files[0])
  }

  const selectHandler = (e:any) => {
    setOpt(e.target.value)
  }

  const decryptHandler = async (e:any) => {

    let a = algo;
    if(a == 'RSA' || a =='DH' || a == 'Substitution' || a == 'Elgamal' ) {a = 'AES-128-CBC'}
   
    const b = {
      filepath: encryptedFileInfo.filePath,
      fileName: encryptedFileInfo.fileName,
      algo: a
    }
    const res = await fetch("http://localhost:5000/dec",{
      method: 'POST',
      body: JSON.stringify(b),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    })

    const response = await res.json();

    if(response.status === 'decryption done'){
      setEncryptedFileInfo(null)
    }
  }

  const algoHandler = (e:any) => {
    setAlgo(e.target.value)
    console.log(e.target.value)
  }

  const textChangeHandler = (e:any) => {
    setText(e.target.value)
  }
  const textSubmitHandler = async (e:any) => {
    const res = await fetch("http://localhost:5000/text",{
      method: 'POST',
      body: JSON.stringify({
        text,algo
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    })
    const response = await res.json()

    console.log(response)

    textAreaRef.current.value = response.encryptedText

    setTextEncryptData(response)
    
  }


   const textDecryptHandler = async (e:any) => {
    const res = await fetch("http://localhost:5000/textd",{
      method: 'POST',
      body: JSON.stringify({...textEncryptData,algo}),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    })
    const response = await res.json()

    textAreaRef.current.value = response.decryptedData 

    setTextEncryptData(null)
   }

  return (
    <div className=' w-full h-full  flex flex-col items-center bg-black'>
      <div className='mx-auto my-20'>
          <select name='dropdown' className='m-auto p-2 px-24 rounded white' onChange={algoHandler} >
            <option>AES-128-CBC</option>
            <option>AES-128-CFB</option>
            <option>AES-128-ECB</option>
            <option>AES-128-OFB</option>
            <option value="AES-128-CBC">DES-EDE-CBC</option>
            <option value="RSA">RSA</option>
            <option value="DH">Hill Cipher</option>
            <option value="Substitution">Substitution</option>
            <option value="Elgamal">Elgamal</option>
          </select>
      </div>
      <div className='mx-auto my-20'>
          <select name='dropdown' className='m-auto p-2 px-24 rounded white' onChange={selectHandler} >
            <option>video</option>
            <option>image</option>
            <option>text</option>
            <option>audio</option>
          </select>
      </div>
      {opt !== 'text' && opt !== '' && (
         <div className='flex flex-col items-center mx-auto'>
            <div className="flex flex-col items-center ">
              <form className='p-10 text-white flex flex-col items-center'>
                  <input name='file' type='file' onChange={changeHandler}/>
              </form>
              <button className='border bg-white text-black p-3 rounded' onClick={handleSubmit}>submit</button>
            </div>
          </div>
      )}
      {
        opt === 'text' && (
          <div>
              <div className='bg-white rounded '>
                <div>
                  <textarea className='p-11'
                  ref={textAreaRef} onChange={textChangeHandler}></textarea>
                </div>
              </div>
              <div className='flex justify-center items-center'>
                {
                  textEncryptData ?(
                    <button className='border bg-white text-black p-3 rounded my-3' onClick={textDecryptHandler}>decrypt</button>
                  ) : 
                  (
                    <button className='border bg-white text-black p-3 rounded my-3'  onClick={textSubmitHandler}>submit</button>
                  )
                }

              </div>
          </div>
        )
      }
      {
        encryptedFileInfo && (
          <div>
             <h1 className='text-white my-10'>encryption complete</h1>
             <button className='border bg-white text-black p-3 rounded my-3' onClick={decryptHandler}>decrypt last file</button>
          </div>
        )
      }
    </div>
  )
}
