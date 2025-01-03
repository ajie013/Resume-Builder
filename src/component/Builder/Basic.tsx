import './styles/Basic.css';

interface basicType {
    fullName: string;
    contactNumber: string;
    address: string
    email: string;
    summary: string

}

interface basicProps{
    setBasicData: React.Dispatch<React.SetStateAction<basicType>>;
    basicData : basicType
}

const Basic: React.FC<basicProps> = ({setBasicData,basicData}) =>{

    return(
        <>  
            <div className='basic-info-wrapper'>
                <h2 className='basic-info-header'>Basic Information</h2>
               
                <input type="text" placeholder='Full Name' value={basicData.fullName} onChange={(e) => setBasicData(prev =>({...prev, fullName: e.target.value}))} />
             
                <input type="text" placeholder='Contact Number' value={basicData.contactNumber} onChange={(e) => setBasicData(prev =>({...prev, contactNumber: e.target.value}))} />
               
                <input type="text" placeholder='Address' value={basicData.address}  onChange={(e) => setBasicData(prev =>({...prev, address: e.target.value}))}/>
              
                <input type="text" placeholder='Email' value={basicData.email} onChange={(e) => setBasicData(prev =>({...prev, email: e.target.value}))}/>
              
                <textarea name="" id="" placeholder='Summary' value={basicData.summary} onChange={(e) => setBasicData(prev =>({...prev, summary: e.target.value}))}></textarea>
            </div>
            
        </>
    )
};


export default Basic