import classNames from 'classnames/bind';
import styles from './SearchDropdown.module.scss';
import { useSelector, useDispatch } from 'react-redux';
import { actions } from "../../../store/modules";
import { nowSelectedVideoList } from '../../../store/modules/selectedVideo';
import { nowVideoList } from '../../../store/modules/video';
import * as Hangul from 'hangul-js';
import { useRef } from 'react';
import _, {debounce} from 'lodash';
import axios from 'axios';

const cx = classNames.bind(styles);

function VideoDropdown(searchWord) {
  const dispatch = useDispatch();
  const isSelectedVideoList = useSelector(nowSelectedVideoList)
  const isVideoList = useSelector(nowVideoList)

  const handleBtn = (btnId) => (e) => {
    e.preventDefault();
    dispatch(actions.selectSelectedVideo(btnId))
  };

  const handleClickClose = (btnId) => (e) => {
    e.preventDefault();
    dispatch(actions.closeSelectedVideo(btnId))
  };



  const handleClickCloseAll = () => {
    Object.keys(isSelectedVideoList.selectedVideoList).map((keyName, i) => (
      dispatch(actions.closeSelectedVideo(keyName))
    ))
    searchWord.setSearchWord("")
  };

  const handleClickSelectAll = () => {
    Object.keys(isSelectedVideoList.selectedVideoList).map((keyName, i) => (
      dispatch(actions.selectAllSelectedVideo(keyName))
    ))
  };

  function compareWord(origin) {
    let compareTitle = origin;
    let filteredTitle = Hangul.disassemble(compareTitle,true);
    console.log(searchWord.searchWord)
    let chosung="";
    for (var i=0,l=filteredTitle.length;i<l;i++){
      chosung+=filteredTitle[i][0];
    }
    return chosung
  }

  async function test() {
    const response = await axios.get("http://localhost:8000/videoList");
     console.log(response.data);
     let testArr = [...isVideoList];
     dispatch((actions.updateVideoList(testArr.concat(response.data))))
     console.log(testArr.concat(response.data))
   }

  const modalRef = useRef();

  const modalScroll = _.debounce(() => {
    const { scrollHeight, scrollTop, clientHeight } = modalRef.current;
    if (scrollHeight && scrollTop && clientHeight && scrollHeight - 10 < scrollTop + clientHeight) test();  
  }, 200);

    return (
      <>
        <div className={cx("videoContainer")}>
            {/* <div className={cx("selectAll")} onClick={handleClickSelectAll}>/</div> ???*/}

            <div className={cx("deleteAll")} onClick={handleClickCloseAll}>X</div>
            <div className={cx("videoHeader")}>
            {isSelectedVideoList.selectedVideoList && Object.keys(isSelectedVideoList.selectedVideoList).map((keyName, i) => (
                    isSelectedVideoList.selectedVideoList[keyName] ? <div className={cx('videoHeaderBox')}  onClick={!undefined && handleClickClose(i)} key={i}>{!undefined && isVideoList[i]['title'].substr(0,10)}<span>x</span> </div> : null
                ))}
                
            </div>
            <div className={cx("videoItems")} ref={modalRef} onScroll={modalScroll}>
                {isVideoList.filter((val)=> {
                  if (searchWord.searchWord == "")
                  {return val}
                  else if (val.title.toLowerCase().includes(searchWord.searchWord.toLowerCase()) || (Hangul.search(val.title.toLowerCase(), searchWord.searchWord.toLowerCase()) > -1) || compareWord(val.title.toLowerCase()).includes(searchWord.searchWord.toLowerCase()))
                  {return val}
                  return false
                } 
                ).map((videoInfo, i) => {
                    return (
                        <div 
                        className={cx(`videoItem_${isSelectedVideoList.selectedVideoList[videoInfo.id-1]}`)} 
                        id='videoItem' 
                        onClick={!undefined && handleBtn(i)} 
                        style={{ backgroundColor: isSelectedVideoList.selectedVideoList[i] ? "#D0E9FF" : "#ffffff" }}
                        key = {i}
                        >
                        <div className={cx('videoImageWrap')}>
                            <img className={cx('videoImage')} src={videoInfo.url} alt="imgUrl" />
                        </div>
                        <div className={cx('videoImageText')}>
                            ?????? : {!undefined && videoInfo.title} <br />
                            ?????? ?????? : {!undefined && videoInfo.description} <br />
                            ?????? ??? : {!undefined && videoInfo.viewCount} ??? <br />
                            ?????? ??? : {!undefined && videoInfo.commentCount} ??? <br />
                            ????????? ??? : {!undefined && videoInfo.likeCount} ??? <br />
                            ????????? ?????? : {!undefined && videoInfo.upload} <br />
                        </div>
                    </div>
                    )
                }
                )}
            </div>
        </div>
      </>
    );
}

export default VideoDropdown;