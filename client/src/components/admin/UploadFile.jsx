import React, { useState } from 'react'
import { toast } from 'react-toastify'
import Resize from 'react-image-file-resizer'
import { uploadFiles } from '../../api/product'
import useEcomStore from '../../store/ecom-store'

const UploadFile = ({form, setForm}) => {

    const [isLoading, setIsLoading] = useState(false)
    const token = useEcomStore((state)=>state.token)
    const handleOnchange = (e) => {

        const files = e.target.files
        if (files) {
            setIsLoading(true)
            let allFile = form.images
            for(let i = 0; i < files.length;i++){
                // console.log(files[i])

                const file = files[i]
                if(!file.type.startsWith('image/')){
                    toast.error(`File ${file.name} is not image`)
                    continue
                }

                //image Resize
                Resize.imageFileResizer(
                    files[i],
                    720,
                    720,
                    "JPEG",
                    100,
                    0,
                    (data)=>{
                        // endpoint Backend
                        uploadFiles(token,data)
                        .then((res)=>{
                            console.log(res)
                            allFile.push(res.data)
                            setForm({
                                ...form,
                                images:allFile
                            })
                            toast.success('Upload image Success!!!')
                        })
                        .catch((err)=>{
                            console.log(err)
                        })
                    },
                    "base64"
                )
                
            }

        }
    }
    return (
        <div>
            <input
                onChange={(handleOnchange)}
                type="file"
                name='images'
                multiple
            />

        </div>
    )
}

export default UploadFile