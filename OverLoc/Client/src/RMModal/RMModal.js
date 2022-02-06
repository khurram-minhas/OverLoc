import React, { useEffect, useState } from 'react'
import { Modal } from 'react-bootstrap';
import RMButton from './RMButton';

function RMModal({ showModal, setShowModal, onOk, body, heading, okButtonText = 'Yes, Proceed', noButtonText = 'No, Cancel', isOkOnly = false, icon = null }) {
    return (
        <Modal show={showModal} onHide={() => { setShowModal(false) }} style={{ borderRadius: '6px' }}>
            <Modal.Header style={{ color: 'red', fontWeight: 'bold', fontSize: '1.25rem', display: 'inline' }} >{icon ? <><img src={icon} height={25} width={25}/>&ensp;</> : null}{heading}</Modal.Header>
            <Modal.Body style={{ fontSize: '1.125rem', padding: '0 1rem',whiteSpace: 'pre-wrap' }}>
                {body}
            </Modal.Body>
            <Modal.Footer>
                <RMButton customStyle={{ backgroundColor: '#55297C', width: '9.5rem' }} onClick={onOk}>{okButtonText}</RMButton>
                {!isOkOnly ? <RMButton className='btn-outline-yellow-wide' onClick={() => setShowModal(false)}>{noButtonText}</RMButton> : null}
                
            </Modal.Footer>
        </Modal>
    )
}

export default RMModal
