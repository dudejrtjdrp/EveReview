import React, { useRef, useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './SearchDropdown.module.scss';
import VideoDropdown from './VideoDropdown';
import {  useDispatch } from 'react-redux';
import { actions } from "../../../store/modules";
import axios from 'axios';

const cx = classNames.bind(styles);



function SearchDropdown(props) {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [isLeave, setIsLeave] = useState(false);
  const [searchWord, setSearchWord] = useState("");

  async function getVideoSelectedList() {
   const response = await axios.get("http://localhost:8000/videoList");
    console.log(response.data);
    dispatch((actions.updateSelectedVideoList({selectedVideoList:Array(500).fill(false)})));
    dispatch((actions.updateVideoList(response.data)))
  }

  useEffect(() => {
    getVideoSelectedList()
    console.log('get Data!')
  },[]);



  const [thissData,setThissData] = useState([])
  const [isSelectedCommentArray, setIsSelectedCommentArray] = useState([])

  const setSelect = (number) => {
    let testArr = [...isSelectedCommentArray];
    setThissData(thissData.concat(testArr))
    console.log(thissData)
  };




  function handleClickOpen(){
    setIsOpen(true)
  };  
  function handleClickClose(){
    if (isLeave === true) {
    setIsOpen(false)
    console.log('click!!')
  }
  };  
  function handleClickEnter(){
    console.log('enter')
    setIsLeave(false)
  };
  function handleClickLeave(){
    console.log('leave')
    setIsLeave(true)
  };

  function useOutsideAlerter(ref) {
    useEffect(() => {
      function handleClickOutside(event) {
        if (ref.current && !ref.current.contains(event.target)) {
          setIsOpen(false)
        }
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref]);
  }

  const wrapperRef = useRef(null);
  useOutsideAlerter(wrapperRef);



    return (
      <div className={cx("searchContainer")} >
        <div className={cx("menu-container")} ref={wrapperRef}>
          <input 
          type="text" 
          className={cx("videoSearchWrap")} 
          onClick={handleClickOpen} 
          placeholder="????????? ???????????? ??????????????? ?????? ????????? ??????????????????!" 
          onChange={(e) => {
          setSearchWord(e.target.value);
          }}
          value = {searchWord}
          >
          </input>
          {isOpen ? <VideoDropdown searchWord={searchWord} setSearchWord={setSearchWord} /> : null}
        </div>
      </div>
    );
}

export default SearchDropdown;