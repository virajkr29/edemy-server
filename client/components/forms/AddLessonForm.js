import { Button, Progress,Tooltip } from 'antd';
import { CloseCircleFilled } from '@ant-design/icons';

const AddLessonForm = ({
  values,
  setValues,
  handleAddLesson,
  handleVideoRemove,
  uploading,
  uploadButtonText,
  handleVideo,
  progress,
}) => {
  return (
    <div className='container pt-3'>
      Add Lessons Here
      <form onSubmit={handleAddLesson}>
        <input
          type='text'
          className='form-control mt-3'
          onChange={(e) => setValues({ ...values, title: e.target.value })}
          placeholder='Title'
          autoFocus
          required
          value={values.title}
        />

        <textarea
          className='form-control mt-3'
          cols='15'
          rows='12'
          onChange={(e) => {
            setValues({ ...values, content: e.target.value });
          }}
          value={values.content}
        ></textarea>

         <input
          type='text'
          className='form-control mt-3'
          onChange={(e) => setValues({ ...values, embed: e.target.value })}
          placeholder='Embed Link'
          autoFocus
          required
          value={values.embed}
        />

        <div className="d-flex justify-content-center">
        <label className='btn btn-dark btn-block text-left mt-3'>
          {uploadButtonText}
          <input onChange={handleVideo} type='file' accept='video/*' hidden />
        </label>

        {!uploading && values.video.Location && (
          <Tooltip title="Remove">
            <span onClick={handleVideoRemove} className="pt-1 pl-3">
              <CloseCircleFilled  className='text-danger d-flex justify-content-center'/>
            </span>
          </Tooltip>
        )}
        </div>
        <br />

        {progress > 0 && (
          <Progress className='d-flex justify-content-center pt-2'
            percent={progress}
            steps={10}
          />
        )}
        <Button
          onClick={handleAddLesson}
          className='col mt-3'
          size='large'
          type='primary'
          loading={uploading}
          shape='round'
        >
          Save Video
        </Button>
      </form>
    </div>
  );
};

export default AddLessonForm;
