import React from 'react'
import { Select,Button,Badge } from 'antd';
import Avatar from 'antd/lib/avatar/avatar';
import courseModel from '../../../server/models/courseModel';

const { Option } = Select;



const CourseCreateForm = ({
    handleSubmit,
    handleChange,
    handleImage,
    handleRemoveImage = (f)=>f,
    values,
    setValues,
    preview,
    uploadButtonText,
    editPage = false,
}) => {

  const children = []

  for(let i=9.99; i<=99.99;i++){
      children.push(<Option key={i.toFixed(2)}>${i.toFixed(2)}</Option>)
  }

  return (
    <>
      {values &&
        <form onSubmit={handleSubmit} className='form-group'>
        <div className='form-group'>
          <input
            type='text'
            name='name'
            className='form-control'
            placeHolder='Name'
            value={values.name}
            onChange={handleChange}
          />
        </div>
    
        <div className='form-group'>
          <br />
          <textarea
            name='description'
            cols='7'
            rows='7'
            value={values.description}
            className='form-control'
            onChange={handleChange}
          ></textarea>
    
          <div className='form-row pt-4'>
            <div className='col-md-6'>
            <div className='form-group '>
              <Select
                style={{ width: '100%' }}
                size='large'
                value={values.paid}
                onChange={(v) => setValues({ ...values, paid: !values.paid })}
              >
                <Option value={true}>Paid</Option>
                <Option value={false}>Free</Option>
              </Select>
            </div>
            </div>
          </div>
          {values.paid && <div className='col-md-6 pt-4'>
              <div className="form-group">
                <Select 
                defaultValue="9.99"
                style={{width:"100%"}}
                onChange = {(v)=> setValues({...values,price:v})}
                tokenSeparators={[,]}
                size="large"
                >
                  {children}
                </Select>
              </div>
            </div>}
    
    {/* In categories section we will have to provide the fixed categories when we need them */}
            <div className='form-group pt-4'>
              <Select defaultValue={values.category} onChange={(v)=>setValues({...values,category:v})} style={{width:"100%"}}
>
                <Option value="web-dev">Web Development</Option>
                <Option value="web-design">Web Design</Option>
                <Option value="programming-funda">Programming Fundamentals</Option>
                <Option value="data-structures">Data Structures</Option>
                <Option value="cse-fundas">Computer Science</Option>
                <Option value="video-editing">Video Editing</Option>
                <Option value="graphics-design">Graphics design</Option>

              </Select>
          {/* 
          If possible we can select these categories
            <input
            type='text'
            name='category'
            className='form-control'
            placeHolder='Category'
            value={values.category}
            onChange={handleChange}

          />
          */}
        </div>
    
          <div className='form-row pt-3'>
            <div className='col-md-6'>
              <div className='form-group'>
                <label className='btn btn-outline-secondary btn-block text-left'>
                  {uploadButtonText}
                  <input
                    type='file'
                    name='image'
                    onChange={handleImage}
                    accept='image/*'
                    hidden
                  />
                </label>
              </div>
            </div>
          </div>
    
          {preview && (
            <div className="col pt-3">
              <Badge count="X" onClick={handleRemoveImage} className="pointer">
              <Avatar width={200} src={preview} size="large" />
              </Badge>
    
              </div>
          )}

          {editPage ? 'true': 'false'}
    
          {
            editPage && values.image&&
            <div className="col pt-3">
            <Badge count="X" onClick={handleRemoveImage} className="pointer">
            <Avatar width={200} src={values.image.Location ||course.jpg} size="large" />
            </Badge>
    
            </div>
          }
    
          <div className='row pt-3'>
            <div className='col'>
              <Button
                onClick={handleSubmit}
                disabled={values.loading || values.uploading}
                className='btn btn-primary'
                loading={values.loading}
                size="large"
                type="primary"
                shape="round"
              >
                {values.loading ? 'Saving...': "Save & Continue"}
              </Button>
            </div>
          </div>
        </div>
      </form>
      }
    </>

  )
}

export default CourseCreateForm