import { Button, Progress, Tooltip } from 'antd';
import { CloseCircleFilled } from '@ant-design/icons';
import { Switch } from 'antd';
import ReactPlayer from 'react-player';

const UpdateLessonForm = ({
  current,
  setCurrent,
  handleUpload,
  handleUpdateLesson,
  uploadVideoButtonText,
  handleVideo,
  uploading,
  progress,
}) => {
  return (
    <div className='container pt-3'>
      {
        //JSON.stringify(current)
      }
      <form onSubmit={handleUpdateLesson}>
        <input
          type='text'
          className='form-control mt-3'
          onChange={(e) => setCurrent({ ...current, title: e.target.value })}
          placeholder='Title'
          autoFocus
          required
          value={current.title}
        />

        <textarea
          className='form-control mt-3'
          cols='7'
          rows='7'
          onChange={(e) => {
            setCurrent({ ...current, content: e.target.value });
          }}
          value={current.content}
        ></textarea>

          <input
          type='text'
          className='form-control mt-3'
          onChange={(e) => setCurrent({ ...current, embed: e.target.value })}
          placeholder='Embed Link'
          autoFocus
          required
          value={current.embed}
        />

        <div>
          {!uploading && current.video && current.video.Location && (
            <div className='pt-2 d-flex justify-content-center'>
              <ReactPlayer
                url={current.video.Location}
                width='452px'
                height='240px'
                controls
              />
            </div>

            /*
            <Tooltip title="Remove">
            <span onClick={handleVideoRemove} className="pt-1 pl-3">
              <CloseCircleFilled  className='text-danger d-flex justify-content-center'/>
            </span>
          </Tooltip>
          */
          )}

          <label className='btn btn-dark btn-block text-left mt-3'>
            {uploadVideoButtonText}
            <input onChange={handleVideo} type='file' accept='video/*' hidden />
          </label>
        </div>
        <br />

        {progress > 0 && (
          <Progress
            className='d-flex justify-content-center pt-2'
            percent={progress}
            steps={10}
          />
        )}

        <div className='d-flex justify-content-between'>
          <button className='btn btn-danger badge'>Preview</button>
          <Switch
            className='float-right mt-2'
            disabled={uploading}
            checked={current.free_preview}
            name='free_preview'
            onChange={(v) => setCurrent({ ...current, free_preview: v })}
          />
        </div>

        <Button
          onClick={handleUpdateLesson}
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

export default UpdateLessonForm;
