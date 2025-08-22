import React, { useState } from 'react'
import { toast } from 'react-toastify'
import Resize from 'react-image-file-resizer'
import { removeFiles, uploadFiles } from '../../api/product'
import useEcomStore from '../../store/ecom-store'
import { Loader } from 'lucide-react';

const UploadFile = ({ form, setForm }) => {

    const [isLoading, setIsLoading] = useState(false)
    const token = useEcomStore((state) => state.token)

    const handleOnchange = (e) => {
        setIsLoading(true)
        const files = e.target.files
        if (files) {
            setIsLoading(true)
            let allFile = form.images
            for (let i = 0; i < files.length; i++) {
                // console.log(files[i])

                const file = files[i]
                if (!file.type.startsWith('image/')) {
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
                    (data) => {
                        // endpoint Backend
                        uploadFiles(token, data)
                            .then((res) => {
                                console.log(res)
                                allFile.push(res.data)
                                setForm({
                                    ...form,
                                    images: allFile
                                })
                                setIsLoading(false)
                                toast.success('Upload image Success!!!')
                            })
                            .catch((err) => {
                                console.log(err)
                                setIsLoading(false)
                                
                            })
                    },
                    "base64"
                )

            }

        }
    }
    // console.log(form)
    const handleDelete = (public_id) => {
        const images = form.images
        removeFiles(token, public_id)
            .then((res) => {

                const filterImages = images.filter((item, index) => {
                    // console.log(item)
                    return item.public_id !== public_id
                })

                setForm({
                    ...form,
                    images: filterImages
                })
                toast.error(res.data)
            })
            .catch((err) => {
                console.log(err)
            }
            )
    }
    return (
        <div className='my-4'>
            <div className='flex mx-4 gap-4 my-4'>
                {
                    isLoading && <Loader className='w-10 h-10 animate-spin'/>
                }
                
                {/* image */}
                {
                    form.images.map((item, index) =>
                        <div className='relative' key={index}>
                            <img
                                className='w-24 h-24 hover:scale-105'
                                src={item.url} />
                            <span
                                onClick={() => handleDelete(item.public_id)}
                                className='absolute top-0 right-1 bg-red-500 p-0.5 rounded-md'>X</span>
                        </div>
                    )
                }
            </div>

            <div>
                <input
                    onChange={(handleOnchange)}
                    type="file"
                    name='images'
                    multiple
                    className="file:px-2 file:py-1 file:rounded-md file:border file:text-sm cursor-pointer"
                />
            </div>


        </div>
    )
}

export default UploadFile