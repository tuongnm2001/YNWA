import { useLocation } from "react-router-dom";
import ViewDetail from "../../components/Book/ViewDetail";
import { fetchBookById } from "../../services/api";
import { useEffect } from "react";
import { useState } from "react";

const BookDetail = () => {

    const [dataBook, setDataBook] = useState([])
    const location = useLocation();

    const param = new URLSearchParams(location.search)

    const id = param?.get('id');

    const getBookById = async (id) => {
        const res = await fetchBookById(id)
        if (res && res.data) {
            let raw = res.data;
            raw.items = getImages(raw);
            setTimeout(() => {
                setDataBook(raw)
            }, 500)
        }
    }

    useEffect(() => {
        getBookById(id)
    }, [id])

    const getImages = (raw) => {
        const images = [];
        if (raw.thumbnail) {
            images.push({
                original: `${import.meta.env.VITE_BACKEND_URL}/images/book/${raw?.thumbnail}`,
                thumbnail: `${import.meta.env.VITE_BACKEND_URL}/images/book/${raw?.thumbnail}`,
                originalClass: 'original-image',
                thumbnailClass: 'thumbnail-image',
            })
        }

        if (raw.slider) {
            raw.slider.map(item => {
                images.push({
                    original: `${import.meta.env.VITE_BACKEND_URL}/images/book/${item}`,
                    thumbnail: `${import.meta.env.VITE_BACKEND_URL}/images/book/${item}`,
                    originalClass: 'original-image',
                    thumbnailClass: 'thumbnail-image',
                })
            })
        }
        return images;
    }

    return (
        <>
            <ViewDetail
                dataBook={dataBook}
            />
        </>
    );
}

export default BookDetail;