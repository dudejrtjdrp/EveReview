import React, { useState } from "react";
import PropTypes from "prop-types";
import cn from "classnames";
import styles from '../../Pages/MainPage.module.scss';
import classNames from 'classnames/bind';
import { UilArrowUp, UilArrowDown } from '@iconscout/react-unicons';
import "./style.css";


const cx = classNames.bind(styles);

/*
 * Read the blog post here:
 * https://letsbuildui.dev/articles/building-a-vertical-carousel-component-in-react
 */

const VerticalCarousel = ({ data, leadingText }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [btnColor, setBtnColor] = useState(false);
  // Used to determine which items appear above the active item
  const halfwayIndex = Math.ceil(data.length / 2);

  // Usd to determine the height/spacing of each item
  const itemHeight = 52;

  // Used to determine at what point an item is moved from the top to the bottom
  const shuffleThreshold = halfwayIndex * itemHeight;

  // Used to determine which items should be visible. this prevents the "ghosting" animation
  const visibleStyleThreshold = shuffleThreshold / 2;

  const determinePlacement = (itemIndex) => {
    // If these match, the item is active
    if (activeIndex === itemIndex) return 0;

    if (itemIndex >= halfwayIndex) {
      if (activeIndex > itemIndex - halfwayIndex) {
        return (itemIndex - activeIndex) * itemHeight;
      } else {
        return -(data.length + activeIndex - itemIndex) * itemHeight;
      }
    }

    if (itemIndex > activeIndex) {
      return (itemIndex - activeIndex) * itemHeight;
    }

    if (itemIndex < activeIndex) {
      if ((activeIndex - itemIndex) * itemHeight >= shuffleThreshold) {
        return (data.length - (activeIndex - itemIndex)) * itemHeight;
      }
      return -(activeIndex - itemIndex) * itemHeight;
    }
  };

  const handleClick = (direction) => {
    setActiveIndex((prevIndex) => {
      if (direction === "next") {
        setBtnColor(false);
        if (prevIndex + 1 > data.length - 1) {
          return 0;
        }
        return prevIndex + 1;
      }

      if (prevIndex - 1 < 0) {
        setBtnColor(true);
        return data.length - 1;
      }
      setBtnColor(true);
      return prevIndex - 1;
    });
  };

  return (
    <div className="container">
      <section className="outer-container">
      <div className={cx('arrowUpWrap')} onClick={() => handleClick("prev")}>
            <UilArrowUp className={cx('arrowUp')} style={btnColor ? {color:'#2f2f2f'} : {color:'#2f2f2f54'}}/>
            </div>
            <div className={cx('arrowDownWrap')} onClick={() => handleClick("next")}>
            <UilArrowDown className={cx('arrowDown')} style={btnColor ? {color:'#2f2f2f54'} : {color:'#2f2f2f'}} />
            </div>
            <div className={cx('mockCategory')} >
              <div className={cx('mockCategory1')}>순위</div>
              <div className={cx('mockCategory2')}>피드백</div>
              <div className={cx('mockCategory3')}>총 댓글 수</div>
              <div className={cx('mockCategory4')}>좋아요</div>
            </div>
        <div className="carousel-wrapper">
          
          <div className="carousel">
            <div className="slides">
              <div className="carousel-inner">
                <div className={cx('gradient')}></div>
                {data.map((item, i) => (
                  <button
                    type="button"
                    onClick={() => setActiveIndex(i)}
                    className={cn("carousel-item", {
                      active: activeIndex === i,
                      visible:
                        Math.abs(determinePlacement(i)) <= visibleStyleThreshold
                    })}
                    key={item.id}
                    style={{
                      transform: `translateY(${determinePlacement(i)}px)`
                    }}
                  >
                    <div className="itemWrap">
                      <div className="itemFeedback">{item.feedback}위</div>
                      <div className="itemComment">{item.commentN}</div>
                      <div className="itemLike">{item.like} 개</div>
                      <div className="itemDislike">{item.dislike} 개</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
};

VerticalCarousel.propTypes = {
  data: PropTypes.array.isRequired,
  leadingText: PropTypes.string.isRequired
};

export default VerticalCarousel;