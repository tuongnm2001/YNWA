import React, { useState } from 'react';
import { Button, Modal, Row } from 'antd';
import ReactImageGallery from 'react-image-gallery';
import './ModalGallery.scss'

const ModalGallery = (props) => {

    const { open, setOpen, images, dataBook, currentIndex } = props;

    return (
        <>
            <Modal
                open={open}
                onCancel={() => setOpen(false)}
                cancelText={() => setOpen(false)}
                centered
                closable={false}
                footer={null}
                title={dataBook.mainText}
                className='custom-modal-gallery'
                width={800}
            >
                <ReactImageGallery
                    startIndex={currentIndex}
                    additionalClass='modal-Img'
                    thumbnailPosition='right'
                    items={images}
                    showPlayButton={false} //hide play button
                    showFullscreenButton={false} //hide fullscreen button
                    slideOnThumbnailOver={true}  //onHover => auto scroll images
                />
            </Modal >
        </>
    );
}

export default ModalGallery;