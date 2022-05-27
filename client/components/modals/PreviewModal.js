import React from 'react'
import { Modal } from 'antd'
import ReactPlayer from 'react-player'

const PreviewModal = ({showModal, setShowModal, preview}) => {
  return (
    <>
      <Modal 
      title="Course Preview"
      visible={showModal}
      onCancel={()=> setShowModal(!showModal)}
      width={720}
      footer={null}

      
      >
          <div className="wrapper">
                <ReactPlayer 
                playing={showModal}
                url={preview}
                controls={true}
                width="100%"
                height="100%"
                />
              </div> 
      </Modal>
    </>
  )
}

export default PreviewModal