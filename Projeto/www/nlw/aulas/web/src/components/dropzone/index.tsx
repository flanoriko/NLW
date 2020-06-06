import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { FiUpload } from 'react-icons/fi'
import './styles.css';

//definindo uma propriedade que é uma função!
interface Props{
    onFileUploaded:(file: File) => void;
}
//cria esses elementos para poder enviar informaões de um componente pra outro
const Dropzone: React.FC<Props> = ({onFileUploaded}) => {
    

    const [selectedFileUrl, setSelectedFileUl] = useState('');


    const onDrop = useCallback(acceptedFiles => {
        // Do something with the files
        const file = acceptedFiles[0];
        const fileUrl = URL.createObjectURL(file);
        setSelectedFileUl(fileUrl);
        onFileUploaded(file);

    }, [onFileUploaded]) //vai funcionar sempre que fizer upload, sempre que mudar
    const { getRootProps, getInputProps } = useDropzone({ onDrop, accept: "image/*" })

    return (
        <div className="dropzone" {...getRootProps()}>
            <input {...getInputProps()} accept="image/*" />
            {
                selectedFileUrl
                    ? <img src={selectedFileUrl} alt="Point Thumbnail" />
                    : (
                        <p>
                            <FiUpload></FiUpload>
                        jogue as imagens!
                        </p>

                    )
            }
        </div>
    )
}

export default Dropzone;